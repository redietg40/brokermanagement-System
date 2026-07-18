// ============================================================
// FindBroker - Broker Dashboard controller (broker-dashboard.js)
// ============================================================

let currentBroker = null;
let uploadedImagesBase64 = []; // Store base64 strings of uploaded files

document.addEventListener("DOMContentLoaded", async () => {
  await checkBrokerAuth();
  if (currentBroker) {
    await initDashboard();
  }
});

async function checkBrokerAuth() {
  const session = DB_getBrokerSession();

  // No session at all — redirect to login
  if (!session || !session.brokerId) {
    window.location.href = "broker-login.html";
    return;
  }

  // Use session status for immediate check (status is now stored on login)
  if (session.status && session.status !== 'approved') {
    DB_clearBrokerSession();
    window.location.href = "broker-login.html";
    return;
  }

  // Set a temporary currentBroker from session so the page can render immediately
  currentBroker = {
    id: session.brokerId,
    name: session.name,
    email: session.email,
    status: session.status || 'approved',
    totalSales: 0,
    rating: 0
  };

  // Set name immediately (page renders without waiting)
  const nameEl = document.getElementById("brokerSessionName");
  if (nameEl) nameEl.innerText = session.name;

  // Background: silently refresh full broker data from API
  // Only log out if the broker is explicitly non-approved — never log out on network errors
  try {
    const broker = await DB_getBrokerById(session.brokerId);
    if (broker) {
      if (broker.status !== 'approved') {
        // Broker was de-approved by admin after login
        DB_clearBrokerSession();
        window.location.href = "broker-login.html";
        return;
      }
      // Refresh full data
      currentBroker = broker;
      if (nameEl) nameEl.innerText = broker.name;
    }
    // If broker is null (API error / network issue) — keep current session, don't kick out
  } catch (err) {
    console.warn("Could not refresh broker data from API — using session cache.", err);
  }
}


async function initDashboard() {
  switchTab('overview');
  await loadOverviewStats();
  await renderRecentListings();
  await renderAllListings();
  populateProfileForm();
}

// Switch sidebar tabs
async function switchTab(tabId) {
  // Update nav buttons
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(btn => {
    btn.classList.remove("active");
  });
  
  // Find active nav item
  const tabs = ['overview', 'listings', 'add-listing', 'profile'];
  const idx = tabs.indexOf(tabId);
  if (idx !== -1) {
    const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
    if (navItems[idx]) navItems[idx].classList.add("active");
  }
  
  // Switch panels
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.remove("active");
  });
  const activePanel = document.getElementById(`tab-${tabId}`);
  if (activePanel) activePanel.classList.add("active");
  
  // Set headers
  const titles = {
    'overview': 'Dashboard Overview',
    'listings': 'My Listings',
    'add-listing': 'Add New Property',
    'profile': 'Profile Settings'
  };
  document.getElementById("tabTitle").innerText = titles[tabId] || 'Dashboard';
  
  // If moving to listings tab, refresh
  if (tabId === 'listings') {
    await renderAllListings();
  } else if (tabId === 'overview') {
    await loadOverviewStats();
    await renderRecentListings();
  }
}

// Load Overview Statistics
async function loadOverviewStats() {
  const listings = await DB_getListingsByBroker(currentBroker.id);
  const totalViews = listings.reduce((sum, item) => sum + (item.views || 0), 0);
  
  document.getElementById("statTotalListings").innerText = listings.length;
  document.getElementById("statTotalViews").innerText = totalViews;
  document.getElementById("statProductiveSales").innerText = currentBroker.totalSales || '0';
  document.getElementById("statRating").innerText = currentBroker.rating || '5.0';
}

// Populate Profile Form fields
function populateProfileForm() {
  document.getElementById("profileName").value = currentBroker.name;
  document.getElementById("profilePhone").value = currentBroker.phone || '';
  document.getElementById("profileCity").value = currentBroker.city || '';
  document.getElementById("profileBio").value = currentBroker.bio || '';
  document.getElementById("profileSales").value = currentBroker.totalSales || 0;
}

// Update Profile
async function submitProfile(event) {
  event.preventDefault();
  
  const name = document.getElementById("profileName").value.trim();
  const phone = document.getElementById("profilePhone").value.trim();
  const city = document.getElementById("profileCity").value.trim();
  const bio = document.getElementById("profileBio").value.trim();
  const sales = Number(document.getElementById("profileSales").value) || 0;
  
  const updated = await DB_updateBroker(currentBroker.id, {
    name, phone, city, bio, totalSales: sales
  });
  
  if (updated) {
    showNotification("Profile updated successfully!", "success");
    // Refresh local broker object
    currentBroker = await DB_getBrokerById(currentBroker.id);
    document.getElementById("brokerSessionName").innerText = currentBroker.name;
    await loadOverviewStats();
  } else {
    showNotification("Failed to update profile.", "error");
  }
}

// Render Listings Table on Overview
async function renderRecentListings() {
  const tbody = document.querySelector("#recentListingsTable tbody");
  const listings = (await DB_getListingsByBroker(currentBroker.id)).slice(-5).reverse(); // Get latest 5
  
  if (listings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No properties listed yet.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = listings.map(item => `
    <tr>
      <td style="font-weight:600; color:#1e293b;">${item.title}</td>
      <td style="text-transform:capitalize;">${item.type}</td>
      <td>${item.locationLabel}</td>
      <td style="font-weight:700; color:#2563eb;">${formatPrice(item.price)} ETB</td>
      <td>
        <span class="status-badge ${item.active ? 'active' : 'inactive'}">
          ${item.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td><i class="fas fa-eye"></i> ${item.views || 0}</td>
    </tr>
  `).join("");
}

// Render Full Listings Table
async function renderAllListings() {
  const tbody = document.querySelector("#allListingsTable tbody");
  const listings = (await DB_getListingsByBroker(currentBroker.id)).reverse();
  
  if (listings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No properties listed. Click 'Add Property' to start.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = listings.map(item => `
    <tr>
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${(item.images && item.images.length > 0) ? item.images[0] : 'images/villa2.jpg'}" style="width:50px; height:40px; object-fit:cover; border-radius:6px;" onerror="this.src='images/villa2.jpg';" />
          <div style="font-weight:600; color:#1e293b;">${item.title}</div>
        </div>
      </td>
      <td style="text-transform:capitalize;">${item.type}</td>
      <td>${item.locationLabel}</td>
      <td style="font-weight:700; color:#2563eb;">${formatPrice(item.price)} ETB</td>
      <td>
        <span class="status-badge ${item.active ? 'active' : 'inactive'}" style="cursor:pointer;" onclick="toggleListingActive('${item.id}')">
          ${item.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-outline" style="padding:0.35rem 0.7rem; font-size:0.8rem;" onclick="editListing('${item.id}')">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-outline" style="padding:0.35rem 0.7rem; font-size:0.8rem; border-color:#ef4444; color:#ef4444;" onclick="deleteListing('${item.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

// Toggle Listing Visibility
async function toggleListingActive(id) {
  const item = await DB_getListingById(id);
  if (!item) return;
  
  const updated = await DB_updateListing(id, { active: !item.active });
  if (updated) {
    showNotification(`Listing set to ${!item.active ? 'Active' : 'Inactive'}.`, "success");
    await renderAllListings();
  }
}

// Delete Listing
async function deleteListing(id) {
  if (confirm("Are you sure you want to delete this listing permanently?")) {
    await DB_deleteListing(id);
    showNotification("Listing deleted successfully.", "success");
    await renderAllListings();
  }
}

// Dynamic listing type options based on category
function updateListingTypeOptions() {
  const category = document.getElementById('listingCategory').value;
  const typeSelect = document.getElementById('listingType');
  
  const typeOptions = {
    'real-estate': ['villa', 'apartment', 'house', 'commercial', 'land', 'office'],
    'automotive': ['sedan', 'suv', 'truck', 'motorcycle', 'bus', 'van'],
    'electronics': ['smartphone', 'laptop', 'tablet', 'tv', 'camera', 'accessories'],
    'fashion': ['clothing', 'shoes', 'bags', 'jewelry', 'watches', 'accessories'],
    'food': ['restaurant', 'catering', 'grocery', 'beverages', 'bakery', 'farm-produce'],
    'agriculture': ['crops', 'livestock', 'equipment', 'farmland', 'seeds', 'fertilizers'],
    'services': ['cleaning', 'moving', 'repair', 'consulting', 'photography', 'legal'],
    'health': ['clinic', 'beauty-salon', 'gym', 'pharmacy', 'wellness', 'medical-equipment'],
    'sports': ['equipment', 'fitness', 'outdoor', 'team-sports', 'water-sports', 'cycling'],
    'education': ['tutoring', 'courses', 'books', 'school-supplies', 'training', 'workshops'],
    'travel': ['tours', 'hotels', 'flights', 'car-rental', 'packages', 'activities'],
    'construction': ['materials', 'equipment', 'renovation', 'design', 'plumbing', 'electrical']
  };

  const options = typeOptions[category] || ['general'];
  typeSelect.innerHTML = options.map(opt => 
    `<option value="${opt}">${opt.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>`
  ).join('');
}

// Edit Listing Mode
async function editListing(id) {
  const item = await DB_getListingById(id);
  if (!item) return;
  
  // Set form fields
  document.getElementById("editListingId").value = item.id;
  document.getElementById("listingTitle").value = item.title;
  // Restore category first, then update type options
  if (item.category) {
    document.getElementById("listingCategory").value = item.category;
    updateListingTypeOptions();
  }
  document.getElementById("listingType").value = item.type;
  document.getElementById("listingSaleStatus").value = item.saleStatus || 'for-sale';
  document.getElementById("listingLocation").value = item.location;
  document.getElementById("listingLocationLabel").value = item.locationLabel;
  document.getElementById("listingPrice").value = item.price;
  document.getElementById("listingArea").value = item.area;
  document.getElementById("listingBedrooms").value = item.bedrooms || 0;
  document.getElementById("listingBathrooms").value = item.bathrooms || 0;
  document.getElementById("listingDescription").value = item.description;
  
  // Set images for edit reference
  uploadedImagesBase64 = item.images || [];
  renderImagePreviews();
  
  document.getElementById("listingFormTitle").innerText = "Edit Property Details";
  document.getElementById("submitBtn").innerText = "Update Property";
  
  switchTab('add-listing');
}

function cancelListingEdit() {
  document.getElementById("listingForm").reset();
  document.getElementById("editListingId").value = "";
  uploadedImagesBase64 = [];
  document.getElementById("imagePreviewContainer").innerHTML = '<span class="placeholder-text">No images selected yet.</span>';
  
  document.getElementById("listingFormTitle").innerText = "Post a New Listing";
  document.getElementById("submitBtn").innerText = "Post Listing";
  
  switchTab('listings');
}

// Convert uploaded images to Base64 data URLs
function previewImages() {
  const fileInput = document.getElementById("listingImages");
  const files = fileInput.files;
  
  if (!files || files.length === 0) return;
  
  // Convert up to 3 files
  const itemsToProcess = Math.min(files.length, 3 - uploadedImagesBase64.length);
  
  let loadedCount = 0;
  for (let i = 0; i < itemsToProcess; i++) {
    const file = files[i];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      uploadedImagesBase64.push(e.target.result);
      loadedCount++;
      if (loadedCount === itemsToProcess) {
        renderImagePreviews();
      }
    };
    reader.readAsDataURL(file);
  }
}

function renderImagePreviews() {
  const container = document.getElementById("imagePreviewContainer");
  if (uploadedImagesBase64.length === 0) {
    container.innerHTML = '<span class="placeholder-text">No images selected yet.</span>';
    return;
  }
  
  container.innerHTML = uploadedImagesBase64.map((img, i) => `
    <div class="preview-item">
      <img src="${img}" alt="Preview" />
      <button class="remove-btn" type="button" onclick="removePreviewImage(${i})">&times;</button>
    </div>
  `).join("");
}

function removePreviewImage(index) {
  uploadedImagesBase64.splice(index, 1);
  renderImagePreviews();
}

// Create / Update listing submission
async function submitListing(event) {
  event.preventDefault();
  
  const editId = document.getElementById("editListingId").value;
  const title = document.getElementById("listingTitle").value.trim();
  const category = document.getElementById("listingCategory").value;
  const type = document.getElementById("listingType").value;
  const saleStatus = document.getElementById("listingSaleStatus").value;
  const location = document.getElementById("listingLocation").value;
  const locationLabel = document.getElementById("listingLocationLabel").value.trim();
  const price = Number(document.getElementById("listingPrice").value);
  const area = Number(document.getElementById("listingArea").value);
  const bedrooms = Number(document.getElementById("listingBedrooms").value) || 0;
  const bathrooms = Number(document.getElementById("listingBathrooms").value) || 0;
  const description = document.getElementById("listingDescription").value.trim();
  
  // Validate images count
  if (uploadedImagesBase64.length === 0) {
    showNotification("Please select at least 1 image for the listing.", "error");
    return;
  }

  const payload = {
    brokerId: currentBroker.id,
    brokerName: currentBroker.name,
    title, category, type, saleStatus, location, locationLabel, price, area,
    bedrooms, bathrooms, description,
    images: uploadedImagesBase64
  };
  
  if (editId) {
    // Update listing
    const success = await DB_updateListing(editId, payload);
    if (success) {
      showNotification("Listing updated successfully!", "success");
      cancelListingEdit();
    } else {
      showNotification("Failed to update listing.", "error");
    }
  } else {
    // Create listing
    const res = await DB_addListing(payload);
    if (res && res.success) {
      showNotification("Listing posted successfully!", "success");
      cancelListingEdit();
    } else {
      showNotification(res && res.message ? res.message : "Failed to post listing. Please check your connection.", "error");
    }
  }
}

// Format numbers
function formatPrice(price) {
  return new Intl.NumberFormat("en-ET").format(price);
}

// Sign out broker
function handleLogout() {
  DB_clearBrokerSession();
  window.location.href = "index.html";
}

// Helper notification
function showNotification(message, type = 'info') {
  const notification = document.getElementById("notification");
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 3000;
    font-weight: 500;
    display: block;
  `;
  notification.innerText = message;
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}
