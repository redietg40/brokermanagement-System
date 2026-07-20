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
  onListingCategoryChange();
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

// Populate Profile Settings Form with full 9 categories
function populateProfileForm() {
  if (!currentBroker) return;

  // Helper setter
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined && val !== null ? val : "";
  };
  const setArr = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = Array.isArray(val) ? val.join(", ") : (val || "");
  };

  // 1. Basic Info
  setVal("profileName", currentBroker.name);
  setVal("profilePhone", currentBroker.phone);
  setVal("profileCity", currentBroker.city);
  setVal("profileBio", currentBroker.bio);

  // 2. License & Certification
  setVal("profileLicenseNumber", currentBroker.licenseNumber);
  setVal("profileLicenseAuthority", currentBroker.licenseAuthority || "Ministry of Trade & Regional Integration");
  setVal("profileLicenseExpiry", currentBroker.licenseExpiry);
  setVal("profileLicenseStatus", currentBroker.licenseStatus || "Pending");

  // 3. Professional Details & Specializations
  setVal("profileExperience", currentBroker.experience || "0-5");
  setArr("profileSpecializations", currentBroker.specializations);
  setArr("profileLanguages", currentBroker.languages);
  setVal("profileAffiliations", currentBroker.affiliations);

  // 4. Contact & Availability
  setVal("profileSecondaryPhone", currentBroker.secondaryPhone);
  setVal("profileWhatsapp", currentBroker.whatsapp);
  setVal("profileTelegram", currentBroker.telegram);
  setVal("profilePreferredContact", currentBroker.preferredContact || "Phone Call");
  setVal("profileOfficeAddress", currentBroker.officeAddress);
  setVal("profileHoursWeekdays", currentBroker.officeHoursWeekdays || "8:00 AM - 5:00 PM");
  setVal("profileHoursWeekends", currentBroker.officeHoursWeekends || "9:00 AM - 1:00 PM");
  const afterHours = document.getElementById("profileAfterHoursAvailable");
  if (afterHours) afterHours.checked = Boolean(currentBroker.afterHoursAvailable);

  // 5. Service Details
  setArr("profileServiceAreas", currentBroker.serviceAreas);
  setArr("profilePropertyTypes", currentBroker.propertyTypes);
  setArr("profileClientTypes", currentBroker.clientTypes);
  setArr("profileTransactionTypes", currentBroker.transactionTypes);

  // 6. Metrics & Trust
  setVal("profileTotalSales", currentBroker.totalSales || 0);
  setVal("profileTotalClients", currentBroker.totalClients || 0);
  setVal("profilePropertiesSold", currentBroker.propertiesSold || 0);
  setVal("profilePropertiesRented", currentBroker.propertiesRented || 0);
  setVal("profileSuccessRate", currentBroker.successRate || 95.0);
  setVal("profileResponseTime", currentBroker.responseTime || "< 1 Hour");
  setVal("profileEducationLevel", currentBroker.educationLevel || "Bachelor's Degree");

  // 7. Social & Web
  setVal("profileLinkedin", currentBroker.linkedin);
  setVal("profileFacebook", currentBroker.facebook);
  setVal("profileInstagram", currentBroker.instagram);
  setVal("profileWebsite", currentBroker.website);

  // 8. Banking & Payment
  setVal("profileBankName", currentBroker.bankName);
  setVal("profileAccountNumber", currentBroker.accountNumber);
  setVal("profileAccountHolder", currentBroker.accountHolder);
  setVal("profileCommissionRate", currentBroker.commissionRate || 2.0);

  // 9. Additional Info
  setVal("profileEmergencyContact", currentBroker.emergencyContact);
  setVal("profilePreferredLanguage", currentBroker.preferredLanguage || "Amharic");
  setVal("profileTimeZone", currentBroker.timeZone || "EAT (UTC+3)");
}

// Profile Subtab Navigation
function switchProfileSubtab(panelId, btnEl) {
  document.querySelectorAll(".p-panel").forEach(p => p.style.display = "none");
  document.querySelectorAll(".p-subtab").forEach(b => b.classList.remove("active"));
  
  const panel = document.getElementById(panelId);
  if (panel) panel.style.display = "block";
  if (btnEl) btnEl.classList.add("active");
}

// Save Full Profile changes
async function saveFullProfile(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (!currentBroker) return;

  const parseArr = (id) => {
    const val = document.getElementById(id) ? document.getElementById(id).value.trim() : "";
    return val ? val.split(",").map(s => s.trim()).filter(Boolean) : [];
  };
  const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : "";

  const payload = {
    name: getVal("profileName"),
    phone: getVal("profilePhone"),
    city: getVal("profileCity"),
    bio: getVal("profileBio"),

    // 1. License
    licenseNumber: getVal("profileLicenseNumber"),
    licenseAuthority: getVal("profileLicenseAuthority"),
    licenseExpiry: getVal("profileLicenseExpiry"),
    licenseStatus: getVal("profileLicenseStatus"),

    // 2. Professional
    experience: getVal("profileExperience"),
    specializations: parseArr("profileSpecializations"),
    languages: parseArr("profileLanguages"),
    affiliations: getVal("profileAffiliations"),

    // 3. Contact & Availability
    secondaryPhone: getVal("profileSecondaryPhone"),
    whatsapp: getVal("profileSecondaryPhone"), 
    telegram: getVal("profileTelegram"),
    preferredContact: getVal("profilePreferredContact"),
    officeAddress: getVal("profileOfficeAddress"),
    officeHoursWeekdays: getVal("profileHoursWeekdays"),
    officeHoursWeekends: getVal("profileHoursWeekends"),
    afterHoursAvailable: document.getElementById("profileAfterHoursAvailable") ? document.getElementById("profileAfterHoursAvailable").checked : false,

    // 4. Services
    serviceAreas: parseArr("profileServiceAreas"),
    propertyTypes: parseArr("profilePropertyTypes"),
    clientTypes: parseArr("profileClientTypes"),
    transactionTypes: parseArr("profileTransactionTypes"),

    // 5. Metrics
    totalSales: parseInt(getVal("profileTotalSales")) || 0,
    totalClients: parseInt(getVal("profileTotalClients")) || 0,
    propertiesSold: parseInt(getVal("profilePropertiesSold")) || 0,
    propertiesRented: parseInt(getVal("profilePropertiesRented")) || 0,
    successRate: parseFloat(getVal("profileSuccessRate")) || 95.0,
    responseTime: getVal("profileResponseTime"),
    educationLevel: getVal("profileEducationLevel"),

    // 6. Social
    linkedin: getVal("profileLinkedin"),
    facebook: getVal("profileFacebook"),
    instagram: getVal("profileInstagram"),
    website: getVal("profileWebsite"),

    // 7. Banking
    bankName: getVal("profileBankName"),
    accountNumber: getVal("profileAccountNumber"),
    accountHolder: getVal("profileAccountHolder"),
    commissionRate: parseFloat(getVal("profileCommissionRate")) || 2.0,

    // 8. Additional
    emergencyContact: getVal("profileEmergencyContact"),
    preferredLanguage: getVal("profilePreferredLanguage"),
    timeZone: getVal("profileTimeZone")
  };

  const success = await DB_updateBroker(currentBroker.id, payload);
  if (success) {
    showNotification("✅ Full broker profile updated successfully!", "success");
    currentBroker = { ...currentBroker, ...payload };
    // update session name if changed
    const nameEl = document.getElementById("brokerSessionName");
    if (nameEl) nameEl.innerText = payload.name;
  } else {
    showNotification("Error saving profile. Please check backend connections.", "error");
  }
}

// Dynamic category change event handler
function onListingCategoryChange() {
  const category = document.getElementById('listingCategory').value;
  updateSubcategoryAndStatusOptions(category);
  renderCategorySpecificFields(category);
}

function updateSubcategoryAndStatusOptions(category, selectedType = '', selectedSaleStatus = '') {
  const typeSelect = document.getElementById('listingType');
  const statusSelect = document.getElementById('listingSaleStatus');

  const subCategories = {
    'real-estate': [
      { val: 'villa', label: 'Villa' },
      { val: 'apartment', label: 'Apartment' },
      { val: 'house', label: 'House' },
      { val: 'commercial', label: 'Commercial Building' },
      { val: 'land', label: 'Land / Plot' },
      { val: 'office', label: 'Office Space' }
    ],
    'automotive': [
      { val: 'car', label: 'Car' },
      { val: 'suv', label: 'SUV' },
      { val: 'truck', label: 'Truck' },
      { val: 'motorbike', label: 'Motorbike' },
      { val: 'bus', label: 'Bus' },
      { val: 'heavy-equipment', label: 'Heavy Equipment' }
    ],
    'electronics': [
      { val: 'laptop', label: 'Laptop' },
      { val: 'desktop', label: 'Desktop' },
      { val: 'phone', label: 'Phone / Smartphone' },
      { val: 'tablet', label: 'Tablet' },
      { val: 'tv', label: 'TV / Display' },
      { val: 'audio', label: 'Audio & Speakers' },
      { val: 'camera', label: 'Camera & Video' },
      { val: 'accessories', label: 'Accessories' }
    ],
    'fashion': [
      { val: 'clothing', label: 'Clothing' },
      { val: 'shoes', label: 'Shoes / Footwear' },
      { val: 'bags', label: 'Bags & Handbags' },
      { val: 'watches', label: 'Watches' },
      { val: 'jewelry', label: 'Jewelry' },
      { val: 'accessories', label: 'Fashion Accessories' }
    ],
    'food': [
      { val: 'restaurant', label: 'Restaurant Item' },
      { val: 'cafe', label: 'Cafe & Coffee' },
      { val: 'bakery', label: 'Bakery & Pastry' },
      { val: 'grocery', label: 'Grocery' },
      { val: 'beverage', label: 'Beverage' },
      { val: 'catering', label: 'Catering Service' }
    ],
    'health': [
      { val: 'clinic', label: 'Clinic Service' },
      { val: 'pharmacy', label: 'Pharmacy Product' },
      { val: 'spa', label: 'Spa & Wellness' },
      { val: 'gym', label: 'Gym & Fitness Membership' },
      { val: 'salon', label: 'Salon & Hair' },
      { val: 'cosmetics', label: 'Cosmetics & Skincare' }
    ]
  };

  const statusOptions = {
    'food': [
      { val: 'for-sale', label: 'For Sale' },
      { val: 'for-delivery', label: 'For Delivery' }
    ],
    'health': [
      { val: 'for-service', label: 'For Service' },
      { val: 'for-sale', label: 'For Sale' }
    ]
  };

  const types = subCategories[category] || [{ val: 'general', label: 'General' }];
  typeSelect.innerHTML = types.map(t => `<option value="${t.val}" ${t.val === selectedType ? 'selected' : ''}>${t.label}</option>`).join('');

  const statuses = statusOptions[category] || [
    { val: 'for-sale', label: 'For Sale' },
    { val: 'for-rent', label: 'For Rent' }
  ];
  statusSelect.innerHTML = statuses.map(s => `<option value="${s.val}" ${s.val === selectedSaleStatus ? 'selected' : ''}>${s.label}</option>`).join('');
}

// Render dynamic fields based on selected category (matches requested specifications exactly)
function renderCategorySpecificFields(category, specs = {}) {
  const container = document.getElementById('categorySpecificFields');
  if (!container) return;

  let html = '';

  if (category === 'real-estate') {
    html = `
      <h4 style="margin:0 0 1rem 0; color:#1e293b;"><i class="fas fa-home" style="color:#2563eb;"></i> Real Estate Specifications</h4>
      <div class="form-row">
        <div class="form-group">
          <label for="listingArea">Size / Area (m²) *</label>
          <input type="number" id="listingArea" required value="${specs.area || ''}" placeholder="e.g. 250" />
        </div>
        <div class="form-group">
          <label for="listingBedrooms">Bedrooms</label>
          <input type="number" id="listingBedrooms" value="${specs.bedrooms || 0}" placeholder="0" />
        </div>
        <div class="form-group">
          <label for="listingBathrooms">Bathrooms</label>
          <input type="number" id="listingBathrooms" value="${specs.bathrooms || 0}" placeholder="0" />
        </div>
      </div>
    `;
  } else if (category === 'automotive') {
    html = `
      <h4 style="margin:0 0 1rem 0; color:#1e293b;"><i class="fas fa-car" style="color:#ef4444;"></i> Vehicle Details</h4>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_year">Year *</label>
          <input type="number" id="spec_year" required value="${specs.year || ''}" placeholder="e.g. 2022" />
        </div>
        <div class="form-group">
          <label for="spec_mileage">Mileage (km) *</label>
          <input type="number" id="spec_mileage" required value="${specs.mileage || ''}" placeholder="e.g. 45000" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_fuelType">Fuel Type *</label>
          <select id="spec_fuelType" required>
            <option value="Petrol" ${specs.fuelType === 'Petrol' ? 'selected' : ''}>Petrol</option>
            <option value="Diesel" ${specs.fuelType === 'Diesel' ? 'selected' : ''}>Diesel</option>
            <option value="Electric" ${specs.fuelType === 'Electric' ? 'selected' : ''}>Electric</option>
            <option value="Hybrid" ${specs.fuelType === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
          </select>
        </div>
        <div class="form-group">
          <label for="spec_transmission">Transmission *</label>
          <select id="spec_transmission" required>
            <option value="Automatic" ${specs.transmission === 'Automatic' ? 'selected' : ''}>Automatic</option>
            <option value="Manual" ${specs.transmission === 'Manual' ? 'selected' : ''}>Manual</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_engineSize">Engine Size (CC)</label>
          <input type="text" id="spec_engineSize" value="${specs.engineSize || ''}" placeholder="e.g. 2000 cc" />
        </div>
        <div class="form-group">
          <label for="spec_color">Color</label>
          <input type="text" id="spec_color" value="${specs.color || ''}" placeholder="e.g. Black" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_doors">Number of Doors</label>
          <input type="number" id="spec_doors" value="${specs.doors || 4}" />
        </div>
        <div class="form-group">
          <label for="spec_seating">Seating Capacity</label>
          <input type="number" id="spec_seating" value="${specs.seating || 5}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_condition">Condition *</label>
          <select id="spec_condition" required>
            <option value="New" ${specs.condition === 'New' ? 'selected' : ''}>New</option>
            <option value="Used" ${specs.condition === 'Used' ? 'selected' : ''}>Used</option>
            <option value="Rebuilt" ${specs.condition === 'Rebuilt' ? 'selected' : ''}>Rebuilt</option>
          </select>
        </div>
        <div class="form-group">
          <label for="spec_licensePlate">License Plate (Optional)</label>
          <input type="text" id="spec_licensePlate" value="${specs.licensePlate || ''}" placeholder="e.g. Code 3" />
        </div>
      </div>
    `;
  } else if (category === 'electronics') {
    html = `
      <h4 style="margin:0 0 1rem 0; color:#1e293b;"><i class="fas fa-laptop" style="color:#8b5cf6;"></i> Device Details</h4>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_brand">Brand *</label>
          <input type="text" id="spec_brand" required value="${specs.brand || ''}" placeholder="e.g. Apple" />
        </div>
        <div class="form-group">
          <label for="spec_model">Model *</label>
          <input type="text" id="spec_model" required value="${specs.model || ''}" placeholder="e.g. iPhone 15 Pro" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_condition">Condition *</label>
          <select id="spec_condition" required>
            <option value="New" ${specs.condition === 'New' ? 'selected' : ''}>New</option>
            <option value="Used" ${specs.condition === 'Used' ? 'selected' : ''}>Used</option>
            <option value="Refurbished" ${specs.condition === 'Refurbished' ? 'selected' : ''}>Refurbished</option>
          </select>
        </div>
        <div class="form-group">
          <label for="spec_storage">Storage Capacity</label>
          <input type="text" id="spec_storage" value="${specs.storage || ''}" placeholder="e.g. 512GB" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_ram">RAM</label>
          <input type="text" id="spec_ram" value="${specs.ram || ''}" placeholder="e.g. 16GB" />
        </div>
        <div class="form-group">
          <label for="spec_processor">Processor</label>
          <input type="text" id="spec_processor" value="${specs.processor || ''}" placeholder="e.g. Apple M2" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_screenSize">Screen Size (inches)</label>
          <input type="text" id="spec_screenSize" value="${specs.screenSize || ''}" placeholder="e.g. 14" />
        </div>
        <div class="form-group">
          <label for="spec_os">Operating System</label>
          <input type="text" id="spec_os" value="${specs.os || ''}" placeholder="e.g. MacOS" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_batteryLife">Battery Life (hours)</label>
          <input type="text" id="spec_batteryLife" value="${specs.batteryLife || ''}" placeholder="e.g. 15 hours" />
        </div>
        <div class="form-group">
          <label for="spec_warranty">Warranty Available</label>
          <select id="spec_warranty">
            <option value="Yes" ${specs.warranty === 'Yes' ? 'selected' : ''}>Yes</option>
            <option value="No" ${specs.warranty === 'No' ? 'selected' : ''}>No</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="spec_accessories">Accessories Included</label>
        <input type="text" id="spec_accessories" value="${specs.accessories || ''}" placeholder="Charger, Case, etc." />
      </div>
    `;
  } else if (category === 'fashion') {
    html = `
      <h4 style="margin:0 0 1rem 0; color:#1e293b;"><i class="fas fa-tshirt" style="color:#ec4899;"></i> Fashion Details</h4>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_brand">Brand *</label>
          <input type="text" id="spec_brand" required value="${specs.brand || ''}" placeholder="e.g. Nike" />
        </div>
        <div class="form-group">
          <label for="spec_size">Size *</label>
          <input type="text" id="spec_size" required value="${specs.size || ''}" placeholder="e.g. XL" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_color">Color</label>
          <input type="text" id="spec_color" value="${specs.color || ''}" placeholder="e.g. Black" />
        </div>
        <div class="form-group">
          <label for="spec_material">Material</label>
          <input type="text" id="spec_material" value="${specs.material || ''}" placeholder="e.g. Cotton" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_gender">Gender</label>
          <select id="spec_gender">
            <option value="Unisex" ${specs.gender === 'Unisex' ? 'selected' : ''}>Unisex</option>
            <option value="Men" ${specs.gender === 'Men' ? 'selected' : ''}>Men</option>
            <option value="Women" ${specs.gender === 'Women' ? 'selected' : ''}>Women</option>
            <option value="Kids" ${specs.gender === 'Kids' ? 'selected' : ''}>Kids</option>
          </select>
        </div>
        <div class="form-group">
          <label for="spec_condition">Condition *</label>
          <select id="spec_condition" required>
            <option value="New" ${specs.condition === 'New' ? 'selected' : ''}>New</option>
            <option value="Used" ${specs.condition === 'Used' ? 'selected' : ''}>Used</option>
            <option value="Vintage" ${specs.condition === 'Vintage' ? 'selected' : ''}>Vintage</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_season">Season</label>
          <input type="text" id="spec_season" value="${specs.season || ''}" placeholder="e.g. Summer" />
        </div>
        <div class="form-group">
          <label for="spec_authenticity">Original/Replica</label>
          <select id="spec_authenticity">
            <option value="Original" ${specs.authenticity === 'Original' ? 'selected' : ''}>Original</option>
            <option value="Replica" ${specs.authenticity === 'Replica' ? 'selected' : ''}>Replica</option>
          </select>
        </div>
      </div>
    `;
  } else if (category === 'food') {
    html = `
      <h4 style="margin:0 0 1rem 0; color:#1e293b;"><i class="fas fa-utensils" style="color:#f59e0b;"></i> Food &amp; Beverage Details</h4>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_priceUnit">Pricing Unit (e.g. Per item / Per kg) *</label>
          <input type="text" id="spec_priceUnit" required value="${specs.priceUnit || 'Per Item'}" />
        </div>
        <div class="form-group">
          <label for="spec_foodType">Food Type *</label>
          <select id="spec_foodType" required>
            <option value="Local" ${specs.foodType === 'Local' ? 'selected' : ''}>Local</option>
            <option value="International" ${specs.foodType === 'International' ? 'selected' : ''}>International</option>
            <option value="Vegan" ${specs.foodType === 'Vegan' ? 'selected' : ''}>Vegan</option>
            <option value="Halal" ${specs.foodType === 'Halal' ? 'selected' : ''}>Halal</option>
            <option value="Organic" ${specs.foodType === 'Organic' ? 'selected' : ''}>Organic</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_prepTime">Preparation Time (minutes)</label>
          <input type="number" id="spec_prepTime" value="${specs.prepTime || 15}" />
        </div>
        <div class="form-group">
          <label for="spec_delivery">Delivery Available</label>
          <select id="spec_delivery">
            <option value="Yes" ${specs.delivery === 'Yes' ? 'selected' : ''}>Yes</option>
            <option value="No" ${specs.delivery === 'No' ? 'selected' : ''}>No</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_packaging">Packaging Included</label>
          <select id="spec_packaging">
            <option value="Yes" ${specs.packaging === 'Yes' ? 'selected' : ''}>Yes</option>
            <option value="No" ${specs.packaging === 'No' ? 'selected' : ''}>No</option>
          </select>
        </div>
        <div class="form-group">
          <label for="spec_expiryDate">Expiry Date</label>
          <input type="date" id="spec_expiryDate" value="${specs.expiryDate || ''}" />
        </div>
      </div>
      <div class="form-group">
        <label for="spec_ingredients">Ingredients (comma-separated)</label>
        <input type="text" id="spec_ingredients" value="${specs.ingredients || ''}" placeholder="Main ingredients" />
      </div>
      <div class="form-group">
        <label for="spec_nutrition">Nutritional Information (Calories, etc.)</label>
        <input type="text" id="spec_nutrition" value="${specs.nutrition || ''}" />
      </div>
    `;
  } else if (category === 'health') {
    html = `
      <h4 style="margin:0 0 1rem 0; color:#1e293b;"><i class="fas fa-heart" style="color:#06b6d4;"></i> Health &amp; Beauty Service Details</h4>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_serviceType">Service Type *</label>
          <select id="spec_serviceType" required>
            <option value="Consultation" ${specs.serviceType === 'Consultation' ? 'selected' : ''}>Consultation</option>
            <option value="Treatment" ${specs.serviceType === 'Treatment' ? 'selected' : ''}>Treatment</option>
            <option value="Product" ${specs.serviceType === 'Product' ? 'selected' : ''}>Product</option>
            <option value="Membership" ${specs.serviceType === 'Membership' ? 'selected' : ''}>Membership</option>
          </select>
        </div>
        <div class="form-group">
          <label for="spec_duration">Duration (minutes/hours)</label>
          <input type="text" id="spec_duration" value="${specs.duration || ''}" placeholder="e.g. 1 hour" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spec_specialization">Specialization</label>
          <input type="text" id="spec_specialization" value="${specs.specialization || ''}" placeholder="e.g. Fitness" />
        </div>
        <div class="form-group">
          <label for="spec_certified">Certified</label>
          <select id="spec_certified">
            <option value="Yes" ${specs.certified === 'Yes' ? 'selected' : ''}>Yes</option>
            <option value="No" ${specs.certified === 'No' ? 'selected' : ''}>No</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="spec_equipment">Equipment Used</label>
        <input type="text" id="spec_equipment" value="${specs.equipment || ''}" />
      </div>
      <div class="form-group">
        <label for="spec_products">Products Available</label>
        <input type="text" id="spec_products" value="${specs.products || ''}" />
      </div>
    `;
  } else {
    html = `
      <div class="form-row">
        <div class="form-group">
          <label for="spec_brand">Brand / Provider Name</label>
          <input type="text" id="spec_brand" value="${specs.brand || ''}" />
        </div>
        <div class="form-group">
          <label for="spec_condition">Condition / Quality</label>
          <input type="text" id="spec_condition" value="${specs.condition || 'Good'}" />
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// Edit Listing Mode with Category Specs restoration
async function editListing(id) {
  const item = await DB_getListingById(id);
  if (!item) return;
  
  // Set form fields
  document.getElementById("editListingId").value = item.id;
  document.getElementById("listingTitle").value = item.title;
  
  const cat = item.category || 'real-estate';
  document.getElementById("listingCategory").value = cat;
  
  updateSubcategoryAndStatusOptions(cat, item.type, item.saleStatus);
  
  document.getElementById("listingLocation").value = item.location || 'addis-ababa';
  document.getElementById("listingLocationLabel").value = item.locationLabel || '';
  document.getElementById("listingPrice").value = item.price || 0;
  document.getElementById("listingDescription").value = item.description || '';
  
  // Render specs inputs and populate values
  const specs = item.specs || {
    area: item.area,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms
  };
  renderCategorySpecificFields(cat, specs);

  // Set images for edit reference
  uploadedImagesBase64 = item.images || [];
  renderImagePreviews();
  
  document.getElementById("listingFormTitle").innerText = "Edit Listing Details";
  document.getElementById("submitBtn").innerText = "Update Listing";
  
  switchTab('add-listing');
}

function cancelListingEdit() {
  document.getElementById("listingForm").reset();
  document.getElementById("editListingId").value = "";
  uploadedImagesBase64 = [];
  document.getElementById("imagePreviewContainer").innerHTML = '<span class="placeholder-text">No images selected yet.</span>';
  
  document.getElementById("listingFormTitle").innerText = "Post a New Listing";
  document.getElementById("submitBtn").innerText = "Post Listing";

  onListingCategoryChange();
  switchTab('listings');
}

// Convert uploaded images to Base64 data URLs (Up to 5 images)
function previewImages() {
  const fileInput = document.getElementById("listingImages");
  const files = fileInput.files;
  
  if (!files || files.length === 0) return;
  
  // Convert up to 5 files
  const itemsToProcess = Math.min(files.length, 5 - uploadedImagesBase64.length);
  
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

// Collect Specs from category dynamic fields
function collectCategorySpecs(category) {
  const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : '';

  if (category === 'real-estate') {
    return {
      area: parseFloat(getVal('listingArea')) || 0,
      bedrooms: parseInt(getVal('listingBedrooms')) || 0,
      bathrooms: parseInt(getVal('listingBathrooms')) || 0
    };
  } else if (category === 'automotive') {
    return {
      year: parseInt(getVal('spec_year')) || 0,
      mileage: parseInt(getVal('spec_mileage')) || 0,
      fuelType: getVal('spec_fuelType'),
      transmission: getVal('spec_transmission'),
      engineSize: getVal('spec_engineSize'),
      color: getVal('spec_color'),
      doors: parseInt(getVal('spec_doors')) || 4,
      seating: parseInt(getVal('spec_seating')) || 5,
      condition: getVal('spec_condition'),
      licensePlate: getVal('spec_licensePlate')
    };
  } else if (category === 'electronics') {
    return {
      brand: getVal('spec_brand'),
      model: getVal('spec_model'),
      condition: getVal('spec_condition'),
      storage: getVal('spec_storage'),
      ram: getVal('spec_ram'),
      processor: getVal('spec_processor'),
      screenSize: getVal('spec_screenSize'),
      os: getVal('spec_os'),
      batteryLife: getVal('spec_batteryLife'),
      warranty: getVal('spec_warranty'),
      accessories: getVal('spec_accessories')
    };
  } else if (category === 'fashion') {
    return {
      brand: getVal('spec_brand'),
      size: getVal('spec_size'),
      color: getVal('spec_color'),
      material: getVal('spec_material'),
      gender: getVal('spec_gender'),
      condition: getVal('spec_condition'),
      season: getVal('spec_season'),
      authenticity: getVal('spec_authenticity')
    };
  } else if (category === 'food') {
    return {
      priceUnit: getVal('spec_priceUnit'),
      foodType: getVal('spec_foodType'),
      prepTime: parseInt(getVal('spec_prepTime')) || 0,
      delivery: getVal('spec_delivery'),
      packaging: getVal('spec_packaging'),
      ingredients: getVal('spec_ingredients'),
      nutrition: getVal('spec_nutrition'),
      expiryDate: getVal('spec_expiryDate')
    };
  } else if (category === 'health') {
    return {
      serviceType: getVal('spec_serviceType'),
      duration: getVal('spec_duration'),
      specialization: getVal('spec_specialization'),
      certified: getVal('spec_certified'),
      equipment: getVal('spec_equipment'),
      products: getVal('spec_products')
    };
  } else {
    return {
      brand: getVal('spec_brand'),
      condition: getVal('spec_condition')
    };
  }
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
  const description = document.getElementById("listingDescription").value.trim();
  
  const specs = collectCategorySpecs(category);

  // Extract base fields for real estate fallback compatibility
  const area = specs.area || 0;
  const bedrooms = specs.bedrooms || 0;
  const bathrooms = specs.bathrooms || 0;

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
    specs,
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

// Render Listings Table on Overview
async function renderRecentListings() {
  const tbody = document.querySelector("#recentListingsTable tbody");
  if (!tbody) return;
  const listings = await DB_getListingsByBroker(currentBroker.id);
  const recent = listings.slice(-5).reverse(); // Get latest 5
  
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No properties listed yet.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = recent.map(item => {
    let statusText = `<span style="padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:600; background:#fef3c7; color:#b45309;"><i class="fas fa-clock"></i> Pending</span>`;
    if (item.listingStatus === 'approved') {
      statusText = `<span style="padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:600; background:#dcfce7; color:#15803d;"><i class="fas fa-check-circle"></i> Approved</span>`;
    } else if (item.listingStatus === 'rejected') {
      statusText = `<span style="padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:600; background:#fee2e2; color:#b91c1c;"><i class="fas fa-times-circle"></i> Rejected</span>`;
    }
    return `
      <tr>
        <td style="font-weight:600; color:#1e293b;">${item.title}</td>
        <td style="text-transform:capitalize;">${item.type}</td>
        <td>${item.locationLabel}</td>
        <td style="font-weight:700; color:#2563eb;">${formatPrice(item.price)} ETB</td>
        <td>${statusText}</td>
        <td><i class="fas fa-eye"></i> ${item.views || 0}</td>
      </tr>
    `;
  }).join("");
}

// Render Full Listings Table
async function renderAllListings() {
  const tbody = document.querySelector("#allListingsTable tbody");
  if (!tbody) return;
  const listings = await DB_getListingsByBroker(currentBroker.id);
  const reversed = [...listings].reverse();
  
  // Show banner alert for rejected listings on overview
  const rejectedListings = listings.filter(l => l.listingStatus === 'rejected');
  const alertContainer = document.getElementById("rejectionAlertBanner");
  if (alertContainer) {
    if (rejectedListings.length > 0) {
      alertContainer.style.display = "block";
      alertContainer.innerHTML = `
        <div style="background:#fee2e2; border:1px solid #fca5a5; padding:1rem; border-radius:8px; color:#b91c1c; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
          <i class="fas fa-exclamation-triangle"></i>
          <span><strong>Notice:</strong> You have ${rejectedListings.length} listing(s) that were <strong>REJECTED</strong> by the admin. Please edit them to correct any issues.</span>
        </div>
      `;
    } else {
      alertContainer.style.display = "none";
    }
  }

  if (reversed.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No properties listed. Click 'Add Property' to start.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = reversed.map(item => {
    let statusText = `<span style="padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:600; background:#fef3c7; color:#b45309;"><i class="fas fa-clock"></i> Pending</span>`;
    if (item.listingStatus === 'approved') {
      statusText = `<span style="padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:600; background:#dcfce7; color:#15803d;"><i class="fas fa-check-circle"></i> Approved</span>`;
    } else if (item.listingStatus === 'rejected') {
      statusText = `<span style="padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:600; background:#fee2e2; color:#b91c1c;" title="Rejected by Admin"><i class="fas fa-times-circle"></i> Rejected</span>`;
    }
    return `
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
        <td>${statusText}</td>
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
    `;
  }).join("");
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
