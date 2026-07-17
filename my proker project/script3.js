// Sample broker data
const brokers = [
  {
    id: 1,
    name: "Sarah Johnson",
    category: "real-estate",
    location: "addis-ababa",
    title: "Premium Real Estate Services",
    description: "Specializing in residential and commercial properties with over 10 years of experience.",
    phone: "+251-911-123456",
    email: "sarah@realestate.com",
    verified: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    category: "insurance",
    location: "dire-dawa",
    title: "Comprehensive Insurance Solutions",
    description: "Life, health, and property insurance with competitive rates and excellent service.",
    phone: "+251-911-234567",
    email: "michael@insurance.com",
    verified: true,
  },
  {
    id: 3,
    name: "Aisha Mohammed",
    category: "finance",
    location: "bahir-dar",
    title: "Financial Planning & Investment",
    description: "Expert financial advisor helping clients achieve their investment goals.",
    phone: "+251-911-345678",
    email: "aisha@finance.com",
    verified: true,
  },
  {
    id: 4,
    name: "David Wilson",
    category: "automotive",
    location: "hawassa",
    title: "Auto Sales & Services",
    description: "New and used car sales with full service and maintenance support.",
    phone: "+251-911-456789",
    email: "david@auto.com",
    verified: true,
  },
  {
    id: 5,
    name: "Fatima Ali",
    category: "technology",
    location: "mekelle",
    title: "IT Solutions & Consulting",
    description: "Complete IT services for businesses including software development and support.",
    phone: "+251-911-567890",
    email: "fatima@tech.com",
    verified: true,
  },
  {
    id: 6,
    name: "John Smith",
    category: "real-estate",
    location: "addis-ababa",
    title: "Luxury Property Specialist",
    description: "High-end residential properties and investment opportunities in prime locations.",
    phone: "+251-911-678901",
    email: "john@luxury.com",
    verified: true,
  },
]

let currentBroker = null

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeToggle(savedTheme)
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeToggle(newTheme)
}

function updateThemeToggle(theme) {
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙"
    themeToggle.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  }
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })
}

// Search and filter functions
function searchBrokers() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const categoryFilter = document.getElementById("categoryFilter").value
  const locationFilter = document.getElementById("locationFilter").value

  const filteredBrokers = brokers.filter((broker) => {
    const matchesSearch =
      broker.title.toLowerCase().includes(searchTerm) ||
      broker.description.toLowerCase().includes(searchTerm) ||
      broker.name.toLowerCase().includes(searchTerm)
    const matchesCategory = !categoryFilter || broker.category === categoryFilter
    const matchesLocation = !locationFilter || broker.location === locationFilter

    return matchesSearch && matchesCategory && matchesLocation
  })

  displayBrokers(filteredBrokers)
}

// Display brokers
function displayBrokers(brokersToShow = brokers) {
  const grid = document.getElementById("listingsGrid")
  grid.innerHTML = ""

  brokersToShow.forEach((broker) => {
    const card = document.createElement("div")
    card.className = "listing-card"
    card.innerHTML = `
            <div class="listing-image">
                ${broker.category.charAt(0).toUpperCase() + broker.category.slice(1)} Services
            </div>
            <div class="listing-content">
                <h3 class="listing-title">${broker.title}</h3>
                <div class="listing-broker">By ${broker.name}</div>
                <div class="listing-location">${formatLocation(broker.location)}</div>
                <p class="listing-description">${broker.description}</p>
                <div class="listing-footer">
                    <span class="verified-badge">✓ Verified</span>
                    <button class="btn btn-primary" onclick="contactBroker(${broker.id})">Contact</button>
                </div>
            </div>
        `
    grid.appendChild(card)
  })
}

// Format location for display
function formatLocation(location) {
  return location
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Contact broker
function contactBroker(brokerId) {
  currentBroker = brokers.find((broker) => broker.id === brokerId)
  openModal("contactModal")
}

// Form submissions
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme()

  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }

  // Initialize brokers display (only on index page)
  if (document.getElementById("listingsGrid")) {
    displayBrokers()
  }

  // Form event listeners
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("loginEmail").value
      const password = document.getElementById("loginPassword").value
      const userType = document.querySelector('input[name="userType"]:checked').value

      alert(`Login attempted for ${userType}: ${email}`)
      closeModal("loginModal")
    })
  }

  const registerForm = document.getElementById("registerForm")
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = document.getElementById("brokerName").value
      const email = document.getElementById("brokerEmail").value

      alert(`Registration submitted for: ${name} (${email}). You will receive verification instructions via email.`)
      closeModal("registerModal")
    })
  }

  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const customerName = document.getElementById("customerName").value
      const message = document.getElementById("inquiryMessage").value

      if (currentBroker) {
        alert(`Your inquiry has been sent to ${currentBroker.name}. They will contact you soon!`)
        closeModal("contactModal")
        // Reset form
        document.getElementById("contactForm").reset()
      }
    })
  }

  const contactPageForm = document.getElementById("contactPageForm")
  if (contactPageForm) {
    contactPageForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = document.getElementById("contactName").value
      const email = document.getElementById("contactEmail").value
      const subject = document.getElementById("contactSubject").value
      const message = document.getElementById("contactMessage").value

      alert(`Thank you ${name}! Your message has been sent successfully. We'll respond to ${email} within 24 hours.`)

      // Reset form
      contactPageForm.reset()
    })
  }

  // Add event listeners for real-time search (only on index page)
  const searchInput = document.getElementById("searchInput")
  const categoryFilter = document.getElementById("categoryFilter")
  const locationFilter = document.getElementById("locationFilter")

  if (searchInput) {
    searchInput.addEventListener("input", searchBrokers)
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", searchBrokers)
  }
  if (locationFilter) {
    locationFilter.addEventListener("change", searchBrokers)
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })
})
