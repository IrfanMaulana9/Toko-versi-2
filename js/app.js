// Global variables
let cart = JSON.parse(localStorage.getItem("cart")) || []
const products = [
  {
    id: 1,
    name: "Smartphone XYZ Pro Max",
    price: 9600000,
    originalPrice: 12000000,
    image: "/images/phone1.jpg",
    rating: 5,
    reviews: 120,
    category: "elektronik",
    discount: 20,
    stock: 25,
    description: "Smartphone flagship dengan kamera 108MP dan layar AMOLED 6.7 inch",
    features: ["Kamera 108MP", "Layar AMOLED 120Hz", "Baterai 5000mAh", "Snapdragon 8 Gen 2"],
  },
  {
    id: 2,
    name: "Laptop ABC Ultra Slim",
    price: 15500000,
    originalPrice: null,
    image: "/images/laptop1.jpg",
    rating: 4,
    reviews: 85,
    category: "elektronik",
    discount: 0,
    stock: 15,
    description: "Laptop ringan dengan performa tinggi untuk profesional",
    features: ["Intel i7", "16GB RAM", "512GB SSD", "14 inch Display"],
  },
  {
    id: 3,
    name: "Headphone DEF Noise Cancelling",
    price: 2800000,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 210,
    category: "elektronik",
    discount: 0,
    stock: 30,
    description: "Headphone premium dengan teknologi noise cancelling",
    features: ["Active Noise Cancelling", "30h Battery", "Hi-Res Audio", "Comfortable Design"],
  },
  {
    id: 4,
    name: "Smartwatch GHI Series 5",
    price: 2975000,
    originalPrice: 3500000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 95,
    category: "elektronik",
    discount: 15,
    stock: 20,
    description: "Smartwatch dengan monitoring kesehatan lengkap",
    features: ["Heart Rate Monitor", "GPS", "Water Resistant", "7 Days Battery"],
  },
  {
    id: 5,
    name: "Kaos Hitam Premium",
    price: 150000,
    originalPrice: 180000,
    image: "images/baju2.jpg",
    rating: 4,
    reviews: 150,
    category: "fashion",
    discount: 15,
    stock: 150,
    description: "Kaos polo berkualitas tinggi dengan bahan cotton premium",
    features: ["100% Cotton", "Anti-Shrink", "Breathable", "Various Colors"],
  },
  {
    id: 6,
    name: "Sepatu Running XYZ",
    price: 1200000,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 89,
    category: "olahraga",
    discount: 0,
    stock: 25,
    description: "Sepatu running dengan teknologi cushioning terdepan",
    features: ["Air Cushion", "Breathable Mesh", "Lightweight", "Anti-Slip Sole"],
  },
  {
    id: 7,
    name: "Vitamin C 1000mg",
    price: 150000,
    originalPrice: 200000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 320,
    category: "kesehatan",
    discount: 25,
    stock: 100,
    description: "Suplemen vitamin C untuk menjaga daya tahan tubuh",
    features: ["1000mg per tablet", "60 tablets", "Non-GMO", "Lab Tested"],
  },
  {
    id: 8,
    name: "Rice Cooker Premium 2L",
    price: 899000,
    originalPrice: 1200000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 67,
    category: "rumah",
    discount: 25,
    stock: 35,
    description: "Rice cooker dengan teknologi fuzzy logic untuk hasil nasi sempurna",
    features: ["Fuzzy Logic", "Non-Stick Inner Pot", "Keep Warm Function", "Easy Clean"],
  },
  {
    id: 9,
    name: "Package Shirt",
    price: 80000,
    originalPrice: 110000,
    image: "images/baju1.jpg",
    rating: 4,
    reviews: 80,
    category: "fashion",
    discount: 25,
    stock: 35,
    description: "Kaos yang berbahan premium menggunakan cotton",
    features: ["100% Cotton", "Anti-Shrink", "Breathable", "Various Colors"],
  },
  {
    id: 10,
    name: "Stripe Shirt",
    price: 120000,
    originalPrice: 140000,
    image: "images/baju3.jpg",
    rating: 3,
    reviews: 45,
    category: "fashion",
    discount: 10,
    stock: 24,
    description: "Kaos garis-garis yang berbahan premium menggunakan cotton",
    features: ["100% Cotton", "Anti-Shrink", "Breathable", "Various Colors"],
  },
]


// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...")

  // Clear any existing cart data to ensure fresh start
  // Uncomment the line below if you want to completely reset cart on every page load
  // localStorage.removeItem("cart")
  // cart = []

  updateCartCount()
  loadFeaturedProducts()
  setupEventListeners()
  setupSearch()
  setupMobileMenu()

  // Check if we're on cart page
  if (window.location.pathname.includes("cart.html")) {
    console.log("Setting up cart page...")
    setupCartPage()
  }

  // Check if we're on checkout page
  if (window.location.pathname.includes("checkout.html")) {
    console.log("Setting up checkout page...")
    setupCheckoutPage()
  }

  // Check if we're on products page
  if (window.location.pathname.includes("products.html")) {
    setupProductsPage()
  }

  // Check if we're on product detail page
  if (window.location.pathname.includes("product-detail.html")) {
    setupProductDetailPage()
  }

  // Check if we're on profile page
  if (window.location.pathname.includes("profile.html")) {
    setupProfilePage()
  }
})

// Setup Cart Page
function setupCartPage() {
  console.log("Setting up cart page with cart:", cart)

  // Setup cart event listeners
  document.addEventListener("click", handleCartClick)

  // Load and display cart items
  renderCartItems()
  updateCartSummary()
}

// Render cart items dynamically
function renderCartItems() {
  const cartItemsList = document.getElementById("cartItemsList")
  const cartItemsContainer = document.getElementById("cartItemsContainer")
  const emptyCartMessage = document.getElementById("emptyCartMessage")
  const cartItemsTitle = document.getElementById("cartItemsTitle")
  const checkoutButton = document.getElementById("checkoutButton")

  if (cart.length === 0) {
    // Show empty cart message
    cartItemsContainer.style.display = "none"
    emptyCartMessage.style.display = "block"
    checkoutButton.disabled = true
    return
  }

  // Hide empty message and show cart items
  cartItemsContainer.style.display = "block"
  emptyCartMessage.style.display = "none"
  checkoutButton.disabled = false

  // Update cart title
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  cartItemsTitle.textContent = `Item di Keranjang (${totalItems})`

  // Render cart items
  cartItemsList.innerHTML = cart
    .map(
      (item) => `
        <div class="flex items-center py-6 border-b border-gray-200 cart-item" data-product-id="${item.id}">
            <div class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div class="ml-4 flex-1">
                <h3 class="font-medium text-gray-800">${item.name}</h3>
                <p class="text-sm text-gray-500">Produk berkualitas premium</p>
                <div class="flex items-center mt-2">
                    <span class="text-lg font-bold text-blue-600 item-price" data-price="${item.price}">Rp ${formatPrice(item.price)}</span>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <div class="flex items-center border border-gray-300 rounded-lg">
                    <button class="decrease-qty p-2 hover:bg-gray-100 rounded-l-lg transition-colors" data-product-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>
                    <span class="px-4 py-2 border-x border-gray-300 quantity-display" data-product-id="${item.id}">${item.quantity}</span>
                    <button class="increase-qty p-2 hover:bg-gray-100 rounded-r-lg transition-colors" data-product-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
                <button class="remove-item text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors" data-product-id="${item.id}" title="Hapus item">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    `,
    )
    .join("")

  // Setup checkout button
  checkoutButton.onclick = () => {
    window.location.href = "checkout.html"
  }
}

// Update cart summary
function updateCartSummary() {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = Math.floor(subtotal * 0.1) // 10% discount
  const shipping = subtotal > 500000 ? 0 : 25000 // Free shipping over 500k
  const total = subtotal - discount + shipping

  document.getElementById("subtotalAmount").textContent = `Rp ${formatPrice(subtotal)}`
  document.getElementById("discountAmount").textContent = `-Rp ${formatPrice(discount)}`
  document.getElementById("shippingAmount").textContent = shipping === 0 ? "GRATIS" : `Rp ${formatPrice(shipping)}`
  document.getElementById("totalAmount").textContent = `Rp ${formatPrice(total)}`
}

// Setup Checkout Page
function setupCheckoutPage() {
  console.log("Setting up checkout page with cart:", cart)

  if (cart.length === 0) {
    showEmptyCheckout()
    return
  }

  loadCheckoutItems()
  calculateCheckoutSummary()
}

// Show empty checkout
function showEmptyCheckout() {
  const checkoutContent = document.getElementById("checkoutContent")
  const emptyMessage = document.getElementById("emptyCheckoutMessage")

  if (checkoutContent) {
    checkoutContent.style.display = "none"
  }
  if (emptyMessage) {
    emptyMessage.classList.remove("hidden")
  }
}

// Load checkout items
function loadCheckoutItems() {
  const checkoutItemsContainer = document.getElementById("checkoutItems")
  if (!checkoutItemsContainer) return

  checkoutItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="flex items-center">
            <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div class="ml-3 flex-1">
                <h3 class="font-medium text-sm">${item.name}</h3>
                <p class="text-xs text-gray-500">Qty: ${item.quantity}</p>
                <p class="font-bold text-blue-600">Rp ${formatPrice(item.price * item.quantity)}</p>
            </div>
        </div>
    `,
    )
    .join("")
}

// Calculate checkout summary
function calculateCheckoutSummary() {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = Math.floor(subtotal * 0.1) // 10% discount
  const shipping = subtotal > 500000 ? 0 : 25000 // Free shipping over 500k
  const tax = Math.floor((subtotal - discount) * 0.1) // 10% tax
  const total = subtotal - discount + shipping + tax

  // Update summary elements
  document.getElementById("checkoutSubtotal").textContent = `Rp ${formatPrice(subtotal)}`
  document.getElementById("checkoutDiscount").textContent = `-Rp ${formatPrice(discount)}`
  document.getElementById("checkoutShipping").textContent = shipping === 0 ? "GRATIS" : `Rp ${formatPrice(shipping)}`
  document.getElementById("checkoutTax").textContent = `Rp ${formatPrice(tax)}`
  document.getElementById("checkoutTotal").textContent = `Rp ${formatPrice(total)}`
}

// Setup Event Listeners
function setupEventListeners() {
  // Add to cart buttons
  document.addEventListener("click", (e) => {
    if (e.target.closest(".add-to-cart")) {
      e.preventDefault()
      const productId = Number.parseInt(e.target.closest(".add-to-cart").dataset.id)
      addToCart(productId)
    }
  })

  // Newsletter subscription
  const newsletterForm = document.querySelector('input[type="email"]')
  if (newsletterForm) {
    const submitBtn = newsletterForm.nextElementSibling
    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault()
        const email = newsletterForm.value
        if (validateEmail(email)) {
          alert("Terima kasih! Anda telah berlangganan newsletter kami.")
          newsletterForm.value = ""
        } else {
          alert("Mohon masukkan email yang valid.")
        }
      })
    }
  }
}

// Handle all cart clicks
function handleCartClick(e) {
  const target = e.target.closest("button")
  if (!target) return

  const productId = Number.parseInt(target.dataset.productId)

  if (target.classList.contains("increase-qty")) {
    console.log("Increase quantity for product:", productId)
    changeQuantity(productId, 1)
  } else if (target.classList.contains("decrease-qty")) {
    console.log("Decrease quantity for product:", productId)
    changeQuantity(productId, -1)
  } else if (target.classList.contains("remove-item")) {
    console.log("Remove item:", productId)
    removeItem(productId)
  } else if (target.classList.contains("clear-cart")) {
    console.log("Clear cart")
    clearCart()
  }
}

// Change quantity function
function changeQuantity(productId, change) {
  console.log(`Changing quantity for product ${productId} by ${change}`)

  const cartItem = cart.find((item) => item.id === productId)
  if (!cartItem) {
    console.log("Cart item not found")
    return
  }

  const newQuantity = cartItem.quantity + change

  if (newQuantity <= 0) {
    removeItem(productId)
    return
  }

  if (newQuantity > 99) {
    showNotification("Maksimal 99 item per produk")
    return
  }

  cartItem.quantity = newQuantity
  localStorage.setItem("cart", JSON.stringify(cart))

  // Re-render cart items and update summary
  renderCartItems()
  updateCartSummary()
  updateCartCount()

  showNotification(`Jumlah ${cartItem.name} diperbarui`)
}

// Remove item function
function removeItem(productId) {
  const cartItem = cart.find((item) => item.id === productId)
  if (!cartItem) return

  if (confirm(`Hapus ${cartItem.name} dari keranjang?`)) {
    // Remove from cart array
    cart = cart.filter((item) => item.id !== productId)
    localStorage.setItem("cart", JSON.stringify(cart))

    // Re-render cart items and update summary
    renderCartItems()
    updateCartSummary()
    updateCartCount()

    showNotification(`${cartItem.name} dihapus dari keranjang`)
  }
}

// Clear cart function
function clearCart() {
  if (cart.length === 0) {
    showNotification("Keranjang sudah kosong")
    return
  }

  if (confirm("Hapus semua item dari keranjang?")) {
    cart = []
    localStorage.setItem("cart", JSON.stringify(cart))

    renderCartItems()
    updateCartSummary()
    updateCartCount()
    showNotification("Semua item dihapus dari keranjang")
  }
}

// Setup Search Functionality
function setupSearch() {
  const searchInputs = document.querySelectorAll('#searchInput, input[placeholder="Cari produk..."]')

  searchInputs.forEach((input) => {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault()
        const query = this.value.trim()
        if (query) {
          window.location.href = `products.html?search=${encodeURIComponent(query)}`
        }
      }
    })
  })
}

// Setup Mobile Menu
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileMenu = document.getElementById("mobileMenu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }
}

// Load Featured Products
function loadFeaturedProducts() {
  const featuredContainer = document.getElementById("featuredProducts")
  if (!featuredContainer) return

  const featuredProducts = products.slice(0, 4)

  featuredContainer.innerHTML = featuredProducts
    .map(
      (product) => `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
            <a href="product-detail.html?id=${product.id}" class="block">
                <div class="relative pb-[100%]">
                    <img src="${product.image}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform">
                    ${product.discount > 0 ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-${product.discount}%</span>` : ""}
                </div>
                <div class="p-4">
                    <h3 class="font-medium text-gray-800 mb-1 line-clamp-2">${product.name}</h3>
                    <div class="flex items-center mb-1">
                        <div class="flex text-yellow-400">
                            ${generateStars(product.rating)}
                        </div>
                        <span class="text-xs text-gray-500 ml-1">(${product.reviews})</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            ${product.originalPrice ? `<span class="text-gray-400 line-through text-sm">Rp ${formatPrice(product.originalPrice)}</span>` : ""}
                            <div class="font-bold text-blue-600">Rp ${formatPrice(product.price)}</div>
                        </div>
                        <button class="add-to-cart bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `,
    )
    .join("")
}

// Setup Products Page
function setupProductsPage() {
  const productGrid = document.getElementById("productGrid")
  const applyFilterBtn = document.getElementById("applyFilter")

  if (!productGrid) return

  // Load products
  loadProducts()

  // Setup filters
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", applyFilters)
  }

  // Setup sorting
  const sortSelect = document.querySelector("select")
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      loadProducts(this.value)
    })
  }

  // Check for URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get("category")
  const search = urlParams.get("search")

  if (category) {
    // Set category filter
    const categoryCheckbox = document.querySelector(`input[value="${category}"]`)
    if (categoryCheckbox) {
      categoryCheckbox.checked = true
      applyFilters()
    }
  }

  if (search) {
    // Set search term
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.value = search
      applyFilters()
    }
  }
}

// Load Products
function loadProducts(sortBy = "newest") {
  const productGrid = document.getElementById("productGrid")
  if (!productGrid) return

  const filteredProducts = [...products]

  // Apply sorting
  switch (sortBy) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating)
      break
    case "popular":
      filteredProducts.sort((a, b) => b.reviews - a.reviews)
      break
    default:
      // newest - keep original order
      break
  }

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden product-card group hover:shadow-lg transition-shadow">
            <a href="product-detail.html?id=${product.id}" class="block">
                <div class="relative pb-[100%]">
                    <img src="${product.image}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform">
                    ${product.discount > 0 ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-${product.discount}%</span>` : ""}
                </div>
                <div class="p-4">
                    <h3 class="font-medium text-gray-800 mb-1 line-clamp-2">${product.name}</h3>
                    <div class="flex items-center mb-1">
                        <div class="flex text-yellow-400">
                            ${generateStars(product.rating)}
                        </div>
                        <span class="text-xs text-gray-500 ml-1">(${product.reviews})</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            ${product.originalPrice ? `<span class="text-gray-400 line-through text-sm">Rp ${formatPrice(product.originalPrice)}</span>` : ""}
                            <div class="font-bold text-blue-600">Rp ${formatPrice(product.price)}</div>
                        </div>
                        <button class="add-to-cart bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `,
    )
    .join("")
}

// Apply Filters
function applyFilters() {
  const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map((cb) => cb.value)
    .filter((value) => ["elektronik", "fashion", "kesehatan", "rumah", "olahraga"].includes(value))

  const minPrice = document.querySelector('input[placeholder="Min"]')?.value || ""
  const maxPrice = document.querySelector('input[placeholder="Max"]')?.value || ""
  const searchQuery = document.getElementById("searchInput")?.value.toLowerCase() || ""

  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false
    }

    // Price filter
    if (minPrice && product.price < Number.parseInt(minPrice)) {
      return false
    }
    if (maxPrice && product.price > Number.parseInt(maxPrice)) {
      return false
    }

    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery)) {
      return false
    }

    return true
  })

  const productGrid = document.getElementById("productGrid")
  if (productGrid) {
    productGrid.innerHTML = filteredProducts
      .map(
        (product) => `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden product-card group hover:shadow-lg transition-shadow">
                <a href="product-detail.html?id=${product.id}" class="block">
                    <div class="relative pb-[100%]">
                        <img src="${product.image}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform">
                        ${product.discount > 0 ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-${product.discount}%</span>` : ""}
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-gray-800 mb-1 line-clamp-2">${product.name}</h3>
                        <div class="flex items-center mb-1">
                            <div class="flex text-yellow-400">
                                ${generateStars(product.rating)}
                            </div>
                            <span class="text-xs text-gray-500 ml-1">(${product.reviews})</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                ${product.originalPrice ? `<span class="text-gray-400 line-through text-sm">Rp ${formatPrice(product.originalPrice)}</span>` : ""}
                                <div class="font-bold text-blue-600">Rp ${formatPrice(product.price)}</div>
                            </div>
                            <button class="add-to-cart bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors" data-id="${product.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </a>
            </div>
        `,
      )
      .join("")

    // Update product count
    const productCount = document.querySelector("h1")
    if (productCount && productCount.textContent.includes("Katalog Produk")) {
      productCount.textContent = `Katalog Produk (${filteredProducts.length} produk)`
    }
  }
}

// Setup Product Detail Page
function setupProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  if (productId) {
    loadProductDetail(productId);
  } else {
    window.location.href = "products.html";
  }
}

function loadProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    console.error("Product not found with ID:", productId);
    window.location.href = "products.html";
    return;
  }

  // Update page metadata
  document.title = `${product.name} - Toko Serba Ada`;

  // Update breadcrumb
  updateBreadcrumb(product);

  // Update product images
  updateProductImages(product);

  // Update product info
  updateProductInfo(product);

  // Update tabs content
  updateProductTabs(product);

  // Setup add to cart button
  setupAddToCartButton(product);
}

function updateBreadcrumb(product) {
  const breadcrumb = document.querySelector(".breadcrumb span:last-child");
  if (breadcrumb) {
    breadcrumb.textContent = product.name;
  }
}

function updateProductImages(product) {
  // Main image
  const mainImage = document.getElementById("mainImage");
  if (mainImage) {
    mainImage.src = product.image;
    mainImage.alt = product.name;
  }

  // Thumbnails
  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach(thumb => {
    thumb.src = product.image;
    thumb.alt = product.name;
  });

  // Discount badge
  const discountBadge = document.querySelector(".discount-badge");
  if (discountBadge) {
    if (product.discount > 0) {
      discountBadge.textContent = `-${product.discount}%`;
      discountBadge.style.display = "block";
    } else {
      discountBadge.style.display = "none";
    }
  }
}

function updateProductInfo(product) {
  // Product name
  const productName = document.querySelector(".product-name");
  if (productName) productName.textContent = product.name;

  // Rating
  const ratingContainer = document.querySelector(".product-rating");
  if (ratingContainer) {
    ratingContainer.innerHTML = generateStars(product.rating);
    const reviewsCount = ratingContainer.querySelector(".reviews-count");
    if (reviewsCount) reviewsCount.textContent = `(${product.reviews})`;
  }

  // Price
  const currentPrice = document.querySelector(".current-price");
  const originalPrice = document.querySelector(".original-price");
  
  if (currentPrice) {
    currentPrice.textContent = `Rp ${formatPrice(product.price)}`;
  }
  
  if (originalPrice) {
    if (product.originalPrice) {
      originalPrice.textContent = `Rp ${formatPrice(product.originalPrice)}`;
      originalPrice.style.display = "block";
    } else {
      originalPrice.style.display = "none";
    }
  }

  // Stock
  const stockElement = document.querySelector(".stock-status");
  if (stockElement) {
    stockElement.textContent = product.stock > 0 ? "✓ Stok tersedia" : "Stok habis";
    stockElement.className = product.stock > 0 ? "stock-status text-green-600" : "stock-status text-red-600";
  }

  // Features
  const featuresContainer = document.querySelector(".product-features");
  if (featuresContainer && product.features) {
    featuresContainer.innerHTML = product.features.map(feature => 
      `<li class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        ${feature}
      </li>`
    ).join("");
  }
}

function updateProductTabs(product) {
  // Description tab
  const descriptionTab = document.getElementById("description-tab");
  if (descriptionTab) {
    const descriptionContent = descriptionTab.querySelector(".description-content");
    if (descriptionContent) {
      descriptionContent.innerHTML = `
        <p class="mb-4">${product.description}</p>
        <h4 class="font-semibold mb-2">Fitur Utama:</h4>
        <ul class="list-disc pl-5 space-y-1">
          ${product.features.map(feat => `<li>${feat}</li>`).join("")}
        </ul>
      `;
    }
  }

  // Specifications tab
  const specsTab = document.getElementById("specifications-tab");
  if (specsTab) {
    // Update specs based on product category
    let specsHTML = "";
    
    if (product.category === "elektronik") {
      specsHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-3">Umum</h4>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-gray-600">Merek</dt>
                <dd class="font-medium">${product.name.split(" ")[0]}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Model</dt>
                <dd class="font-medium">${product.name.split(" ").slice(1).join(" ")}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 class="font-semibold mb-3">Spesifikasi</h4>
            <dl class="space-y-2">
              ${product.features.map(feat => `
                <div class="flex justify-between">
                  <dt class="text-gray-600">${feat.split(":")[0] || feat}</dt>
                  <dd class="font-medium">${feat.split(":")[1] || "-"}</dd>
                </div>
              `).join("")}
            </dl>
          </div>
        </div>
      `;
    }
    
    specsTab.innerHTML = specsHTML;
  }
}

function setupAddToCartButton(product) {
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const quantity = parseInt(document.getElementById("quantity").textContent) || 1;
      addToCart(product.id, quantity);
      
      // Show success notification
      showNotification(`${product.name} ditambahkan ke keranjang!`);
    });
  }
}

// Setup Profile Page
function setupProfilePage() {
  // Setup tab navigation
  const tabButtons = document.querySelectorAll("[data-tab]")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const targetTab = this.dataset.tab

      // Remove active classes
      tabButtons.forEach((btn) => {
        btn.classList.remove("bg-blue-50", "text-blue-600")
        btn.classList.add("text-gray-600", "hover:bg-gray-50")
      })

      // Add active class to clicked button
      this.classList.remove("text-gray-600", "hover:bg-gray-50")
      this.classList.add("bg-blue-50", "text-blue-600")

      // Hide all tab contents
      tabContents.forEach((content) => {
        content.classList.add("hidden")
      })

      // Show target tab content
      const targetContent = document.getElementById(`${targetTab}-tab`)
      if (targetContent) {
        targetContent.classList.remove("hidden")
      }
    })
  })
}

// Cart Functions
function addToCart(productId, quantity = 1) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()

  // Show notification
  showNotification(`${product.name} ditambahkan ke keranjang!`)
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll("#cartCount")
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  cartCountElements.forEach((element) => {
    element.textContent = totalItems
  })
}

// Utility Functions
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price)
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars

  let starsHTML = ""

  for (let i = 0; i < fullStars; i++) {
    starsHTML += `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>`
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>`
  }

  return starsHTML
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300"
  notification.textContent = message

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-x-full")
  }, 100)

  // Animate out and remove
  setTimeout(() => {
    notification.classList.add("translate-x-full")
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Smooth scroll for anchor links
document.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.getAttribute("href") && e.target.getAttribute("href").startsWith("#")) {
    e.preventDefault()
    const targetId = e.target.getAttribute("href").substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
})

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  const mobileMenu = document.getElementById("mobileMenu")
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")

  if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    mobileMenu.classList.add("hidden")
  }
})

// Lazy loading for images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src || img.src
        img.classList.remove("lazy")
        observer.unobserve(img)
      }
    })
  })

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img)
  })
}

// Function to clear cart completely (for testing purposes)
function clearCartCompletely() {
  cart = []
  localStorage.removeItem("cart")
  updateCartCount()
  if (window.location.pathname.includes("cart.html")) {
    renderCartItems()
    updateCartSummary()
  }
  showNotification("Cart telah dibersihkan sepenuhnya")
}

// Add this to console for testing: clearCartCompletely()
