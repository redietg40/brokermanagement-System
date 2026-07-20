// Mock Data
const categories = [
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "fas fa-home",
    count: 245,
    color: "#3b82f6",
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: "fas fa-car",
    count: 189,
    color: "#ef4444",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "fas fa-laptop",
    count: 334,
    color: "#8b5cf6",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "fas fa-tshirt",
    count: 167,
    color: "#ec4899",
  },
  {
    id: "services",
    name: "Services",
    icon: "fas fa-tools",
    count: 223,
    color: "#10b981",
  },
  {
    id: "food",
    name: "Food & Beverage",
    icon: "fas fa-utensils",
    count: 145,
    color: "#f59e0b",
  },
  {
    id: "health",
    name: "Health & Beauty",
    icon: "fas fa-heart",
    count: 178,
    color: "#06b6d4",
  },
  {
    id: "sports",
    name: "Sports & Recreation",
    icon: "fas fa-football-ball",
    count: 156,
    color: "#84cc16",
  },
  {
    id: "education",
    name: "Education",
    icon: "fas fa-graduation-cap",
    count: 89,
    color: "#6366f1",
  },
  {
    id: "travel",
    name: "Travel & Tourism",
    icon: "fas fa-plane",
    count: 134,
    color: "#14b8a6",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: "fas fa-seedling",
    count: 198,
    color: "#22c55e",
  },
  {
    id: "construction",
    name: "Construction",
    icon: "fas fa-hard-hat",
    count: 167,
    color: "#f97316",
  },
];

let listings = [
  {
    id: 1,
    title: "Luxury Apartment in Bole",
    description:
      "Beautiful 3-bedroom apartment with modern amenities, swimming pool, and gym access in the heart of Addis Ababa.",
    category: "Real Estate",
    location: "Addis Ababa",
    price: 15000,
    image: "/placeholder.svg?height=220&width=380",
    broker: {
      name: "Ahmed Hassan",
      avatar: "/placeholder.svg?height=45&width=45",
      rating: 4.8,
      verified: true,
      experience: "8 years",
    },
    date: "2024-01-15",
    featured: true,
    views: 1247,
  },
  {
    id: 2,
    title: "Toyota Camry 2020",
    description:
      "Well-maintained sedan with low mileage, full service history, and excellent condition. Perfect for city driving.",
    category: "Automotive",
    location: "Dire Dawa",
    price: 850000,
    image: "/placeholder.svg?height=220&width=380",
    broker: {
      name: "Sara Mekonnen",
      avatar: "/placeholder.svg?height=45&width=45",
      rating: 4.9,
      verified: true,
      experience: "12 years",
    },
    date: "2024-01-14",
    featured: true,
    views: 892,
  },
  {
    id: 3,
    title: "MacBook Pro M2 - Latest Model",
    description:
      "Brand new MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Ideal for professionals and students.",
    category: "Electronics",
    location: "Bahir Dar",
    price: 95000,
    image: "/placeholder.svg?height=220&width=380",
    broker: {
      name: "Daniel Tadesse",
      avatar: "/placeholder.svg?height=45&width=45",
      rating: 4.7,
      verified: true,
      experience: "5 years",
    },
    date: "2024-01-13",
    featured: false,
    views: 634,
  },
  {
    id: 4,
    title: "Professional Wedding Photography",
    description:
      "Award-winning wedding photography services with 10+ years experience. Complete package includes engagement and ceremony.",
    category: "Services",
    location: "Hawassa",
    price: 25000,
    image: "/placeholder.svg?height=220&width=380",
    broker: {
      name: "Meron Bekele",
      avatar: "/placeholder.svg?height=45&width=45",
      rating: 5.0,
      verified: true,
      experience: "15 years",
    },
    date: "2024-01-12",
    featured: true,
    views: 1456,
  },
  {
    id: 5,
    title: "Designer Handbags Collection",
    description:
      "Authentic designer handbags from top international brands. New arrivals from Milan and Paris fashion weeks.",
    category: "Fashion",
    location: "Addis Ababa",
    price: 8500,
    image: "/placeholder.svg?height=220&width=380",
    broker: {
      name: "Hanan Ali",
      avatar: "/placeholder.svg?height=45&width=45",
      rating: 4.6,
      verified: true,
      experience: "7 years",
    },
    date: "2024-01-11",
    featured: false,
    views: 723,
  },
  {
    id: 6,
    title: "Premium Ethiopian Coffee Beans",
    description:
      "Single-origin coffee beans from Yirgacheffe region. Directly sourced from local farmers with fair trade certification.",
    category: "Food & Beverage",
    location: "Jimma",
    price: 450,
    image: "/placeholder.svg?height=220&width=380",
    broker: {
      name: "Getachew Worku",
      avatar: "/placeholder.svg?height=45&width=45",
      rating: 4.8,
      verified: true,
      experience: "20 years",
    },
    date: "2024-01-10",
    featured: true,
    views: 1089,
  },
  {
    id: 7,
    title: "Traditional Ethiopian Dresses",
    description:
      "Handwoven traditional dresses with intricate patterns. Perfect for cultural events and celebrations.",
    category: "Fashion",
    location: "Gondar",
    price: 3500,
    image: "/placeholder.svg?height=220&width=380",
    broker: {
      name: "Tigist Alemayehu",
      avatar: "/placeholder.svg?height=45&width=45",
      rating: 4.9,
      verified: true,
      experience: "10 years",
    },
    date: "2024-01-09",
    featured: false,
    views: 567,
  },
  {
    id: 8,
    title: "Modern Office Space for Rent",
    description:
      "Fully furnished office space in prime location with high-speed internet, meeting rooms, and parking.",
    category: "Real Estate",
    location: "Mekelle",
    price: 12000,
    image: "/placeholder.svg?height=220&width=380",
    broker: {
      name: "Yohannes Gebru",
      avatar: "/placeholder.svg?height=45&width=45",
      rating: 4.7,
      verified: true,
      experience: "9 years",
    },
    date: "2024-01-08",
    featured: true,
    views: 934,
  },
];

const testimonials = [
  {
    id: 1,
    text: "FindBroker helped me find the perfect apartment in Addis Ababa. The verification process gave me confidence.<p>and the broker was incredibly professional</p>",
    author: "Almaz Tesfaye",
    role: "Software Engineer",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    id: 2,
    text: "As a broker, this platform has transformed my business. The quality of leads is excellent, <p>and the support team is always helpful.</p>",
    author: "Dawit Mengistu",
    role: "Real Estate Broker",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    id: 3,
    text: "I sold my car within a week through FindBroker. The process was smooth, secure, <p>and the buyer was genuine. Highly recommended!</p>",
    author: "Selamawit Haile",
    role: "Teacher",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    id: 4,
    text: "The verification system is what sets FindBroker apart. <p>I felt safe throughout the entire transaction process.</p>",
    author: "Mulugeta Assefa",
    role: "Business Owner",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
];

// Global Variables
let currentUser = null;
let filteredListings = [];
let currentListingId = null;
let currentTestimonialIndex = 0;
let currentView = "grid";
let searchSuggestions = [];
const isScrolling = false;

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", async () => {
  await initializeApp();
});

// Initialize Application
async function initializeApp() {
  updateAuthUI();
  try {
    listings = await DB_getApprovedListings();
    filteredListings = [...listings];
  } catch (err) {
    console.error("Failed to load listings:", err);
  }
  renderCategories();
  renderListings();
  renderTestimonials();
  populateCategoryFilter();
  setupScrollEffects();
  setupSmoothScrolling();
  setupSearchSuggestions();
  setupBackToTop();

  animateCounters();
  setupLazyLoading();
  setupKeyboardNavigation();
  await renderMovingImages();
  initializeMovingImages(); // Add moving images initialization
}

// Theme Management

// Enhanced Render Categories
function renderCategories() {
  const categoriesGrid = document.getElementById("categoriesGrid");
  if (!categoriesGrid) return; // guard: not on every page
  categoriesGrid.innerHTML = categories
    .map(
      (category, index) => `
        <div class="category-card fade-in" onclick="filterByCategory('${
          category.name
        }')" style="animation-delay: ${index * 0.1}s">
            <div class="category-icon" style="color: ${category.color}">
                <i class="${category.icon}"></i>
            </div>
            <h3 class="category-name">${category.name}</h3>
            <p class="category-count">${category.count} listings</p>
        </div>
    `
    )
    .join("");
}

// Enhanced Render Listings
function renderListings() {
  const listingsGrid = document.getElementById("listingsGrid");
  if (!listingsGrid) return;
  listingsGrid.className = `listings-grid ${currentView}-view`;

  if (!filteredListings || filteredListings.length === 0) {
    listingsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #64748b;">
        <i class="fas fa-folder-open" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem; display: block;"></i>
        <h3 style="font-size: 1.25rem; color: #1e293b;">No listings found</h3>
        <p>No listings match the selected category or filters.</p>
      </div>
    `;
    return;
  }

  listingsGrid.innerHTML = filteredListings
    .map(
      (listing, index) => {
        const firstImg = (listing.images && listing.images.length > 0) ? listing.images[0] : (listing.image || 'images/villa2.jpg');
        const bName = listing.brokerName || (listing.broker && listing.broker.name) || 'Verified Broker';
        const bAvatar = (listing.broker && listing.broker.avatar) || 'images/broker-image-removebg-preview.png';
        const bRating = (listing.broker && listing.broker.rating) || 4.8;
        const bExp = (listing.broker && listing.broker.experience) || 'Verified Agent';
        const cat = listing.category || listing.type || 'Real Estate';
        const loc = listing.locationLabel || listing.location || 'Ethiopia';
        const views = listing.views || 0;
        const dateStr = listing.createdAt ? formatDate(listing.createdAt) : (listing.date || 'Recently');

        return `
        <div class="listing-card fade-in" onclick="showListingDetails('${listing.id}')" style="animation-delay: ${index * 0.05}s">
            <img src="${firstImg}" alt="${listing.title}" class="listing-image" loading="lazy" onerror="this.src='images/villa2.jpg';">
            <div class="listing-content">
                <div class="listing-category" style="text-transform: capitalize;">${cat}</div>
                <h3 class="listing-title">${listing.title}</h3>
                <p class="listing-description" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${listing.description || ''}</p>
                <div class="listing-meta">
                    <span class="listing-location">
                        <i class="fas fa-map-marker-alt"></i> ${loc}
                    </span>
                    <span class="listing-price">
                        <i class="fas fa-tag"></i> ${formatPrice(listing.price)} ETB
                    </span>
                </div>
                <div class="listing-stats">
                    <span class="listing-views">
                        <i class="fas fa-eye"></i> ${views} views
                    </span>
                    <span class="listing-date">${dateStr}</span>
                </div>
                <div class="broker-info">
                    <img src="${bAvatar}" alt="${bName}" class="broker-avatar" onerror="this.src='images/broker-image-removebg-preview.png';">
                    <div class="broker-details">
                        <h4>${bName}</h4>
                        <div class="broker-rating">
                            ${"★".repeat(Math.floor(bRating))} ${bRating}
                        </div>
                        <div class="broker-experience">${bExp}</div>
                    </div>
                    <span class="verified-badge"><i class="fas fa-check"></i> Verified</span>
                </div>

                <!-- Action Buttons: View Details & Contact Broker -->
                <div style="display:flex; gap:0.5rem; margin-top:1rem; padding-top:0.75rem; border-top:1px solid #f1f5f9;">
                  <button type="button" class="btn btn-outline" style="flex:1; padding:0.45rem 0.6rem; font-size:0.85rem;" onclick="event.stopPropagation(); showListingDetails('${listing.id}')">
                    <i class="fas fa-eye"></i> View Details
                  </button>
                  <button type="button" class="btn btn-primary" style="flex:1; padding:0.45rem 0.6rem; font-size:0.85rem;" onclick="event.stopPropagation(); showContactModal('${listing.id}')">
                    <i class="fas fa-paper-plane"></i> Contact
                  </button>
                </div>
            </div>
        </div>
    `;
      }
    )
    .join("");
}

// Category Normalizer helper
function normalizeCat(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Category Filter & Sorting Helpers for browse.html
function populateCategoryFilter() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;

  select.innerHTML = `<option value="">All Categories</option>` +
    categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

  // Check URL params for category filter (e.g. browse.html?category=real-estate)
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category') || params.get('cat');
  if (catParam) {
    select.value = catParam;
    filterListings();
  }
}

function filterListings() {
  const catSelect = document.getElementById("categoryFilter");
  const selectedCat = catSelect ? catSelect.value.trim() : "";
  const normSelected = normalizeCat(selectedCat);

  // Update Page Section Header Title if on browse.html
  const sectionTitleEl = document.querySelector("#browse .section-title");
  if (sectionTitleEl) {
    if (selectedCat) {
      const matchObj = categories.find(c => normalizeCat(c.id) === normSelected || normalizeCat(c.name) === normSelected);
      const catName = matchObj ? matchObj.name : selectedCat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      sectionTitleEl.innerText = `${catName} Listings`;
    } else {
      sectionTitleEl.innerText = "Browse All Listings";
    }
  }

  if (!normSelected) {
    filteredListings = [...listings];
  } else {
    filteredListings = listings.filter(l => {
      const normCat = normalizeCat(l.category || "");
      const normType = normalizeCat(l.type || "");
      return normCat === normSelected || 
             normCat.includes(normSelected) || 
             normSelected.includes(normCat) || 
             normType.includes(normSelected);
    });
  }
  sortListings();
}

function filterByCategory(catName) {
  const catObj = categories.find(c => normalizeCat(c.name) === normalizeCat(catName) || normalizeCat(c.id) === normalizeCat(catName));
  const catId = catObj ? catObj.id : catName.toLowerCase();
  
  const select = document.getElementById("categoryFilter");
  if (select) {
    select.value = catId;
    filterListings();
  } else {
    window.location.href = `browse.html?category=${catId}`;
  }
}

function sortListings() {
  const sortSelect = document.getElementById("sortFilter");
  const sortVal = sortSelect ? sortSelect.value : "newest";

  if (sortVal === "newest") {
    filteredListings.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
  } else if (sortVal === "oldest") {
    filteredListings.sort((a, b) => new Date(a.createdAt || a.date || 0) - new Date(b.createdAt || b.date || 0));
  } else if (sortVal === "name") {
    filteredListings.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortVal === "rating") {
    filteredListings.sort((a, b) => ((b.broker && b.broker.rating) || 0) - ((a.broker && a.broker.rating) || 0));
  } else if (sortVal === "price-low") {
    filteredListings.sort((a, b) => a.price - b.price);
  } else if (sortVal === "price-high") {
    filteredListings.sort((a, b) => b.price - a.price);
  }
  renderListings();
}

// Render Testimonials with API integration and carousel structure
async function renderTestimonials() {
  const testimonialsSlider = document.getElementById("testimonialsSlider");
  const sliderDots = document.getElementById("sliderDots");
  if (!testimonialsSlider || !sliderDots) return;

  let activeReviews = [...testimonials];
  try {
    const liveReviews = await DB_getReviews();
    if (liveReviews && liveReviews.length > 0) {
      activeReviews = liveReviews.map(r => ({
        id: r.id,
        text: r.text,
        author: r.author,
        role: r.role || 'Customer',
        avatar: r.avatar || 'images/broker-image-removebg-preview.png',
        rating: r.rating || 5
      }));
    }
  } catch (e) {
    console.warn("Using default static reviews:", e);
  }

  // Create testimonials container
  testimonialsSlider.innerHTML = `
    <div class="testimonials-container" id="testimonialsContainer">
      ${activeReviews
        .map(
          (testimonial) => `
            <div class="testimonial-card">
                <div class="testimonial-rating">
                    ${"★".repeat(testimonial.rating)}
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-author">
                    <img src="${testimonial.avatar}" alt="${testimonial.author}" class="testimonial-avatar" onerror="this.src='images/broker-image-removebg-preview.png';">
                    <div class="testimonial-info">
                        <h4>${testimonial.author}</h4>
                        <p>${testimonial.role}</p>
                    </div>
                </div>
            </div>
        `
        )
        .join("")}
    </div>
  `;

  // Create navigation dots
  sliderDots.innerHTML = activeReviews
    .map(
      (_, index) => `
        <button class="slider-dot ${
          index === 0 ? "active" : ""
        }" onclick="goToTestimonial(${index})" aria-label="Go to testimonial ${
        index + 1
      }"></button>
    `
    )
    .join("");

  setupTestimonialAutoSlide();
}

function showAddReviewModal() {
  const modal = document.getElementById("addReviewModal");
  if (modal) modal.classList.add("active");
}

async function handleReviewSubmit(e) {
  e.preventDefault();
  const author = document.getElementById("revAuthor").value.trim();
  const role = document.getElementById("revRole").value.trim();
  const rating = parseInt(document.getElementById("revRating").value) || 5;
  const text = document.getElementById("revText").value.trim();

  const success = await DB_addReview({ author, role, rating, text });
  if (success) {
    alert("Thank you! Your review has been posted successfully.");
    closeModal("addReviewModal");
    renderTestimonials();
  } else {
    alert("Failed to submit review. Please try again.");
  }
}

function nextTestimonial() {
  currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
  updateTestimonialSlider();
}

function previousTestimonial() {
  currentTestimonialIndex =
    currentTestimonialIndex === 0
      ? testimonials.length - 1
      : currentTestimonialIndex - 1;
  updateTestimonialSlider();
}

function goToTestimonial(index) {
  currentTestimonialIndex = index;
  updateTestimonialSlider();
}

// Update testimonial slider to use proper carousel transform
function updateTestimonialSlider() {
  const container = document.getElementById("testimonialsContainer");
  const dots = document.querySelectorAll(".slider-dot");

  if (container) {
    // Use percentage-based transform for responsive design
    const translateX = -(currentTestimonialIndex * 100);
    container.style.transform = `translateX(${translateX}%)`;
  }

  // Update active dot
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentTestimonialIndex);
  });
}

function setupTestimonialAutoSlide() {
  const slider = document.getElementById("testimonialsSlider");
  let autoSlideInterval = setInterval(nextTestimonial, 6000);

  if (slider) {
    slider.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval);
    });

    slider.addEventListener("mouseleave", () => {
      autoSlideInterval = setInterval(nextTestimonial, 6000);
    });
  }
}

// View Toggle
function setView(view) {
  currentView = view;
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  renderListings();
}

// Enhanced Search with Suggestions
function setupSearchSuggestions() {
  const searchInput = document.getElementById("searchInput");
  const suggestionsContainer = document.getElementById("searchSuggestions");
  if (!searchInput || !suggestionsContainer) return;

  // Create search suggestions from listings and categories
  searchSuggestions = [
    ...categories.map((cat) => cat.name),
    ...listings.map((listing) => listing.title),
    ...listings.map((listing) => listing.location),
    "Apartment",
    "House",
    "Car",
    "Laptop",
    "Phone",
    "Services",
  ].filter((item, index, arr) => arr.indexOf(item) === index);

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    if (query.length < 2) {
      suggestionsContainer.style.display = "none";
      return;
    }

    const matches = searchSuggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(query))
      .slice(0, 5);

    if (matches.length > 0) {
      suggestionsContainer.innerHTML = matches
        .map(
          (match) => `
                <div class="suggestion-item" onclick="selectSuggestion('${match}')">
                    <i class="fas fa-search"></i> ${match}
                </div>
            `
        )
        .join("");
      suggestionsContainer.style.display = "block";
    } else {
      suggestionsContainer.style.display = "none";
    }
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-input-group")) {
      suggestionsContainer.style.display = "none";
    }
  });
}

function selectSuggestion(suggestion) {
  document.getElementById("searchInput").value = suggestion;
  document.getElementById("searchSuggestions").style.display = "none";
  performAdvancedSearch();
}

// Enhanced Search Function
function performAdvancedSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const location = document.getElementById("locationFilter").value;
  const priceRange = document.getElementById("priceRange").value;

  filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm) ||
      listing.description.toLowerCase().includes(searchTerm) ||
      listing.category.toLowerCase().includes(searchTerm) ||
      listing.broker.name.toLowerCase().includes(searchTerm);

    const matchesLocation =
      !location ||
      listing.location.toLowerCase().includes(location.toLowerCase());

    let matchesPrice = true;
    if (priceRange) {
      const [min, max] = priceRange
        .split("-")
        .map((p) => Number.parseInt(p.replace("+", "")));
      if (max) {
        matchesPrice = listing.price >= min && listing.price <= max;
      } else {
        matchesPrice = listing.price >= min;
      }
    }

    return matchesSearch && matchesLocation && matchesPrice;
  });

  renderListings();

  // Show search results count
  showNotification(
    `Found ${filteredListings.length} listings matching your search`,
    "info"
  );

  // Scroll to results
  document.getElementById("browse").scrollIntoView({ behavior: "smooth" });
}

// Animate Counters
function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = Number.parseInt(counter.dataset.count);
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  });

  counters.forEach((counter) => observer.observe(counter));
}

// Back to Top Button
function setupBackToTop() {
  const backToTopBtn = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Lazy Loading
function setupLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// Enhanced Keyboard Navigation
function setupKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    // ESC key closes modals
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal.active");
      if (activeModal) {
        activeModal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    }

    // Enter key on search
    if (e.key === "Enter" && e.target.id === "searchInput") {
      performAdvancedSearch();
    }

    // Arrow keys for testimonials - only when not in input fields
    if (!e.target.matches("input, textarea, select")) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        previousTestimonial();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextTestimonial();
      }
    }
  });
}

// Utility Functions
function formatPrice(price) {
  return new Intl.NumberFormat("en-ET").format(price);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-ET", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Newsletter Subscription
function handleNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;

  // Simulate newsletter subscription
  const button = event.target.querySelector("button");
  const originalText = button.innerHTML;
  button.innerHTML = '<span class="spinner"></span>Subscribing...';
  button.disabled = true;

  setTimeout(() => {
    button.innerHTML = originalText;
    button.disabled = false;
    event.target.reset();
    showNotification("Successfully subscribed to newsletter!", "success");
  }, 1500);
}

// Ensure Listing Details Modal exists on the page
function ensureListingModalExists() {
  let modal = document.getElementById("listingModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "listingModal";
    modal.className = "modal modal-large";
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <h3 id="listingTitle">Listing Details</h3>
          <button class="close-btn" onclick="closeModal('listingModal')">&times;</button>
        </div>
        <div id="listingDetails"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

// Enhanced Listing Details Modal with specs formatting
function showListingDetails(listingId) {
  const listing = listings.find((l) => String(l.id) === String(listingId));
  if (!listing) return;

  ensureListingModalExists();

  // Increment view count
  listing.views = (listing.views || 0) + 1;
  currentListingId = listingId;

  const titleEl = document.getElementById("listingTitle");
  if (titleEl) titleEl.textContent = listing.title;

  const firstImg = (listing.images && listing.images.length > 0) ? listing.images[0] : (listing.image || 'images/villa2.jpg');
  const allImages = (listing.images && listing.images.length > 0) ? listing.images : [firstImg];
  const bName = listing.brokerName || (listing.broker && listing.broker.name) || 'Verified Broker';
  const bAvatar = (listing.broker && listing.broker.avatar) || 'images/broker-image-removebg-preview.png';
  const bRating = (listing.broker && listing.broker.rating) || 4.8;
  const bExp = (listing.broker && listing.broker.experience) || 'Verified Broker';
  const cat = listing.category || listing.type || 'Real Estate';
  const loc = listing.locationLabel || listing.location || 'Ethiopia';
  const specs = listing.specs || {};

  // Build Category Specs HTML
  let specsHTML = '';
  if (specs.year || specs.mileage || specs.fuelType || specs.transmission) {
    // Automotive
    specsHTML = `
      <div style="background:#f8fafc; padding:1rem; border-radius:10px; margin-bottom:1rem; border:1px solid #e2e8f0;">
        <h4 style="margin:0 0 0.5rem 0; color:#1e293b;"><i class="fas fa-car" style="color:#ef4444;"></i> Vehicle Specifications</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem; font-size:0.9rem;">
          <div><strong>Year:</strong> ${specs.year || 'N/A'}</div>
          <div><strong>Mileage:</strong> ${specs.mileage ? specs.mileage + ' km' : 'N/A'}</div>
          <div><strong>Fuel Type:</strong> ${specs.fuelType || 'N/A'}</div>
          <div><strong>Transmission:</strong> ${specs.transmission || 'N/A'}</div>
          <div><strong>Condition:</strong> ${specs.condition || 'N/A'}</div>
          <div><strong>Engine:</strong> ${specs.engineSize || 'N/A'}</div>
          <div><strong>Color:</strong> ${specs.color || 'N/A'}</div>
        </div>
      </div>
    `;
  } else if (specs.brand || specs.model || specs.storage || specs.ram) {
    // Electronics
    specsHTML = `
      <div style="background:#f8fafc; padding:1rem; border-radius:10px; margin-bottom:1rem; border:1px solid #e2e8f0;">
        <h4 style="margin:0 0 0.5rem 0; color:#1e293b;"><i class="fas fa-laptop" style="color:#8b5cf6;"></i> Device Specifications</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem; font-size:0.9rem;">
          <div><strong>Brand:</strong> ${specs.brand || 'N/A'}</div>
          <div><strong>Model:</strong> ${specs.model || 'N/A'}</div>
          <div><strong>Storage:</strong> ${specs.storage || 'N/A'}</div>
          <div><strong>RAM:</strong> ${specs.ram || 'N/A'}</div>
          <div><strong>Processor:</strong> ${specs.processor || 'N/A'}</div>
          <div><strong>Condition:</strong> ${specs.condition || 'N/A'}</div>
        </div>
      </div>
    `;
  } else if (specs.size || specs.material || specs.gender) {
    // Fashion
    specsHTML = `
      <div style="background:#f8fafc; padding:1rem; border-radius:10px; margin-bottom:1rem; border:1px solid #e2e8f0;">
        <h4 style="margin:0 0 0.5rem 0; color:#1e293b;"><i class="fas fa-tshirt" style="color:#ec4899;"></i> Product Specifications</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem; font-size:0.9rem;">
          <div><strong>Brand:</strong> ${specs.brand || 'N/A'}</div>
          <div><strong>Size:</strong> ${specs.size || 'N/A'}</div>
          <div><strong>Material:</strong> ${specs.material || 'N/A'}</div>
          <div><strong>Gender:</strong> ${specs.gender || 'N/A'}</div>
          <div><strong>Condition:</strong> ${specs.condition || 'N/A'}</div>
        </div>
      </div>
    `;
  } else if (listing.bedrooms || listing.bathrooms || listing.area || specs.area) {
    // Real Estate
    specsHTML = `
      <div style="background:#f8fafc; padding:1rem; border-radius:10px; margin-bottom:1rem; border:1px solid #e2e8f0;">
        <h4 style="margin:0 0 0.5rem 0; color:#1e293b;"><i class="fas fa-home" style="color:#2563eb;"></i> Property Specifications</h4>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; font-size:0.9rem;">
          <div><strong>Area:</strong> ${listing.area || specs.area || 0} m²</div>
          <div><strong>Bedrooms:</strong> ${listing.bedrooms || specs.bedrooms || 0}</div>
          <div><strong>Bathrooms:</strong> ${listing.bathrooms || specs.bathrooms || 0}</div>
        </div>
      </div>
    `;
  }

  const detailsHTML = `
        <div style="padding: 1.5rem;">
            <div class="listing-image-gallery" style="display:flex; gap:10px; overflow-x:auto; margin-bottom:1.5rem; padding-bottom:5px;">
                ${allImages.map(img => `<img src="${img}" style="width:280px; height:200px; object-fit:cover; border-radius:10px; border:1px solid #e2e8f0;" onerror="this.src='images/villa2.jpg';" />`).join('')}
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                <div class="listing-main-info">
                    <div class="listing-badges" style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                        <span style="background: #2563eb; color: white; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.82rem; font-weight: 600; text-transform:capitalize;">
                            ${cat}
                        </span>
                        <span style="background: #10b981; color: white; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.82rem; font-weight: 600; text-transform:capitalize;">
                            ${listing.saleStatus || 'For Sale'}
                        </span>
                    </div>
                    
                    <h2 style="font-size: 1.75rem; margin-bottom: 0.75rem; color: #1e293b; font-weight: 700;">${listing.title}</h2>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; padding: 1.25rem; background: #f8fafc; border-radius: 12px; border:1px solid #e2e8f0;">
                        <div>
                            <span style="font-size: 1.75rem; font-weight: 800; color: #2563eb;">${formatPrice(listing.price)} ETB</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: #64748b; margin-bottom: 0.25rem; font-size:0.9rem;">
                                <i class="fas fa-map-marker-alt" style="color:#ef4444;"></i> ${loc}
                            </div>
                            <div style="color: #94a3b8; font-size: 0.85rem;">
                                <i class="fas fa-eye"></i> ${listing.views} views
                            </div>
                        </div>
                    </div>
                    
                    ${specsHTML}

                    <h4 style="margin-bottom: 0.5rem; color: #1e293b;">Description</h4>
                    <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem; font-size: 1rem; white-space:pre-line;">${listing.description || ''}</p>
                </div>
                
                <div class="broker-contact-card">
                    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; text-align:center;">
                        <img src="${bAvatar}" alt="${bName}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; margin-bottom: 0.75rem; border: 2px solid #2563eb;" onerror="this.src='images/broker-image-removebg-preview.png';">
                        <h4 style="margin-bottom: 0.25rem; font-size: 1.15rem; color: #1e293b;">${bName}</h4>
                        <div style="color: #f59e0b; margin-bottom: 0.5rem; font-size: 0.95rem;">
                            ${"★".repeat(Math.floor(bRating))} ${bRating}
                        </div>
                        <div style="color: #64748b; margin-bottom: 1rem; font-size:0.85rem;">${bExp}</div>
                        
                        <button class="btn btn-primary btn-full" onclick="showContactModal('${listing.id}')" style="margin-bottom: 0.75rem; font-size: 0.95rem; padding: 0.75rem;">
                            <i class="fas fa-paper-plane"></i> Contact Broker
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  const detailsContainer = document.getElementById("listingDetails");
  if (detailsContainer) detailsContainer.innerHTML = detailsHTML;
  showModal("listingModal");
}

function callBroker() {
  showNotification("Redirecting to phone app...", "info");
  // In a real app, this would open the phone app
  setTimeout(() => {
    window.location.href = "tel:+251911123456";
  }, 1000);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.toggle("active");
}

// Modal Functions
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function showLoginModal() {
  showModal("loginModal");
}

function showRegisterModal() {
  // Direct to full 5-step broker registration page
  window.location.href = "broker-register.html";
}

function switchToRegister() {
  closeModal("loginModal");
  window.location.href = "broker-register.html";
}

function toggleBrokerFields() {
  const typeSelect = document.getElementById("userType");
  if (typeSelect && typeSelect.value === "broker") {
    window.location.href = "broker-register.html";
  }
}

function switchToLogin() {
  const modal = document.getElementById("registerModal");
  if (modal) closeModal("registerModal");
  showModal("loginModal");
}

// Search and Filter Functions
function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const location = document.getElementById("locationFilter").value;

  filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm) ||
      listing.description.toLowerCase().includes(searchTerm) ||
      listing.category.toLowerCase().includes(searchTerm);
    const matchesLocation =
      !location ||
      listing.location.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  renderListings();

  // Scroll to results
  document.getElementById("browse").scrollIntoView({ behavior: "smooth" });
}

function normalizeCategory(cat) {
  if (!cat) return "";
  const c = cat.toLowerCase().trim();
  if (c === "real estate" || c === "real-estate") return "real-estate";
  if (c === "automotive" || c === "car") return "automotive";
  if (c === "electronics" || c === "laptop") return "electronics";
  if (c === "fashion" || c === "clothing") return "fashion";
  if (c === "food & beverage" || c === "food") return "food";
  if (c === "agriculture" || c === "seedling") return "agriculture";
  if (c === "services") return "services";
  if (c === "health & beauty" || c === "health") return "health";
  if (c === "sports & recreation" || c === "sports") return "sports";
  if (c === "education") return "education";
  if (c === "travel & tourism" || c === "travel") return "travel";
  if (c === "construction") return "construction";
  return c.replace(/[^a-z0-9]+/g, '-');
}

function filterByCategory(categoryId) {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.value = categoryId;
    filterListings();
    const browseSection = document.getElementById("browse");
    if (browseSection) {
      browseSection.scrollIntoView({ behavior: "smooth" });
    }
  } else {
    window.location.href = `browse.html?category=${categoryId}`;
  }
}

function filterListings() {
  const category = document.getElementById("categoryFilter").value;

  filteredListings = listings.filter((listing) => {
    if (!category) return true;
    return normalizeCategory(listing.category) === normalizeCategory(category);
  });

  renderListings();
}

function sortListings() {
  const sortBy = document.getElementById("sortFilter").value;

  filteredListings.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  renderListings();
}

// Populate Category Filter
function populateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;
  categoryFilter.innerHTML =
    '<option value="">All Categories</option>' +
    categories
      .map(
        (category) =>
          `<option value="${category.id}">${category.name}</option>`
      )
      .join("");
}

// Load More Listings
function loadMoreListings() {
  // Simulate loading more listings
  const button = document.querySelector(".load-more button");
  const originalText = button.innerHTML;
  button.innerHTML = '<span class="spinner"></span>Loading...';
  button.disabled = true;

  setTimeout(() => {
    button.innerHTML = originalText;
    button.disabled = false;
    showNotification("No more listings to load", "info");
  }, 1500);
}

// Utility Functions
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "#10b981"
            : type === "error"
            ? "#ef4444"
            : "#2563eb"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 3000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function updateUIForLoggedInUser() {
  // Update navigation for logged in user
  const navButtons = document.querySelector(".nav-buttons");
  navButtons.innerHTML = `
        <span>Welcome, ${currentUser.email}</span>
        <button class="btn btn-outline" onclick="logout()">Logout</button>
    `;
}

function logout() {
  currentUser = null;
  location.reload();
}

// Scroll Effects
function setupScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  // Observe elements that should animate on scroll
  document.querySelectorAll(".category-card, .listing-card").forEach((el) => {
    observer.observe(el);
  });
}

// Smooth Scrolling
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Close modals when clicking outside
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Add CSS for new elements
const additionalStyles = `
    .suggestion-item {
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
    }
    
    .suggestion-item:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }
    
    .listing-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 0.85rem;
        color: var(--text-tertiary);
    }
    
    .listing-views {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .broker-experience {
        font-size: 0.8rem;
        color: var(--text-tertiary);
    }
    
    .featured-badge {
        background: var(--warning-color);
        color: white;
        font-size: 0.7rem;
        padding: 0.3rem 0.6rem;
        border-radius: 20px;
        font-weight: 600;
        margin-left: 0.5rem;
    }
    
    .testimonial-rating {
        color: var(--warning-color);
        font-size: 1.2rem;
        margin-bottom: 1rem;
        text-align: center;
    }
`;

// Add the additional styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

function scrollMovingImages(direction) {
  const container = document.getElementById("movingImagesContainer");
  const scrollAmount = 350; // Width of one property card plus gap

  if (direction === "left") {
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  } else if (direction === "right") {
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }
}

function goToSlide(slideIndex) {
  const container = document.getElementById("movingImagesContainer");
  const track = document.getElementById("movingImagesTrack");
  const dots = document.querySelectorAll(".dot");

  // Remove active class from all dots
  dots.forEach((dot) => dot.classList.remove("active"));

  // Add active class to clicked dot
  dots[slideIndex].classList.add("active");

  // Calculate position to scroll to
  const slideWidth = 350; // Width of one property card plus gap
  const scrollPosition = slideIndex * slideWidth;

  // Scroll to position
  container.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  });

  // Temporarily pause animation while user navigates
  if (track) {
    track.style.animationPlayState = "paused";
    setTimeout(() => {
      track.style.animationPlayState = "running";
    }, 3000); // Resume after 3 seconds
  }
}

function initializeMovingImages() {
  const container = document.getElementById("movingImagesContainer");
  const track = document.getElementById("movingImagesTrack");

  if (track) {
    track.style.transform = "translateY(-50%) translateX(0)";
  }

  container.addEventListener("scroll", () => {
    const scrollPosition = container.scrollLeft;
    const slideWidth = 350;
    const currentSlide = Math.round(scrollPosition / slideWidth);
    const dots = document.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  });

  container.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      scrollMovingImages("left");
    } else if (e.key === "ArrowRight") {
      scrollMovingImages("right");
    }
  });

  container.setAttribute("tabindex", "0");

  console.log(
    "[v0] Moving images initialized with dot navigation and automatic movement"
  );
}

// ============================================================
// FindBroker Auth & Dynamic Carousel Helpers
// ============================================================

function toggleBrokerFields() {
  const userType = document.getElementById("userType").value;
  const brokerFields = document.getElementById("brokerFields");
  if (userType === "broker") {
    brokerFields.style.display = "block";
    document.getElementById("brokerLicense").setAttribute("required", "required");
    document.getElementById("brokerCity").setAttribute("required", "required");
  } else {
    brokerFields.style.display = "none";
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
      closeModal("registerModal");
      event.target.reset();
      document.getElementById("brokerFields").style.display = "none";
    } else {
      showNotification(res.message, "error");
    }
  } else {
    // Buyer / User
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

  // 1. Try admin login
  if (email.toLowerCase() === "admin@findbroker.com") {
    const isAdmin = await DB_adminLogin(email, password);
    if (isAdmin) {
      showNotification("Welcome Admin! Redirecting...", "success");
      setTimeout(() => { window.location.href = "admin-panel.html"; }, 1000);
      return;
    }
  }

  // 2. Try broker login
  const brokerRes = await DB_loginBroker(email, password);
  if (brokerRes.success) {
    showNotification(`Welcome back, Broker ${brokerRes.broker.name}!`, "success");
    setTimeout(() => { window.location.href = "broker-dashboard.html"; }, 1000);
    return;
  } else if (brokerRes.status === "pending" || brokerRes.status === "rejected") {
    showNotification(brokerRes.message, "error");
    return;
  }

  // 3. Try buyer / user login
  const userRes = await DB_loginUser(email, password);
  if (userRes.success) {
    showNotification(`Welcome back, ${userRes.user.name}!`, "success");
    closeModal("loginModal");
    event.target.reset();
    updateAuthUI();
    return;
  }

  showNotification("Invalid email or password. Please try again.", "error");
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
  setTimeout(() => { window.location.reload(); }, 500);
}

function logoutUser() {
  DB_clearUserSession();
  showNotification("Logged out successfully.", "info");
  updateAuthUI();
  setTimeout(() => { window.location.reload(); }, 500);
}

async function renderMovingImages() {
  const track = document.getElementById("movingImagesTrack");
  if (!track) return;

  const approvedListings = await DB_getApprovedListings();
  if (approvedListings.length === 0) {
    track.innerHTML = `<div style="padding: 2rem; color: #86868b; text-align: center; width: 100%;">No properties available</div>`;
    return;
  }

  // Duplicate list to support seamless scrolling animation
  const carouselList = [...approvedListings, ...approvedListings, ...approvedListings];

  track.innerHTML = carouselList.map(listing => {
    const firstImg = (listing.images && listing.images.length > 0) ? listing.images[0] : 'images/villa2.jpg';
    return `
      <div class="property-card">
        <img src="${firstImg}" alt="${listing.title}" class="property-image" onerror="this.src='images/villa2.jpg';">
        <div class="property-overlay">
          <div class="property-title">${listing.title}</div>
          <div class="property-price">${formatPrice(listing.price)} ETB</div>
          <button class="connect-btn">
            <a href="real-estate.html?id=${listing.id}">Connect</a>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function toggleMobileMenu() {
  const menu = document.getElementById("navMenu");
  if (menu) {
    menu.classList.toggle("active");
  }
}
