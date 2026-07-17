// ============================================================
// FindBroker - Real Estate Listing Page Logic (real-estate.js)
// ============================================================

let currentViewMode = 'grid'; // 'grid' or 'list'
let activePropertyImages = {}; // Maps propertyId -> current image index
let allApprovedListings = []; // Local cache of approved listings from backend

document.addEventListener("DOMContentLoaded", async () => {
  await initRealEstatePage();
  await checkUrlParams();
});

async function initRealEstatePage() {
  updateAuthUI();
  try {
    allApprovedListings = await DB_getApprovedListings();
  } catch (error) {
    console.error("Failed to fetch listings:", error);
  }
  renderProperties();
  
  // Wire up filter changes
  document.getElementById("typeFilter").addEventListener("change", renderProperties);
  document.getElementById("locationFilter").addEventListener("change", renderProperties);
  document.getElementById("priceFilter").addEventListener("change", renderProperties);
  document.getElementById("keywordSearch").addEventListener("input", renderProperties);
}

// Check if a specific property id was passed in URL (e.g. real-estate.html?id=xxx)
async function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    await viewProperty(id);
  }
}

// Toggle grid / list view
function setViewMode(mode) {
  currentViewMode = mode;
  document.getElementById("gridViewBtn").classList.toggle("active", mode === 'grid');
  document.getElementById("listViewBtn").classList.toggle("active", mode === 'list');
  renderProperties();
}

// Format prices nicely
function formatPrice(price) {
  return new Intl.NumberFormat("en-ET").format(price);
}

// Get filtered listings from local cache
function getFilteredListings() {
  const listings = allApprovedListings;
  const type = document.getElementById("typeFilter").value;
  const location = document.getElementById("locationFilter").value;
  const priceRange = document.getElementById("priceFilter").value;
  const keyword = document.getElementById("keywordSearch").value.toLowerCase();

  return listings.filter(item => {
    // Type Filter
    if (type && item.type !== type) return false;
    
    // Location Filter
    if (location && item.location !== location) return false;
    
    // Price Range Filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (item.price < min || item.price > max) return false;
    }
    
    // Keyword Search
    if (keyword) {
      const matchesTitle = item.title.toLowerCase().includes(keyword);
      const matchesDesc = item.description.toLowerCase().includes(keyword);
      const matchesLoc = item.locationLabel.toLowerCase().includes(keyword);
      const matchesBroker = item.brokerName.toLowerCase().includes(keyword);
      if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesBroker) return false;
    }
    
    return true;
  });
}

// Render property grid / list
function renderProperties() {
  const grid = document.getElementById("propertiesGrid");
  const filtered = getFilteredListings();
  
  if (filtered.length === 0) {
    grid.style.display = 'block';
    grid.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; color: #64748b; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;">
        <i class="fas fa-home-alt" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem; display: block;"></i>
        <h3 style="font-size: 1.25rem; color: #1e293b; margin-bottom: 0.5rem;">No properties found</h3>
        <p>Try resetting the filters or modifying your search terms.</p>
      </div>
    `;
    return;
  }

  // Restore grid display layout
  grid.style.display = 'grid';
  grid.className = `properties-grid ${currentViewMode}-view`;

  grid.innerHTML = filtered.map(item => {
    // Determine active image index (default is 0)
    if (activePropertyImages[item.id] === undefined) {
      activePropertyImages[item.id] = 0;
    }
    const activeImgIdx = activePropertyImages[item.id];
    const imageCount = (item.images && item.images.length > 0) ? item.images.length : 1;
    const currentImgUrl = (item.images && item.images.length > 0) ? item.images[activeImgIdx] : 'images/villa2.jpg';

    // Image indicators dot generation
    let dots = '';
    for (let i = 0; i < imageCount; i++) {
      dots += `<span class="indicator ${i === activeImgIdx ? 'active' : ''}" onclick="event.stopPropagation(); setPropertyImageIndex('${item.id}', ${i})"></span>`;
    }

    // Spec indicators
    const specs = [];
    if (item.bedrooms) specs.push(`<span><i class="fas fa-bed"></i> ${item.bedrooms} Bed</span>`);
    if (item.bathrooms) specs.push(`<span><i class="fas fa-bath"></i> ${item.bathrooms} Bath</span>`);
    if (item.area) specs.push(`<span><i class="fas fa-vector-square"></i> ${item.area} m²</span>`);

    return `
      <div class="property-card" onclick="viewProperty('${item.id}')">
        <div class="property-image-container" onclick="event.stopPropagation()">
          <img src="${currentImgUrl}" alt="${item.title}" class="property-image" onerror="this.src='images/villa2.jpg';">
          
          ${imageCount > 1 ? `
            <button class="carousel-nav prev" onclick="event.stopPropagation(); changePropertyImage('${item.id}', -1)">&lt;</button>
            <button class="carousel-nav next" onclick="event.stopPropagation(); changePropertyImage('${item.id}', 1)">&gt;</button>
          ` : ''}
          
          <div class="image-indicators">
            ${dots}
          </div>
          <div class="property-overlay">
            <span class="property-type">${item.type}</span>
            <span class="featured-badge" style="background: ${item.saleStatus === 'for-sale' ? '#2563eb' : '#10b981'}">
              ${item.saleStatus === 'for-sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>
        </div>
        
        <div class="property-content">
          <div class="property-header">
            <h3 class="property-title">${item.title}</h3>
            <p class="property-price">${formatPrice(item.price)} ETB</p>
          </div>
          <p class="property-location"><i class="fas fa-map-marker-alt" style="color: #2563eb;"></i> ${item.locationLabel}</p>
          
          <div class="property-specs">
            ${specs.join('')}
          </div>
          
          <p class="property-description" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 3.2em;">
            ${item.description}
          </p>
          
          <div class="property-footer">
            <div class="broker-info">
              <img src="images/broker-image-removebg-preview.png" alt="${item.brokerName}" class="broker-avatar" style="border: 2px solid #2563eb;">
              <div class="broker-details">
                <h4>${item.brokerName}</h4>
                <div class="broker-rating">
                  <i class="fas fa-star"></i> Verified Broker
                </div>
              </div>
              <span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>
            </div>
            
            <div class="property-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: space-between;">
              <button class="btn-primary" onclick="event.stopPropagation(); viewProperty('${item.id}')" style="font-size: 0.85rem; padding: 0.5rem 1rem;">View Details</button>
              <button class="btn-secondary" onclick="event.stopPropagation(); handleToggleFavorite('${item.id}')" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                <i class="far fa-heart"></i> Favorite
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Change image in listing card carousel
function changePropertyImage(id, direction) {
  const listings = allApprovedListings;
  const item = listings.find(l => l.id === id);
  if (!item || !item.images || item.images.length <= 1) return;

  const count = item.images.length;
  let idx = activePropertyImages[id] || 0;
  idx = (idx + direction + count) % count;
  activePropertyImages[id] = idx;
  renderProperties();
}

// Set image index manually from dot click
function setPropertyImageIndex(id, index) {
  activePropertyImages[id] = index;
  renderProperties();
}

// Open modal for listing details
async function viewProperty(id) {
  const item = await DB_getListingById(id);
  if (!item) return;

  // Increment views
  await DB_incrementViews(id);

  const modal = document.getElementById("propertyModal");
  const container = document.getElementById("modalContent");

  const broker = await DB_getBrokerById(item.brokerId) || { name: item.brokerName, phone: '+251-911-123456', email: 'broker@findbroker.com', bio: 'Professional agent verified on FindBroker.' };

  const firstImg = (item.images && item.images.length > 0) ? item.images[0] : 'images/villa2.jpg';
  
  // Render thumbnails
  let thumbnailsHTML = '';
  if (item.images && item.images.length > 1) {
    thumbnailsHTML = `
      <div class="gallery-thumbnails" style="display: flex; gap: 0.5rem; padding: 1rem; overflow-x: auto; background: #f8fafc;">
        ${item.images.map((img, i) => `
          <img src="${img}" alt="Thumbnail" class="thumbnail ${i === 0 ? 'active' : ''}" onclick="setModalMainImage('${img}', this)" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent;" />
        `).join('')}
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column;">
      <div class="main-image-container" style="position: relative; width: 100%; height: 350px;">
        <img id="modalMainImage" src="${firstImg}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='images/villa2.jpg';">
        <div style="position: absolute; bottom: 1.5rem; left: 1.5rem; background: rgba(0,0,0,0.65); padding: 0.5rem 1rem; border-radius: 12px; color: white;">
          <h2 style="font-size: 1.5rem; margin: 0;">${item.title}</h2>
          <span style="font-size: 0.9rem; opacity: 0.9;"><i class="fas fa-map-marker-alt"></i> ${item.locationLabel}</span>
        </div>
      </div>
      
      ${thumbnailsHTML}
      
      <div style="padding: 2rem; display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
        <div>
          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
            <span style="background: #2563eb; color: white; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem; text-transform: uppercase;">${item.type}</span>
            <span style="background: #10b981; color: white; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem;">${item.saleStatus === 'for-sale' ? 'For Sale' : 'For Rent'}</span>
          </div>

          <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: #1e293b;">Property Description</h3>
          <p style="color: #64748b; line-height: 1.7; margin-bottom: 2rem;">${item.description}</p>
          
          <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: #1e293b;">Property Specs</h3>
          <div class="property-specs-large" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; background: #f8fafc; padding: 1.25rem; border-radius: 12px; margin-bottom: 2rem;">
            <div class="spec" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; color: #475569;">
              <i class="fas fa-bed" style="color: #2563eb; font-size: 1.5rem;"></i>
              <strong style="margin-top: 5px;">${item.bedrooms || '0'}</strong>
              <span style="font-size: 0.8rem; color: #94a3b8;">Bedrooms</span>
            </div>
            <div class="spec" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; color: #475569;">
              <i class="fas fa-bath" style="color: #2563eb; font-size: 1.5rem;"></i>
              <strong style="margin-top: 5px;">${item.bathrooms || '0'}</strong>
              <span style="font-size: 0.8rem; color: #94a3b8;">Bathrooms</span>
            </div>
            <div class="spec" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; color: #475569;">
              <i class="fas fa-vector-square" style="color: #2563eb; font-size: 1.5rem;"></i>
              <strong style="margin-top: 5px;">${item.area || '0'} m²</strong>
              <span style="font-size: 0.8rem; color: #94a3b8;">Area Size</span>
            </div>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; height: fit-content; display: flex; flex-direction: column; align-items: center; text-align: center;">
          <h3 style="font-size: 1.15rem; margin-bottom: 1.25rem; color: #1e293b; font-weight: 700;">Price</h3>
          <div style="font-size: 1.8rem; font-weight: 800; color: #2563eb; margin-bottom: 1.5rem;">${formatPrice(item.price)} <span style="font-size: 1rem; font-weight: 500; color: #64748b;">ETB</span></div>
          
          <div style="border-top: 1px solid #cbd5e1; width: 100%; padding-top: 1.25rem; margin-bottom: 1.5rem; text-align: left;">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: #475569; font-weight: 700;">Contact Broker</h4>
            <div style="font-weight: 600; color: #1e293b; font-size: 1.1rem; margin-bottom: 0.25rem;">${broker.name}</div>
            <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 1rem;">Operating in ${broker.city || 'Ethiopia'}</div>
            
            <a href="tel:${broker.phone}" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #2563eb; font-weight: 600; margin-bottom: 0.5rem;">
              <i class="fas fa-phone"></i> ${broker.phone}
            </a>
            <a href="mailto:${broker.email}" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #2563eb; font-weight: 600;">
              <i class="fas fa-envelope"></i> ${broker.email}
            </a>
          </div>
          
          <button class="btn btn-primary" onclick="showNotification('Inquiry sent successfully! The broker will reach out.', 'success'); closeModal();" style="width: 100%;">Connect Broker</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function setModalMainImage(src, element) {
  document.getElementById("modalMainImage").src = src;
  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach(t => t.classList.remove("active"));
  element.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("propertyModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
  
  // Clean URL parameter
  const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  window.history.pushState({ path: cleanUrl }, '', cleanUrl);
}

async function handleToggleFavorite(listingId) {
  const userSession = DB_getUserSession();
  if (!userSession) {
    showNotification("Please log in to add listings to favorites.", "error");
    showLoginModal();
    return;
  }
  
  const isAdded = await DB_toggleFavorite(userSession.userId, listingId);
  if (isAdded) {
    showNotification("Property added to favorites!", "success");
  } else {
    showNotification("Property removed from favorites.", "info");
  }
}

// Modal Toggle helpers for header buttons
function showLoginModal() {
  document.getElementById("loginModal").classList.add("active");
}

function showRegisterModal() {
  document.getElementById("registerModal").classList.add("active");
}

function switchToLogin() {
  document.getElementById("registerModal").classList.remove("active");
  document.getElementById("loginModal").classList.add("active");
}

function toggleBrokerFields() {
  const userType = document.getElementById("userType").value;
  const brokerFields = document.getElementById("brokerFields");
  if (userType === 'broker') {
    brokerFields.style.display = 'block';
    document.getElementById("brokerLicense").setAttribute("required", "required");
    document.getElementById("brokerCity").setAttribute("required", "required");
  } else {
    brokerFields.style.display = 'none';
    document.getElementById("brokerLicense").removeAttribute("required");
    document.getElementById("brokerCity").removeAttribute("required");
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const userType = document.getElementById("userType").value;

  if (password !== confirmPassword) {
    showNotification("Passwords do not match!", "error");
    return;
  }

  const name = `${firstName} ${lastName}`;

  if (userType === "broker") {
    const licenseNumber = document.getElementById("brokerLicense").value.trim();
    const city = document.getElementById("brokerCity").value.trim();
    const bio = document.getElementById("brokerBio").value.trim();

    const res = await DB_registerBroker({ name, email, phone, password, licenseNumber, city, bio });
    if (res.success) {
      showNotification("Registration submitted! Awaiting admin verification.", "success");
      document.getElementById("registerModal").classList.remove("active");
      event.target.reset();
      document.getElementById("brokerFields").style.display = "none";
    } else {
      showNotification(res.message, "error");
    }
  } else {
    const res = await DB_registerUser({ name, email, phone, password });
    if (res.success) {
      showNotification("Registration successful! You can now log in.", "success");
      switchToLogin();
    } else {
      showNotification(res.message, "error");
    }
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  // 1. Try admin
  if (email.toLowerCase() === "admin@findbroker.com") {
    const isAdmin = await DB_adminLogin(email, password);
    if (isAdmin) {
      showNotification("Welcome Admin! Redirecting...", "success");
      setTimeout(() => { window.location.href = "admin-panel.html"; }, 1000);
      return;
    }
  }

  // 2. Try broker
  const brokerRes = await DB_loginBroker(email, password);
  if (brokerRes.success) {
    showNotification(`Welcome back, Broker ${brokerRes.broker.name}!`, "success");
    setTimeout(() => { window.location.href = "broker-dashboard.html"; }, 1000);
    return;
  } else if (brokerRes.status === "pending" || brokerRes.status === "rejected") {
    showNotification(brokerRes.message, "error");
    return;
  }

  // 3. Try buyer / user
  const userRes = await DB_loginUser(email, password);
  if (userRes.success) {
    showNotification(`Welcome back, ${userRes.user.name}!`, "success");
    document.getElementById("loginModal").classList.remove("active");
    event.target.reset();
    updateAuthUI();
    return;
  }

  showNotification("Invalid email or password.", "error");
}

function updateAuthUI() {
  const navButtons = document.querySelector(".nav-buttons");
  if (!navButtons) return;

  const brokerSession = DB_getBrokerSession();
  const userSession = DB_getUserSession();

  if (brokerSession) {
    navButtons.innerHTML = `
      <span style="margin-right: 15px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 5px;">
        <i class="fas fa-briefcase" style="color: #2563eb;"></i> ${brokerSession.name}
      </span>
      <button class="btn btn-outline" style="padding: 0.5rem 1rem;" onclick="window.location.href='broker-dashboard.html'">Dashboard</button>
      <button class="btn btn-primary" style="padding: 0.5rem 1rem;" onclick="logoutBroker()">Logout</button>
    `;
  } else if (userSession) {
    navButtons.innerHTML = `
      <span style="margin-right: 15px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 5px;">
        <i class="fas fa-user" style="color: #10b981;"></i> ${userSession.name}
      </span>
      <button class="btn btn-primary" style="padding: 0.5rem 1rem;" onclick="logoutUser()">Logout</button>
    `;
  } else {
    navButtons.innerHTML = `
      <button class="btn btn-outline" onclick="showLoginModal()">Login</button>
      <button class="btn btn-primary" onclick="showRegisterModal()">Sign Up</button>
    `;
  }
}

function logoutBroker() {
  DB_clearBrokerSession();
  showNotification("Logged out successfully.", "info");
  updateAuthUI();
  window.location.reload();
}

function logoutUser() {
  DB_clearUserSession();
  showNotification("Logged out successfully.", "info");
  updateAuthUI();
  window.location.reload();
}

// Simple notifications helper
function showNotification(message, type = 'info') {
  const notification = document.createElement("div");
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
    transition: all 0.3s ease;
  `;
  notification.innerText = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Close modals when clicking outside
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});
