// ============================================================
// FindBroker - Backend-connected Database Access Layer (db.js)
// ============================================================

const API_URL = "http://localhost:5000/api";

const DB = {
  KEYS: {
    BROKERS: 'fb_brokers',
    USERS: 'fb_users',
    LISTINGS: 'fb_listings',
    BROKER_SESSION: 'fb_broker_session',
    USER_SESSION: 'fb_user_session',
    ADMIN_SESSION: 'fb_admin_session',
    INIT_VER: 'fb_init_v4'
  }
};

// Helper for making API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return await response.json();
  } catch (error) {
    console.error(`API Call failed for ${endpoint}:`, error);
    return { success: false, message: "Network connection error to backend." };
  }
}

// ============ BROKER FUNCTIONS ============
async function DB_registerBroker(data) {
  return await apiCall('/auth/register-broker', 'POST', data);
}

async function DB_loginBroker(email, password) {
  const res = await apiCall('/auth/login-broker', 'POST', { email, password });
  if (res.success) {
    localStorage.setItem(DB.KEYS.BROKER_SESSION, JSON.stringify({
      brokerId: res.broker.id,
      name: res.broker.name,
      email: res.broker.email,
      status: res.broker.status   // ← store status so dashboard auth is instant
    }));
  }
  return res;
}

async function DB_getBrokers() {
  const res = await apiCall('/admin/brokers', 'GET');
  return res.brokers || [];
}

async function DB_getBrokerById(id) {
  const res = await apiCall(`/auth/broker/${id}`, 'GET');
  return res.broker || null;
}

async function DB_approveBroker(id) {
  const res = await apiCall(`/admin/approve-broker/${id}`, 'POST');
  return res.success;
}

async function DB_rejectBroker(id, reason = '') {
  const res = await apiCall(`/admin/reject-broker/${id}`, 'POST', { reason });
  return res.success;
}

async function DB_updateBroker(id, data) {
  const res = await apiCall(`/auth/update-broker/${id}`, 'PUT', data);
  return res.success;
}

async function DB_deleteBroker(id) {
  const res = await apiCall(`/admin/delete-broker/${id}`, 'DELETE');
  return res.success;
}

// ============ USER FUNCTIONS ============
async function DB_registerUser(data) {
  return await apiCall('/auth/register-user', 'POST', data);
}

async function DB_loginUser(email, password) {
  const res = await apiCall('/auth/login-user', 'POST', { email, password });
  if (res.success) {
    localStorage.setItem(DB.KEYS.USER_SESSION, JSON.stringify({ userId: res.user.id, name: res.user.name, email: res.user.email }));
  }
  return res;
}

async function DB_getUsers() {
  const res = await apiCall('/admin/brokers', 'GET'); // falls back to list brokers or placeholder
  return res.users || [];
}

async function DB_getUserById(id) {
  const res = await apiCall(`/auth/user/${id}`, 'GET');
  return res.user || null;
}

async function DB_toggleFavorite(userId, listingId) {
  const res = await apiCall('/auth/user/favorite', 'POST', { userId, listingId });
  return res.isFavorite;
}

// ============ LISTING FUNCTIONS ============
async function DB_addListing(data) {
  return await apiCall('/listings/add', 'POST', data);
}

async function DB_getListings() {
  const res = await apiCall('/admin/listings', 'GET');
  return res.listings || [];
}

async function DB_getApprovedListings() {
  const res = await apiCall('/listings', 'GET');
  return res.listings || [];
}

async function DB_getListingsByBroker(brokerId) {
  const res = await apiCall(`/listings/broker/${brokerId}`, 'GET');
  return res.listings || [];
}

async function DB_getListingById(id) {
  const res = await apiCall(`/listings/${id}`, 'GET');
  return res.listing || null;
}

async function DB_updateListing(id, data) {
  const res = await apiCall(`/listings/update/${id}`, 'PUT', data);
  return res.success;
}

async function DB_deleteListing(id) {
  const res = await apiCall(`/listings/delete/${id}`, 'DELETE');
  return res.success;
}

async function DB_approveListingAdmin(id) {
  const res = await apiCall(`/admin/approve-listing/${id}`, 'POST');
  return res.success;
}

async function DB_rejectListingAdmin(id) {
  const res = await apiCall(`/admin/reject-listing/${id}`, 'POST');
  return res.success;
}

async function DB_getListingsFiltered(category = '', status = '') {
  let query = '/admin/listings';
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (status) params.append('status', status);
  if (params.toString()) query += '?' + params.toString();
  const res = await apiCall(query, 'GET');
  return res.listings || [];
}

async function DB_incrementViews(id) {
  await apiCall(`/listings/view/${id}`, 'POST');
}

// ============ SESSION FUNCTIONS ============
function DB_getBrokerSession() {
  const s = localStorage.getItem(DB.KEYS.BROKER_SESSION);
  return s ? JSON.parse(s) : null;
}

function DB_clearBrokerSession() {
  localStorage.removeItem(DB.KEYS.BROKER_SESSION);
}

function DB_getUserSession() {
  const s = localStorage.getItem(DB.KEYS.USER_SESSION);
  return s ? JSON.parse(s) : null;
}

function DB_clearUserSession() {
  localStorage.removeItem(DB.KEYS.USER_SESSION);
}

async function DB_adminLogin(email, password) {
  const res = await apiCall('/auth/login-admin', 'POST', { email, password });
  if (res.success) {
    localStorage.setItem(DB.KEYS.ADMIN_SESSION, JSON.stringify({ isAdmin: true, name: res.admin.name }));
    return true;
  }
  return false;
}

function DB_isAdminLoggedIn() {
  const s = localStorage.getItem(DB.KEYS.ADMIN_SESSION);
  return !!(s && JSON.parse(s).isAdmin);
}

function DB_clearAdminSession() {
  localStorage.removeItem(DB.KEYS.ADMIN_SESSION);
}
