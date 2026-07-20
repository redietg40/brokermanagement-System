// ============================================================
// FindBroker - Administration Panel Controllers (admin-panel.js)
// ============================================================

// Check authentication state on page load
document.addEventListener("DOMContentLoaded", () => {
  if (DB_isAdminLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }
});

// Show Login Screen Overlay
function showLogin() {
  document.getElementById("adminLoginScreen").style.display = "flex";
  document.getElementById("adminDashboardLayout").style.display = "none";
}

// Show Dashboard Layout
function showDashboard() {
  document.getElementById("adminLoginScreen").style.display = "none";
  document.getElementById("adminDashboardLayout").style.display = "grid";
  initDashboardData();
}

// Handle Login Form Submission
async function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  const success = await DB_adminLogin(email, password);
  if (success) {
    showAdminNotification("Authentication successful. Welcome Admin!", "success");
    setTimeout(() => {
      showDashboard();
    }, 1000);
  } else {
    showAdminNotification("Invalid administrative credentials. Access denied.", "error");
  }
}

// Handle Logout Button Click
function handleAdminLogout() {
  DB_clearAdminSession();
  showAdminNotification("Administrative session ended.", "info");
  setTimeout(() => {
    showLogin();
  }, 800);
}

// Switch between dashboard sections/tabs
function switchTab(tabId) {
  // Update sidebar active state
  const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
  navItems.forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("onclick") && item.getAttribute("onclick").includes(`'${tabId}'`)) {
      item.classList.add("active");
    }
  });

  // Switch tab visibility
  const panels = document.querySelectorAll(".tab-panel");
  panels.forEach(panel => {
    panel.classList.remove("active");
  });
  document.getElementById(`tab-${tabId}`).classList.add("active");

  // Update Title
  const titles = {
    pending: "Pending Broker Approvals",
    brokers: "Registered Broker Registry",
    listings: "Global Property Listing Registry"
  };
  document.getElementById("tabTitle").textContent = titles[tabId] || "Dashboard";
}

// Load and Render Stats & Tables
async function initDashboardData() {
  // Show loading state
  setStatLoading();

  try {
    // Fetch stats directly from the dedicated /admin/stats endpoint
    const statsRes = await fetch("/api/admin/stats");
    const statsData = await statsRes.json();

    if (statsData.success) {
      document.getElementById("statPendingBrokers").textContent = statsData.stats.pendingBrokers;
      document.getElementById("statApprovedBrokers").textContent = statsData.stats.approvedBrokers;
      document.getElementById("statTotalListings").textContent = statsData.stats.totalListings;

      // Sidebar Badge Count
      const badge = document.getElementById("badgePendingCount");
      if (badge) {
        badge.textContent = statsData.stats.pendingBrokers;
        badge.style.display = statsData.stats.pendingBrokers > 0 ? "inline-block" : "none";
      }
    }

    // Fetch all brokers and listings for tables
    const [brokers, listings] = await Promise.all([
      DB_getBrokers(),
      DB_getListings()
    ]);

    const pendingBrokers = brokers.filter(b => b.status === "pending");

    renderPendingTable(pendingBrokers);
    renderBrokersTable(brokers);
    renderListingsTable(listings);

  } catch (err) {
    console.error("Dashboard load error:", err);
    showAdminNotification("Failed to load dashboard data. Is the backend running on port 5000?", "error");
  }
}

function setStatLoading() {
  ["statPendingBrokers", "statApprovedBrokers", "statTotalListings"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "…";
  });
}

// Render Pending Approvals Table
function renderPendingTable(pendingBrokers) {
  const tbody = document.querySelector("#pendingBrokersTable tbody");
  if (!tbody) return;

  if (!pendingBrokers || pendingBrokers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 3rem 0;"><i class="fas fa-check-circle" style="font-size:2rem; margin-bottom:0.5rem; display:block; color:#22c55e;"></i>No pending verification requests.</td></tr>`;
    return;
  }

  tbody.innerHTML = pendingBrokers.map(b => {
    const initials = b.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const since = new Date(b.registeredAt).toLocaleDateString('en-US', { dateStyle: 'medium' });
    return `
      <tr>
        <td>
          <div class="user-info-cell">
            <div class="user-avatar-placeholder">${initials}</div>
            <div class="user-name-email">
              <span class="user-name">${b.name}</span>
              <span class="user-email">${b.email}</span>
              <span style="font-size:0.72rem; color:#94a3b8;">📞 ${b.phone || 'N/A'} &nbsp;|&nbsp; Registered: ${since}</span>
            </div>
          </div>
        </td>
        <td><code style="font-weight:600; color:#475569; background:#f1f5f9; padding:2px 6px; border-radius:4px;">${b.licenseNumber || "N/A"}</code></td>
        <td>${b.city || "N/A"}</td>
        <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.bio || ''}">${b.bio || "No bio description provided."}</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-sm btn-outline" onclick="viewBrokerDetailsAdmin('${b.id}')"><i class="fas fa-info-circle"></i> View Profile</button>
            <button class="btn btn-sm btn-success" onclick="approveBrokerAction('${b.id}')"><i class="fas fa-check"></i> Approve</button>
            <button class="btn btn-sm btn-danger" onclick="rejectBrokerAction('${b.id}')"><i class="fas fa-times"></i> Reject</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Render All Brokers Table
function renderBrokersTable(brokers) {
  const tbody = document.querySelector("#allBrokersTable tbody");
  if (!tbody) return;

  if (!brokers || brokers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 3rem 0;">No brokers registered in the database.</td></tr>`;
    return;
  }

  tbody.innerHTML = brokers.map(b => {
    const initials = b.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const dateFormatted = new Date(b.registeredAt).toLocaleDateString('en-US', { dateStyle: 'medium' });
    return `
      <tr>
        <td>
          <div class="user-info-cell">
            <div class="user-avatar-placeholder">${initials}</div>
            <div class="user-name-email">
              <span class="user-name">${b.name}</span>
              <span class="user-email">${b.email}</span>
            </div>
          </div>
        </td>
        <td><code style="font-weight:600; color:#475569;">${b.licenseNumber || "N/A"}</code></td>
        <td>${b.city || "N/A"}</td>
        <td>${dateFormatted}</td>
        <td><span class="status-badge ${b.status}">${b.status}</span></td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-sm btn-outline" onclick="viewBrokerDetailsAdmin('${b.id}')"><i class="fas fa-info-circle"></i> View Profile</button>
            ${b.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="approveBrokerAction('${b.id}')"><i class="fas fa-check"></i> Approve</button>` : ''}
            <button class="btn btn-sm btn-danger" onclick="deleteBrokerAction('${b.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Render All Listings Table
function renderListingsTable(listings) {
  const tbody = document.querySelector("#allListingsTable tbody");
  if (!tbody) return;

  if (!listings || listings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 3rem 0;">No listings found.</td></tr>`;
    return;
  }

  tbody.innerHTML = listings.map(l => {
    const firstImg = (l.images && l.images.length > 0) ? l.images[0] : 'images/villa2.jpg';
    const statusColor = l.listingStatus === 'approved' ? '#22c55e' : l.listingStatus === 'rejected' ? '#ef4444' : '#f59e0b';
    return `
      <tr>
        <td>
          <div class="property-info-cell">
            <img class="property-thumb" src="${firstImg}" onerror="this.src='images/villa2.jpg';">
            <div class="property-title-info">
              <span class="property-title">${l.title}</span>
              <span class="property-meta-specs" style="text-transform:capitalize;">${l.category || ''} · ${l.type}</span>
            </div>
          </div>
        </td>
        <td>${l.brokerName || (l.broker && l.broker.name) || "Unknown"}</td>
        <td style="text-transform: capitalize;">${(l.location || '').replace(/-/g, ' ')}</td>
        <td style="font-weight:700; color:#2563eb;">${new Intl.NumberFormat('en-ET').format(l.price)} ETB</td>
        <td>
          <span style="display:inline-block; padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:600; background:${statusColor}20; color:${statusColor}; text-transform:capitalize;">
            ${l.listingStatus || 'pending'}
          </span>
        </td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-sm btn-outline" onclick="viewListingDetailsAdmin('${l.id}')"><i class="fas fa-eye"></i> View</button>
            ${l.listingStatus !== 'approved' ? `<button class="btn btn-sm btn-success" onclick="approveListingAction('${l.id}')"><i class="fas fa-check"></i> Approve</button>` : ''}
            ${l.listingStatus === 'approved' ? `<button class="btn btn-sm" style="background:#94a3b8;color:#fff;border:none;" onclick="rejectListingAction('${l.id}')"><i class="fas fa-ban"></i> Revoke</button>` : ''}
            ${l.listingStatus === 'pending' ? `<button class="btn btn-sm btn-danger" onclick="rejectListingAction('${l.id}')"><i class="fas fa-times"></i> Reject</button>` : ''}
            <button class="btn btn-sm btn-danger" onclick="deleteListingAction('${l.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Filter Listings by category/status (called from search bar in admin panel)
async function filterListingsAdmin() {
  const catEl = document.getElementById('adminListingCatFilter');
  const statusEl = document.getElementById('adminListingStatusFilter');
  const searchEl = document.getElementById('adminListingSearch');

  const category = catEl ? catEl.value : '';
  const status = statusEl ? statusEl.value : '';
  const searchTerm = searchEl ? searchEl.value.toLowerCase() : '';

  let listings = await DB_getListingsFiltered(category, status);

  // Client-side title search
  if (searchTerm) {
    listings = listings.filter(l =>
      (l.title || '').toLowerCase().includes(searchTerm) ||
      (l.brokerName || '').toLowerCase().includes(searchTerm)
    );
  }

  renderListingsTable(listings);
}

// ============================================================
// Action Handlers — all properly async
// ============================================================

async function approveBrokerAction(brokerId) {
  const btn = event.currentTarget;
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Approving…'; }
  
  const success = await DB_approveBroker(brokerId);
  if (success) {
    showAdminNotification("✅ Broker verified and approved successfully.", "success");
    await initDashboardData();
  } else {
    showAdminNotification("Error approving broker. Please try again.", "error");
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check"></i> Approve'; }
  }
}

async function rejectBrokerAction(brokerId) {
  const reason = prompt("Enter registration rejection reason (optional):");
  if (reason === null) return; // cancelled

  const success = await DB_rejectBroker(brokerId, reason);
  if (success) {
    showAdminNotification("Broker registration rejected.", "info");
    await initDashboardData();
  } else {
    showAdminNotification("Error rejecting broker. Please try again.", "error");
  }
}

async function deleteBrokerAction(brokerId) {
  if (confirm("Are you sure you want to permanently delete this broker and all their associated property listings?")) {
    const success = await DB_deleteBroker(brokerId);
    if (success) {
      showAdminNotification("Broker and associated listings deleted successfully.", "success");
      await initDashboardData();
    } else {
      showAdminNotification("Error deleting broker. Please try again.", "error");
    }
  }
}

async function deleteListingAction(listingId) {
  if (confirm("Are you sure you want to permanently delete this property listing?")) {
    const success = await DB_deleteListing(listingId);
    if (success) {
      showAdminNotification("Listing deleted successfully.", "success");
      await initDashboardData();
    } else {
      showAdminNotification("Error deleting listing. Please try again.", "error");
    }
  }
}

async function approveListingAction(listingId) {
  const success = await DB_approveListingAdmin(listingId);
  if (success) {
    showAdminNotification("✅ Listing approved and is now publicly visible.", "success");
    await initDashboardData();
  } else {
    showAdminNotification("Error approving listing. Please try again.", "error");
  }
}

async function rejectListingAction(listingId) {
  const success = await DB_rejectListingAdmin(listingId);
  if (success) {
    showAdminNotification("Listing rejected / revoked from public view.", "info");
    await initDashboardData();
  } else {
    showAdminNotification("Error rejecting listing. Please try again.", "error");
  }
}

// View Full Broker Profile for Admin Inspection
async function viewBrokerDetailsAdmin(brokerId) {
  const broker = await DB_getBrokerById(brokerId);
  if (!broker) {
    showAdminNotification("Broker profile not found.", "error");
    return;
  }

  const content = document.getElementById("brokerDetailContent");
  if (!content) return;

  const joinDate = new Date(broker.registeredAt).toLocaleDateString('en-US', { dateStyle: 'long' });

  content.innerHTML = `
    <div style="display:flex; align-items:center; gap:1.25rem; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #e2e8f0;">
      <div style="width:60px; height:60px; border-radius:50%; background:#2563eb; color:white; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:700;">
        ${broker.name.slice(0,2).toUpperCase()}
      </div>
      <div>
        <h3 style="margin:0 0 0.25rem 0; color:#1e293b;">${broker.name}</h3>
        <p style="margin:0; color:#64748b; font-size:0.9rem;">${broker.email} · 📞 ${broker.phone || 'N/A'}</p>
        <span class="status-badge ${broker.status}" style="margin-top:0.4rem; display:inline-block;">${broker.status.toUpperCase()} BROKER</span>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; font-size:0.92rem; color:#334155;">
      <div style="background:#f8fafc; padding:1rem; border-radius:8px;">
        <h4 style="margin:0 0 0.75rem 0; color:#2563eb;"><i class="fas fa-certificate"></i> License &amp; Credentials</h4>
        <p style="margin:0.3rem 0;"><strong>License Code:</strong> ${broker.licenseNumber || 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>Issuing Authority:</strong> ${broker.licenseAuthority || 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>Expiry Date:</strong> ${broker.licenseExpiry || 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>Status:</strong> ${broker.licenseStatus || 'Pending'}</p>
        ${broker.licenseDoc ? `<p style="margin:0.5rem 0 0 0;"><a href="${broker.licenseDoc}" target="_blank" style="color:#2563eb; font-weight:600;"><i class="fas fa-file-download"></i> View Uploaded Trade License Document</a></p>` : ''}
      </div>

      <div style="background:#f8fafc; padding:1rem; border-radius:8px;">
        <h4 style="margin:0 0 0.75rem 0; color:#2563eb;"><i class="fas fa-briefcase"></i> Professional Details</h4>
        <p style="margin:0.3rem 0;"><strong>Years of Experience:</strong> ${broker.experience || '0-5'} Years</p>
        <p style="margin:0.3rem 0;"><strong>Specializations:</strong> ${Array.isArray(broker.specializations) ? broker.specializations.join(', ') : 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>Languages:</strong> ${Array.isArray(broker.languages) ? broker.languages.join(', ') : 'Amharic, English'}</p>
        <p style="margin:0.3rem 0;"><strong>Education:</strong> ${broker.educationLevel || "Bachelor's Degree"}</p>
      </div>

      <div style="background:#f8fafc; padding:1rem; border-radius:8px;">
        <h4 style="margin:0 0 0.75rem 0; color:#2563eb;"><i class="fas fa-address-book"></i> Contact &amp; Channels</h4>
        <p style="margin:0.3rem 0;"><strong>Secondary Phone:</strong> ${broker.secondaryPhone || 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>WhatsApp:</strong> ${broker.whatsapp || 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>Telegram:</strong> ${broker.telegram || 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>Office Address:</strong> ${broker.officeAddress || 'N/A'}</p>
      </div>

      <div style="background:#f8fafc; padding:1rem; border-radius:8px;">
        <h4 style="margin:0 0 0.75rem 0; color:#2563eb;"><i class="fas fa-piggy-bank"></i> Banking &amp; Metrics</h4>
        <p style="margin:0.3rem 0;"><strong>Bank Name:</strong> ${broker.bankName || 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>Account Number:</strong> ${broker.accountNumber || 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>Account Holder:</strong> ${broker.accountHolder || 'N/A'}</p>
        <p style="margin:0.3rem 0;"><strong>Commission Rate:</strong> ${broker.commissionRate || 2.0}%</p>
        <p style="margin:0.3rem 0;"><strong>Total Sales:</strong> ${broker.totalSales || 0}</p>
      </div>
    </div>

    <div style="margin-top:1rem; text-align:right; border-top:1px solid #e2e8f0; padding-top:1rem;">
      ${broker.status === 'pending' ? `<button class="btn btn-success" onclick="approveBrokerAction('${broker.id}'); closeModal('brokerDetailModal');"><i class="fas fa-check"></i> Approve License</button>` : ''}
      <button class="btn btn-outline" onclick="closeModal('brokerDetailModal')">Close</button>
    </div>
  `;

  document.getElementById("brokerDetailModal").classList.add("active");
}

// View Full Listing Details for Admin Inspection
async function viewListingDetailsAdmin(listingId) {
  const listing = await DB_getListingById(listingId);
  if (!listing) {
    showAdminNotification("Listing details not found.", "error");
    return;
  }

  const content = document.getElementById("listingDetailContent");
  if (!content) return;

  const images = (listing.images && listing.images.length > 0) ? listing.images : ['images/villa2.jpg'];
  const specs = listing.specs || {};

  content.innerHTML = `
    <div style="margin-bottom:1rem;">
      <span style="background:#2563eb; color:white; padding:3px 10px; border-radius:12px; font-size:0.8rem; font-weight:600; text-transform:capitalize;">${listing.category}</span>
      <span style="background:#10b981; color:white; padding:3px 10px; border-radius:12px; font-size:0.8rem; font-weight:600; text-transform:capitalize; margin-left:5px;">${listing.saleStatus || 'for-sale'}</span>
      <h2 style="margin:0.5rem 0 0.25rem 0; color:#1e293b;">${listing.title}</h2>
      <p style="color:#2563eb; font-size:1.5rem; font-weight:800; margin:0 0 1rem 0;">${new Intl.NumberFormat('en-ET').format(listing.price)} ETB</p>
    </div>

    <div style="display:flex; gap:10px; overflow-x:auto; margin-bottom:1.25rem; padding-bottom:5px;">
      ${images.map(img => `<img src="${img}" style="width:240px; height:160px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0;" onerror="this.src='images/villa2.jpg';" />`).join('')}
    </div>

    <div style="background:#f8fafc; padding:1rem; border-radius:8px; margin-bottom:1rem; border:1px solid #e2e8f0;">
      <h4 style="margin:0 0 0.5rem 0; color:#1e293b;"><i class="fas fa-list"></i> Specifications &amp; Attributes</h4>
      <pre style="background:#ffffff; padding:0.75rem; border-radius:6px; font-family:monospace; font-size:0.85rem; overflow-x:auto;">${JSON.stringify(specs, null, 2)}</pre>
    </div>

    <div style="margin-bottom:1.25rem;">
      <h4 style="margin:0 0 0.5rem 0; color:#1e293b;">Description</h4>
      <p style="color:#475569; font-size:0.95rem; line-height:1.6; white-space:pre-line;">${listing.description || 'No description'}</p>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; padding-top:1rem;">
      <div>
        <span style="font-size:0.85rem; color:#64748b;">Broker: <strong>${listing.brokerName || 'Broker'}</strong></span>
      </div>
      <div style="display:flex; gap:0.5rem;">
        ${listing.listingStatus !== 'approved' ? `<button class="btn btn-success btn-sm" onclick="approveListingAction('${listing.id}'); closeModal('listingDetailModal');"><i class="fas fa-check"></i> Approve Listing</button>` : ''}
        ${listing.listingStatus === 'approved' ? `<button class="btn btn-sm" style="background:#94a3b8;color:#fff;" onclick="rejectListingAction('${listing.id}'); closeModal('listingDetailModal');"><i class="fas fa-ban"></i> Revoke</button>` : ''}
        <button class="btn btn-outline btn-sm" onclick="closeModal('listingDetailModal')">Close</button>
      </div>
    </div>
  `;

  document.getElementById("listingDetailModal").classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function showAdminNotification(message, type = 'info') {
  let toastContainer = document.getElementById('adminToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'adminToastContainer';
    toastContainer.style.cssText = 'position:fixed; top:20px; right:20px; z-index:99999; display:flex; flex-direction:column; gap:10px;';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
  toast.style.cssText = `background:${bgColor}; color:white; padding:12px 20px; border-radius:6px; font-weight:500; font-size:0.9rem; box-shadow:0 4px 12px rgba(0,0,0,0.15); transition:all 0.3s ease;`;
  toast.textContent = message;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
