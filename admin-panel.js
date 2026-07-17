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
    const statsRes = await fetch("http://localhost:5000/api/admin/stats");
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
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 3rem 0;">No listings found.</td></tr>`;
    return;
  }

  tbody.innerHTML = listings.map(l => {
    const firstImg = (l.images && l.images.length > 0) ? l.images[0] : 'images/villa2.jpg';
    return `
      <tr>
        <td>
          <div class="property-info-cell">
            <img class="property-thumb" src="${firstImg}" onerror="this.src='images/villa2.jpg';">
            <div class="property-title-info">
              <span class="property-title">${l.title}</span>
              <span class="property-meta-specs">${l.bedrooms} Beds • ${l.bathrooms} Baths • ${l.area} m²</span>
            </div>
          </div>
        </td>
        <td>${l.brokerName || (l.broker && l.broker.name) || "Unknown Broker"}</td>
        <td style="text-transform: capitalize;">${l.type}</td>
        <td style="text-transform: capitalize;">${l.location.replace(/-/g, ' ')}</td>
        <td style="font-weight:700; color:#2563eb;">${new Intl.NumberFormat('en-ET').format(l.price)} ETB</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-sm btn-danger" onclick="deleteListingAction('${l.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
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

// Notification Drawer Helper
function showAdminNotification(message, type = "info") {
  let container = document.getElementById("notification");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification";
    container.className = "notification";
    document.body.appendChild(container);
  }

  container.className = `notification notification-${type} active`;
  container.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;

  setTimeout(() => {
    container.classList.remove("active");
  }, 5000);
}
