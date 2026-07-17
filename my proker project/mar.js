// Sample broker data
const brokersData = [
    {
        id: 1,
        name: "Sarah Johnson",
        category: "real-estate",
        location: "addis-ababa",
        description: "Experienced real estate broker specializing in residential and commercial properties in Addis Ababa.",
        rating: 4.8,
        reviews: 127,
        phone: "+251-911-123456",
        email: "sarah@realestate.com",
        verified: true,
        experience: "8 years",
        specialties: ["Residential", "Commercial", "Investment Properties"]
    },
    {
        id: 2,
        name: "Michael Chen",
        category: "insurance",
        location: "dire-dawa",
        description: "Licensed insurance broker offering comprehensive coverage solutions for individuals and businesses.",
        rating: 4.9,
        reviews: 89,
        phone: "+251-911-234567",
        email: "michael@insurance.com",
        verified: true,
        experience: "12 years",
        specialties: ["Life Insurance", "Health Insurance", "Business Insurance"]
    },
    {
        id: 3,
        name: "Almaz Tadesse",
        category: "finance",
        location: "addis-ababa",
        description: "Financial advisor and broker helping clients with investment planning and wealth management.",
        rating: 4.7,
        reviews: 156,
        phone: "+251-911-345678",
        email: "almaz@finance.com",
        verified: true,
        experience: "10 years",
        specialties: ["Investment Planning", "Retirement Planning", "Tax Advisory"]
    },
    {
        id: 4,
        name: "David Wilson",
        category: "automotive",
        location: "bahir-dar",
        description: "Automotive broker specializing in vehicle sales, leasing, and financing solutions.",
        rating: 4.6,
        reviews: 73,
        phone: "+251-911-456789",
        email: "david@automotive.com",
        verified: true,
        experience: "6 years",
        specialties: ["Car Sales", "Vehicle Leasing", "Auto Financing"]
    },
    {
        id: 5,
        name: "Hanan Ahmed",
        category: "technology",
        location: "hawassa",
        description: "Technology solutions broker connecting businesses with the right software and hardware solutions.",
        rating: 4.9,
        reviews: 94,
        phone: "+251-911-567890",
        email: "hanan@tech.com",
        verified: true,
        experience: "7 years",
        specialties: ["Software Solutions", "Hardware Procurement", "IT Consulting"]
    },
    {
        id: 6,
        name: "Robert Martinez",
        category: "real-estate",
        location: "mekelle",
        description: "Real estate professional with expertise in luxury properties and commercial real estate.",
        rating: 4.5,
        reviews: 112,
        phone: "+251-911-678901",
        email: "robert@luxury.com",
        verified: true,
        experience: "15 years",
        specialties: ["Luxury Homes", "Commercial Real Estate", "Property Management"]
    }
];

let filteredBrokers = [...brokersData];
let currentBroker = null;

// DOM Elements
const brokersGrid = document.getElementById('brokersGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const locationFilter = document.getElementById('locationFilter');
const noResults = document.getElementById('noResults');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayBrokers(brokersData);
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', debounce(searchBrokers, 300));
    
    // Registration form user type change
    const regUserTypeRadios = document.querySelectorAll('input[name="regUserType"]');
    regUserTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleBrokerFields);
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('contactForm').addEventListener('submit', handleContact);
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Display brokers in the grid
function displayBrokers(brokers) {
    if (brokers.length === 0) {
        brokersGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    brokersGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    brokersGrid.innerHTML = brokers.map(broker => `
        <div class="broker-card" onclick="showBrokerDetails(${broker.id})">
            <div class="broker-header">
                <div class="broker-avatar">
                    ${broker.name.charAt(0)}
                </div>
                <div class="broker-info">
                    <h3>${broker.name}</h3>
                    <div class="broker-category">${formatCategory(broker.category)}</div>
                </div>
                ${broker.verified ? '<span class="verified-badge">Verified</span>' : ''}
            </div>
            <p class="broker-description">${broker.description}</p>
            <div class="broker-details">
                <span class="broker-location">📍 ${formatLocation(broker.location)}</span>
                <div class="broker-rating">
                    <span class="stars">⭐</span>
                    <span>${broker.rating} (${broker.reviews})</span>
                </div>
            </div>
            <div class="broker-actions">
                <button class="btn-contact" onclick="event.stopPropagation(); contactBroker(${broker.id})">
                    Contact
                </button>
                <button class="btn-view" onclick="event.stopPropagation(); showBrokerDetails(${broker.id})">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Search brokers
function searchBrokers() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const location = locationFilter.value;
    
    filteredBrokers = brokersData.filter(broker => {
        const matchesSearch = broker.name.toLowerCase().includes(searchTerm) ||
                            broker.description.toLowerCase().includes(searchTerm) ||
                            broker.specialties.some(specialty => 
                                specialty.toLowerCase().includes(searchTerm)
                            );
        
        const matchesCategory = !category || broker.category === category;
        const matchesLocation = !location || broker.location === location;
        
        return matchesSearch && matchesCategory && matchesLocation;
    });
    
    displayBrokers(filteredBrokers);
}

// Filter brokers
function filterBrokers() {
    searchBrokers();
}

// Clear filters
function clearFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    locationFilter.value = '';
    filteredBrokers = [...brokersData];
    displayBrokers(filteredBrokers);
}

// Show broker details modal
function showBrokerDetails(brokerId) {
    const broker = brokersData.find(b => b.id === brokerId);
    if (!broker) return;
    
    currentBroker = broker;
    
    const brokerDetails = document.getElementById('brokerDetails');
    brokerDetails.innerHTML = `
        <div class="broker-detail-header">
            <div class="broker-avatar" style="width: 80px; height: 80px; font-size: 2rem;">
                ${broker.name.charAt(0)}
            </div>
            <div style="margin-left: 20px;">
                <h2>${broker.name}</h2>
                <p style="color: #64748b; margin: 5px 0;">${formatCategory(broker.category)}</p>
                <p style="color: #64748b;">📍 ${formatLocation(broker.location)}</p>
                ${broker.verified ? '<span class="verified-badge">Verified Broker</span>' : ''}
            </div>
        </div>
        
        <div style="margin: 30px 0;">
            <div class="broker-rating" style="justify-content: center; font-size: 1.2rem;">
                <span class="stars">⭐</span>
                <span>${broker.rating} out of 5 (${broker.reviews} reviews)</span>
            </div>
        </div>
        
        <div style="margin: 20px 0;">
            <h3>About</h3>
            <p style="color: #64748b; line-height: 1.6; margin-top: 10px;">${broker.description}</p>
        </div>
        
        <div style="margin: 20px 0;">
            <h3>Experience</h3>
            <p style="color: #64748b; margin-top: 10px;">${broker.experience} in the industry</p>
        </div>
        
        <div style="margin: 20px 0;">
            <h3>Specialties</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                ${broker.specialties.map(specialty => 
                    `<span style="background: #e0f2fe; color: #0891b2; padding: 5px 12px; border-radius: 20px; font-size: 0.9rem;">${specialty}</span>`
                ).join('')}
            </div>
        </div>
        
        <div style="margin: 30px 0; display: flex; gap: 15px; justify-content: center;">
            <button class="btn-primary" onclick="contactBroker(${broker.id})">
                Send Message
            </button>
            <a href="tel:${broker.phone}" class="btn-secondary" style="text-decoration: none; display: inline-block; text-align: center;">
                Call Now
            </a>
            <a href="mailto:${broker.email}" class="btn-secondary" style="text-decoration: none; display: inline-block; text-align: center;">
                Email
            </a>
        </div>
    `;
    
    openModal('brokerModal');
}

// Contact broker
function contactBroker(brokerId) {
    const broker = brokersData.find(b => b.id === brokerId);
    if (!broker) return;
    
    currentBroker = broker;
    closeModal('brokerModal');
    openModal('contactModal');
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    // Simulate login process
    console.log('Login attempt:', { email, userType });
    
    // Show success message
    alert(`Login successful! Welcome ${userType}.`);
    closeModal('loginModal');
    
    // Reset form
    document.getElementById('loginForm').reset();
}

// Handle registration form submission
function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    
    // Simulate registration process
    console.log('Registration data:', userData);
    
    if (userData.regUserType === 'broker') {
        alert('Registration submitted! Your broker account will be reviewed and verified within 2-3 business days. You will receive an email confirmation once approved.');
    } else {
        alert('Registration successful! Welcome to FindBroker.');
    }
    
    closeModal('registerModal');
    
    // Reset form
    document.getElementById('registerForm').reset();
    document.getElementById('brokerFields').style.display = 'none';
}

// Handle contact form submission
function handleContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    // Simulate sending message
    console.log('Contact message:', { name, email, message, broker: currentBroker?.name });
    
    alert(`Message sent to ${currentBroker?.name}! They will contact you soon.`);
    closeModal('contactModal');
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// Toggle broker fields in registration form
function toggleBrokerFields() {
    const userType = document.querySelector('input[name="regUserType"]:checked').value;
    const brokerFields = document.getElementById('brokerFields');
    
    if (userType === 'broker') {
        brokerFields.style.display = 'block';
    } else {
        brokerFields.style.display = 'none';
    }
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Utility functions
function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatLocation(location) {
    return location.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});