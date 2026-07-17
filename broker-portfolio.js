// Broker Portfolio JavaScript

// Sample broker data - in a real app, this would come from an API
const brokerData = {
  1: {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Real Estate Broker",
    avatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    experience: 8,
    activeListings: 45,
    successfulSales: 127,
    rating: 4.9,
    reviewCount: 89,
    phone: "+251-911-234567",
    email: "sarah.johnson@findbroker.com",
    location: "Bole, Addis Ababa",
    company: "Premium Properties Ethiopia",
    bio: "With over 8 years of experience in the Ethiopian real estate market, I specialize in luxury residential properties and commercial spaces in Addis Ababa. My commitment to excellence and personalized service has helped over 127 families find their dream homes and businesses secure prime locations.",
    specializations: ["Luxury Homes", "Commercial Properties", "Investment Properties", "First-Time Buyers"],
    listings: [
      {
        id: 1,
        title: "Luxury Villa in Bole",
        price: 2500000,
        location: "Bole, Addis Ababa",
        image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: 2,
        title: "Modern Apartment Complex",
        price: 850000,
        location: "Kazanchis, Addis Ababa",
        image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: 3,
        title: "Prime Commercial Space",
        price: 1200000,
        location: "Piazza, Addis Ababa",
        image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
    reviews: [
      {
        id: 1,
        author: "Michael Tadesse",
        rating: 5,
        date: "2024-01-15",
        text: "Sarah helped us find our dream home in Bole. Her professionalism and attention to detail made the entire process smooth and stress-free. Highly recommended!",
      },
      {
        id: 2,
        author: "Almaz Bekele",
        rating: 5,
        date: "2024-01-10",
        text: "Excellent service! Sarah's market knowledge and negotiation skills saved us thousands of birr. She truly cares about her clients' needs.",
      },
      {
        id: 3,
        author: "David Wilson",
        rating: 4,
        date: "2024-01-05",
        text: "Professional and responsive. Sarah made our property investment journey in Ethiopia seamless. Great communication throughout the process.",
      },
    ],
  },
  2: {
    id: 2,
    name: "Ahmed Hassan",
    title: "Automotive Sales Specialist",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    experience: 6,
    activeListings: 32,
    successfulSales: 89,
    rating: 4.7,
    reviewCount: 67,
    phone: "+251-911-345678",
    email: "ahmed.hassan@findbroker.com",
    location: "Merkato, Addis Ababa",
    company: "Elite Auto Sales",
    bio: "Specializing in premium and luxury vehicles, I have been helping clients find their perfect cars for over 6 years. From family sedans to luxury SUVs, I ensure every client gets the best value and quality.",
    specializations: ["Luxury Vehicles", "Family Cars", "Commercial Vehicles", "Import Services"],
    listings: [
      {
        id: 4,
        title: "2023 Toyota Land Cruiser",
        price: 1800000,
        location: "Merkato, Addis Ababa",
        image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: 5,
        title: "BMW X5 2022 Model",
        price: 2200000,
        location: "Bole, Addis Ababa",
        image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
    reviews: [
      {
        id: 4,
        author: "Yonas Tesfaye",
        rating: 5,
        date: "2024-01-12",
        text: "Ahmed found me the perfect family car within my budget. His knowledge of vehicles and honest advice made all the difference.",
      },
    ],
  },
}

// Initialize broker portfolio page
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search)
  const brokerId = urlParams.get("id") || "1"

  loadBrokerProfile(brokerId)
})

// Load broker profile data
function loadBrokerProfile(brokerId) {
  const broker = brokerData[brokerId]

  if (!broker) {
    console.error("Broker not found")
    return
  }

  // Update broker profile information
  document.getElementById("brokerAvatar").src = broker.avatar
  document.getElementById("brokerName").textContent = broker.name
  document.getElementById("brokerTitle").textContent = broker.title
  document.getElementById("brokerExperience").textContent = broker.experience
  document.getElementById("brokerListings").textContent = broker.activeListings
  document.getElementById("brokerSales").textContent = broker.successfulSales
  document.getElementById("brokerPhone").textContent = broker.phone
  document.getElementById("brokerEmail").textContent = broker.email
  document.getElementById("brokerLocation").textContent = broker.location
  document.getElementById("brokerCompany").textContent = broker.company
  document.getElementById("brokerBio").textContent = broker.bio
  document.getElementById("contactBrokerName").textContent = broker.name

  // Update rating
  updateRating(broker.rating, broker.reviewCount)

  // Update specializations
  updateSpecializations(broker.specializations)

  // Load broker listings
  loadBrokerListings(broker.listings)

  // Load broker reviews
  loadBrokerReviews(broker.reviews)
}

// Update rating display
function updateRating(rating, reviewCount) {
  const ratingContainer = document.getElementById("brokerRating")
  const stars = ratingContainer.querySelectorAll(".fas.fa-star")
  const ratingText = ratingContainer.querySelector(".rating-text")

  // Update stars
  stars.forEach((star, index) => {
    if (index < Math.floor(rating)) {
      star.style.color = "var(--warning-color)"
    } else if (index < rating) {
      star.style.color = "var(--warning-color)"
      star.style.opacity = "0.5"
    } else {
      star.style.color = "var(--text-tertiary)"
    }
  })

  // Update rating text
  ratingText.textContent = `${rating} (${reviewCount} reviews)`
}

// Update specializations
function updateSpecializations(specializations) {
  const container = document.getElementById("brokerSpecializations")
  container.innerHTML = specializations.map((spec) => `<span class="tag">${spec}</span>`).join("")
}

// Load broker listings
function loadBrokerListings(listings) {
  const container = document.getElementById("brokerListingsGrid")

  container.innerHTML = listings
    .map(
      (listing) => `
        <div class="broker-listing-card" onclick="viewProperty(${listing.id})">
            <img src="${listing.image}" alt="${listing.title}">
            <div class="broker-listing-info">
                <div class="broker-listing-price">${formatPrice(listing.price)} ETB</div>
                <div class="broker-listing-title">${listing.title}</div>
                <div class="broker-listing-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${listing.location}
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Load broker reviews
function loadBrokerReviews(reviews) {
  const container = document.getElementById("brokerReviews")

  container.innerHTML = reviews
    .map(
      (review) => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            <div class="review-rating">
                ${generateStars(review.rating)}
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `,
    )
    .join("")
}

// Generate star rating HTML
function generateStars(rating) {
  let stars = ""
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star"></i>'
    } else {
      stars += '<i class="far fa-star"></i>'
    }
  }
  return stars
}

// Format price with commas
function formatPrice(price) {
  return price.toLocaleString()
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Show contact modal
function showContactModal() {
  document.getElementById("contactModal").classList.add("active")
  document.body.style.overflow = "hidden"
}

// Show schedule modal
function scheduleMeeting() {
  document.getElementById("scheduleModal").classList.add("active")
  document.body.style.overflow = "hidden"

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("meetingDate").min = today
}

// Call broker function
function callBroker() {
  const urlParams = new URLSearchParams(window.location.search)
  const brokerId = urlParams.get("id") || "1"
  const broker = brokerData[brokerId]

  if (broker) {
    // In a real app, this would initiate a call
    showNotification(`Calling ${broker.name} at ${broker.phone}...`, "info")

    // Simulate call initiation
    setTimeout(() => {
      window.location.href = `tel:${broker.phone}`
    }, 1000)
  }
}

// Handle contact broker form submission
function handleContactBroker(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const contactData = {
    name: formData.get("contactName") || document.getElementById("contactName").value,
    email: formData.get("contactEmail") || document.getElementById("contactEmail").value,
    phone: formData.get("contactPhone") || document.getElementById("contactPhone").value,
    inquiryType: formData.get("inquiryType") || document.getElementById("inquiryType").value,
    message: formData.get("contactMessage") || document.getElementById("contactMessage").value,
  }

  // Simulate form submission
  const submitBtn = event.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitBtn.disabled = true

  setTimeout(() => {
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
    closeModal("contactModal")
    showNotification("Message sent successfully! The broker will contact you soon.", "success")
    event.target.reset()
  }, 2000)
}

// Handle schedule meeting form submission
function handleScheduleMeeting(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const meetingData = {
    date: formData.get("meetingDate") || document.getElementById("meetingDate").value,
    time: formData.get("meetingTime") || document.getElementById("meetingTime").value,
    type: formData.get("meetingType") || document.getElementById("meetingType").value,
    notes: formData.get("meetingNotes") || document.getElementById("meetingNotes").value,
  }

  // Simulate form submission
  const submitBtn = event.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...'
  submitBtn.disabled = true

  setTimeout(() => {
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
    closeModal("scheduleModal")
    showNotification("Meeting scheduled successfully! You will receive a confirmation email.", "success")
    event.target.reset()
  }, 2000)
}

// View property function
function viewProperty(propertyId) {
  // In a real app, this would navigate to property details
  showNotification("Redirecting to property details...", "info")

  // Simulate navigation
  setTimeout(() => {
    window.location.href = `property-details.html?id=${propertyId}`
  }, 1000)
}

// Play testimonial video function
function playTestimonial(testimonialId) {
  // In a real app, this would open a video modal or redirect to video
  showNotification(`Playing testimonial video ${testimonialId}...`, "info")
  
  // Simulate video modal (you could implement a proper video modal here)
  setTimeout(() => {
    const videoModal = document.createElement('div')
    videoModal.className = 'modal active'
    videoModal.innerHTML = `
      <div class="modal-content" style="max-width: 800px;">
        <div class="modal-header">
          <h3>Client Testimonial</h3>
          <button class="close-btn" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto'">&times;</button>
        </div>
        <div style="padding: 2rem; text-align: center;">
          <div style="background: var(--bg-secondary); padding: 3rem; border-radius: 12px; margin-bottom: 2rem;">
            <i class="fas fa-play-circle" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
            <p style="color: var(--text-secondary);">Video testimonial would play here</p>
            <p style="font-style: italic; margin-top: 1rem;">"Sarah's expertise and dedication made our property purchase experience exceptional. Highly recommended!"</p>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(videoModal)
    document.body.style.overflow = 'hidden'
  }, 500)
}

// Close modal function
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active")
  document.body.style.overflow = "auto"
}

// Show notification function
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
            <span>${message}</span>
        </div>
    `

  // Add notification styles if not already added
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style")
    styles.id = "notification-styles"
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                border-left: 4px solid var(--success-color);
            }
            .notification-error {
                border-left: 4px solid var(--danger-color);
            }
            .notification-info {
                border-left: 4px solid var(--primary-color);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-success i {
                color: var(--success-color);
            }
            .notification-error i {
                color: var(--danger-color);
            }
            .notification-info i {
                color: var(--primary-color);
            }
        `
    document.head.appendChild(styles)
  }

  // Add to page
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100)

  // Remove notification after 4 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => notification.remove(), 300)
  }, 4000)
}

// Mobile menu toggle (reuse from main script)
function toggleMobileMenu() {
  const navMenu = document.getElementById("navMenu")
  navMenu.classList.toggle("active")
}

// Close modals when clicking outside
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("active")
    document.body.style.overflow = "auto"
  }
})

// Close modals with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const activeModal = document.querySelector(".modal.active")
    if (activeModal) {
      activeModal.classList.remove("active")
      document.body.style.overflow = "auto"
    }
  }
})
