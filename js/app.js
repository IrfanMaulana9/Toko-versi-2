// Global variables
let cart = JSON.parse(localStorage.getItem("cart")) || []

// Get products from productManager (defined in data.js)
let products = []

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...")

  // Initialize products from productManager
  if (window.productManager) {
    products = window.productManager.getAllProducts()
  }

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

  // Check if we're on owner dashboard
  if (window.location.pathname.includes("dashboard-owner.html")) {
    setupOwnerDashboard()
  }
})

// Setup Owner Dashboard
function setupOwnerDashboard() {
  console.log("Setting up owner dashboard...")

  // Check if user is logged in as owner
  const userSession = localStorage.getItem("userSession")
  if (!userSession) {
    window.location.href = "login.html"
    return
  }

  const userData = JSON.parse(userSession)
  if (userData.userType !== "owner") {
    window.location.href = "index.html"
    return
  }

  loadDashboardStats()
  loadProductsList()
  setupAddProductForm()
  setupProductActions()
}

// Load dashboard statistics
function loadDashboardStats() {
  const totalProducts = products.length
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const lowStockProducts = products.filter((p) => p.stock <= 10).length
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)

  // Update stats in dashboard
  document.getElementById("totalProducts").textContent = totalProducts
  document.getElementById("totalStock").textContent = totalStock
  document.getElementById("lowStockCount").textContent = lowStockProducts
  document.getElementById("totalValue").textContent = `Rp ${formatPrice(totalValue)}`
}

// Load products list for management
function loadProductsList() {
  const productsTableBody = document.getElementById("productsTableBody")
  if (!productsTableBody) return

  productsTableBody.innerHTML = products
    .map(
      (product) => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <img class="h-10 w-10 rounded-lg object-cover" src="${product.image}" alt="${product.name}">
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">${product.name}</div>
            <div class="text-sm text-gray-500">SKU: ${product.category.toUpperCase()}-${String(product.id).padStart(3, "0")}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          ${product.category}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        Rp ${formatPrice(product.price)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span class="${product.stock <= 10 ? "text-red-600 font-semibold" : "text-gray-900"}">${product.stock}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div class="flex items-center">
          <div class="flex text-yellow-400">
            ${generateStars(product.rating)}
          </div>
          <span class="ml-1 text-gray-500">(${product.reviews})</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onclick="editProduct(${product.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
        <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">Hapus</button>
      </td>
    </tr>
  `,
    )
    .join("")
}

// Setup add product form
function setupAddProductForm() {
  const addProductForm = document.getElementById("addProductForm")
  if (!addProductForm) return

  addProductForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const features = formData
      .get("features")
      .split("\n")
      .filter((f) => f.trim())

    // Parse specifications
    const specifications = {}
    const specLines = formData
      .get("specifications")
      .split("\n")
      .filter((s) => s.trim())
    specLines.forEach((line) => {
      const [key, value] = line.split(":").map((s) => s.trim())
      if (key && value) {
        specifications[key] = value
      }
    })

    const productData = {
      name: formData.get("name"),
      price: Number.parseInt(formData.get("price")),
      originalPrice: formData.get("originalPrice") ? Number.parseInt(formData.get("originalPrice")) : null,
      category: formData.get("category"),
      stock: Number.parseInt(formData.get("stock")),
      description: formData.get("description"),
      features: features,
      specifications: specifications,
      image: formData.get("image") || "/placeholder.svg?height=500&width=500",
      discount: 0,
    }

    // Calculate discount if original price exists
    if (productData.originalPrice && productData.originalPrice > productData.price) {
      productData.discount = Math.round(
        ((productData.originalPrice - productData.price) / productData.originalPrice) * 100,
      )
    }

    // Add product using productManager
    const newProduct = window.productManager.addProduct(productData)

    // Update local products array
    products = window.productManager.getAllProducts()

    // Refresh dashboard
    loadDashboardStats()
    loadProductsList()

    // Reset form
    e.target.reset()

    // Close modal
    document.getElementById("addProductModal").classList.add("hidden")

    showNotification(`Produk "${newProduct.name}" berhasil ditambahkan!`)
  })
}

// Setup product actions (edit, delete)
function setupProductActions() {
  // These functions will be called from the table buttons
  window.editProduct = (productId) => {
    const product = window.productManager.getProductById(productId)
    if (!product) return

    // Fill edit form with product data
    document.getElementById("editProductId").value = product.id
    document.getElementById("editName").value = product.name
    document.getElementById("editPrice").value = product.price
    document.getElementById("editOriginalPrice").value = product.originalPrice || ""
    document.getElementById("editCategory").value = product.category
    document.getElementById("editStock").value = product.stock
    document.getElementById("editDescription").value = product.description
    document.getElementById("editFeatures").value = product.features.join("\n")
    document.getElementById("editImage").value = product.image

    // Format specifications
    const specsText = Object.entries(product.specifications)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")
    document.getElementById("editSpecifications").value = specsText

    // Show edit modal
    document.getElementById("editProductModal").classList.remove("hidden")
  }

  window.deleteProduct = (productId) => {
    const product = window.productManager.getProductById(productId)
    if (!product) return

    if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
      window.productManager.deleteProduct(productId)
      products = window.productManager.getAllProducts()

      loadDashboardStats()
      loadProductsList()

      showNotification(`Produk "${product.name}" berhasil dihapus!`)
    }
  }

  // Setup edit product form
  const editProductForm = document.getElementById("editProductForm")
  if (editProductForm) {
    editProductForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(e.target)
      const productId = Number.parseInt(formData.get("productId"))
      const features = formData
        .get("features")
        .split("\n")
        .filter((f) => f.trim())

      // Parse specifications
      const specifications = {}
      const specLines = formData
        .get("specifications")
        .split("\n")
        .filter((s) => s.trim())
      specLines.forEach((line) => {
        const [key, value] = line.split(":").map((s) => s.trim())
        if (key && value) {
          specifications[key] = value
        }
      })

      const productData = {
        name: formData.get("name"),
        price: Number.parseInt(formData.get("price")),
        originalPrice: formData.get("originalPrice") ? Number.parseInt(formData.get("originalPrice")) : null,
        category: formData.get("category"),
        stock: Number.parseInt(formData.get("stock")),
        description: formData.get("description"),
        features: features,
        specifications: specifications,
        image: formData.get("image") || "/placeholder.svg?height=500&width=500",
        discount: 0,
      }

      // Calculate discount if original price exists
      if (productData.originalPrice && productData.originalPrice > productData.price) {
        productData.discount = Math.round(
          ((productData.originalPrice - productData.price) / productData.originalPrice) * 100,
        )
      }

      // Update product
      const updatedProduct = window.productManager.updateProduct(productId, productData)
      products = window.productManager.getAllProducts()

      // Refresh dashboard
      loadDashboardStats()
      loadProductsList()

      // Close modal
      document.getElementById("editProductModal").classList.add("hidden")

      showNotification(`Produk "${updatedProduct.name}" berhasil diperbarui!`)
    })
  }
}

// Setup Product Detail Page
let currentProduct

function setupProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search)
  const productId = Number.parseInt(urlParams.get("id"))

  console.log("Product ID from URL:", productId)

  if (productId) {
    loadProductDetail(productId)
  } else {
    console.error("No product ID found in URL")
    window.location.href = "products.html"
  }
}

function loadProductDetail(productId) {
  const product = products.find((p) => p.id === productId)

  if (!product) {
    console.error("Product not found with ID:", productId)
    window.location.href = "products.html"
    return
  }

  console.log("Loading product:", product)

  // Store current product globally
  currentProduct = product

  // Update page metadata
  document.title = `${product.name} - Toko Serba Ada`

  // Update breadcrumb
  updateBreadcrumb(product)

  // Update product images
  updateProductImages(product)

  // Update product info
  updateProductInfo(product)

  // Update tabs content
  updateProductTabs(product)

  // Setup add to cart button
  setupAddToCartButton(product)

  // Load related products
  loadRelatedProducts(product)
}

function updateBreadcrumb(product) {
  const breadcrumbElement = document.getElementById("breadcrumbProductName")
  if (breadcrumbElement) {
    breadcrumbElement.textContent = product.name
  }
}

function updateProductImages(product) {
  // Main image
  const mainImage = document.getElementById("mainImage")
  if (mainImage) {
    mainImage.src = product.image
    mainImage.alt = product.name
  }

  // Thumbnails - use same image for all thumbnails (in real app, you'd have multiple images)
  const thumbnails = document.querySelectorAll(".thumbnail")
  thumbnails.forEach((thumb) => {
    thumb.src = product.image
    thumb.alt = product.name
  })

  // Discount badge
  const discountBadge = document.getElementById("discountBadge")
  if (discountBadge) {
    if (product.discount > 0) {
      discountBadge.textContent = `-${product.discount}%`
      discountBadge.classList.remove("hidden")
    } else {
      discountBadge.classList.add("hidden")
    }
  }
}

function updateProductInfo(product) {
  // Product name
  const productName = document.getElementById("productName")
  if (productName) productName.textContent = product.name

  // Product SKU
  const productSku = document.getElementById("productSku")
  if (productSku)
    productSku.textContent = `SKU: ${product.category.toUpperCase()}-${String(product.id).padStart(3, "0")}`

  // Rating
  const ratingStars = document.getElementById("ratingStars")
  if (ratingStars) {
    ratingStars.innerHTML = generateStars(product.rating)
  }

  const reviewsCount = document.getElementById("reviewsCount")
  if (reviewsCount) {
    reviewsCount.textContent = `(${product.reviews} ulasan)`
  }

  // Price
  const currentPrice = document.getElementById("currentPrice")
  const originalPrice = document.getElementById("originalPrice")
  const discountPercentage = document.getElementById("discountPercentage")

  if (currentPrice) {
    currentPrice.textContent = `Rp ${formatPrice(product.price)}`
  }

  if (originalPrice) {
    if (product.originalPrice) {
      originalPrice.textContent = `Rp ${formatPrice(product.originalPrice)}`
      originalPrice.classList.remove("hidden")
    } else {
      originalPrice.classList.add("hidden")
    }
  }

  if (discountPercentage) {
    if (product.discount > 0) {
      discountPercentage.textContent = `Hemat ${product.discount}%`
      discountPercentage.classList.remove("hidden")
    } else {
      discountPercentage.classList.add("hidden")
    }
  }

  // Stock
  const stockStatus = document.getElementById("stockStatus")
  const stockInfo = document.getElementById("stockInfo")

  if (stockStatus) {
    if (product.stock > 0) {
      stockStatus.textContent = "✓ Stok tersedia"
      stockStatus.className = "text-green-600 font-medium"
    } else {
      stockStatus.textContent = "✗ Stok habis"
      stockStatus.className = "text-red-600 font-medium"
    }
  }

  if (stockInfo) {
    stockInfo.textContent = `Stok: ${product.stock} unit`
  }

  // Features
  const featuresContainer = document.getElementById("productFeatures")
  if (featuresContainer && product.features) {
    featuresContainer.innerHTML = product.features
      .map(
        (feature) =>
          `<li class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        ${feature}
      </li>`,
      )
      .join("")
  }

  // Show/hide product options based on category
  if (product.category === "elektronik") {
    const colorOptions = document.getElementById("colorOptions")
    const storageOptions = document.getElementById("storageOptions")
    if (colorOptions) colorOptions.classList.remove("hidden")
    if (storageOptions) storageOptions.classList.remove("hidden")
  }
}

function updateProductTabs(product) {
  // Description tab
  const descriptionContainer = document.getElementById("productDescription")
  if (descriptionContainer) {
    descriptionContainer.innerHTML = `
      <p class="mb-4">${product.description}</p>
      <h4 class="font-semibold mb-2">Fitur Utama:</h4>
      <ul class="list-disc pl-5 space-y-1">
        ${product.features.map((feat) => `<li>${feat}</li>`).join("")}
      </ul>
    `
  }

  // Specifications tab
  const specsContainer = document.getElementById("productSpecifications")
  if (specsContainer && product.specifications) {
    specsContainer.innerHTML = `
      <div>
        <h4 class="font-semibold mb-3">Spesifikasi Produk</h4>
        <dl class="space-y-2">
          ${Object.entries(product.specifications)
            .map(
              ([key, value]) => `
            <div class="flex justify-between py-2 border-b border-gray-100">
              <dt class="text-gray-600 font-medium">${key}</dt>
              <dd class="text-gray-900">${value}</dd>
            </div>
          `,
            )
            .join("")}
        </dl>
      </div>
    `
  }

  // Reviews tab
  const reviewsTabCount = document.getElementById("reviewsTabCount")
  const totalReviews = document.getElementById("totalReviews")
  const averageRating = document.getElementById("averageRating")
  const averageRatingStars = document.getElementById("averageRatingStars")

  if (reviewsTabCount) reviewsTabCount.textContent = product.reviews
  if (totalReviews) totalReviews.textContent = product.reviews
  if (averageRating) averageRating.textContent = product.rating.toFixed(1)
  if (averageRatingStars) averageRatingStars.innerHTML = generateStars(product.rating)

  // Generate sample reviews
  const reviewsList = document.getElementById("reviewsList")
  if (reviewsList) {
    const sampleReviews = generateSampleReviews(product)
    reviewsList.innerHTML = sampleReviews
  }

  // Rating breakdown
  const ratingBreakdown = document.getElementById("ratingBreakdown")
  if (ratingBreakdown) {
    ratingBreakdown.innerHTML = generateRatingBreakdown(product)
  }
}

function generateSampleReviews(product) {
  const reviews = [
    {
      name: "Ahmad Rizki",
      rating: 5,
      date: "2 hari yang lalu",
      comment: `${product.name} sangat berkualitas! Sesuai dengan deskripsi dan pengiriman cepat. Sangat puas dengan pembelian ini.`,
      helpful: 12,
    },
    {
      name: "Sari Dewi",
      rating: 4,
      date: "1 minggu yang lalu",
      comment: `Produk bagus dengan kualitas yang baik. Harga sebanding dengan kualitas yang didapat. Recommended!`,
      helpful: 8,
    },
    {
      name: "Budi Santoso",
      rating: 5,
      date: "2 minggu yang lalu",
      comment: `Pelayanan excellent dan produk sesuai ekspektasi. Packaging juga rapi dan aman. Terima kasih!`,
      helpful: 15,
    },
  ]

  return reviews
    .map(
      (review) => `
    <div class="border-b border-gray-200 pb-6">
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-blue-600 font-medium">${review.name.charAt(0)}</span>
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4 class="font-medium">${review.name}</h4>
              <div class="flex text-yellow-400">
                ${generateStars(review.rating)}
              </div>
            </div>
            <span class="text-sm text-gray-500">${review.date}</span>
          </div>
          <p class="text-gray-600 mb-2">${review.comment}</p>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <button class="hover:text-blue-600">👍 Membantu (${review.helpful})</button>
            <button class="hover:text-blue-600">Balas</button>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

function generateRatingBreakdown(product) {
  // Generate realistic rating distribution
  const total = product.reviews
  const breakdown = {
    5: Math.floor(total * 0.6),
    4: Math.floor(total * 0.25),
    3: Math.floor(total * 0.1),
    2: Math.floor(total * 0.03),
    1: Math.floor(total * 0.02),
  }

  return `
    <div class="space-y-2">
      ${[5, 4, 3, 2, 1]
        .map(
          (stars) => `
        <div class="flex items-center">
          <span class="text-sm w-8">${stars}★</span>
          <div class="flex-1 mx-3 bg-gray-200 rounded-full h-2">
            <div class="bg-yellow-400 h-2 rounded-full" style="width: ${(breakdown[stars] / total) * 100}%"></div>
          </div>
          <span class="text-sm text-gray-600">${breakdown[stars]}</span>
        </div>
      `,
        )
        .join("")}
    </div>
  `
}

function setupAddToCartButton(product) {
  const addToCartBtn = document.getElementById("addToCartBtn")
  const buyNowBtn = document.getElementById("buyNowBtn")

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(document.getElementById("quantity").textContent) || 1
      addToCart(product.id, quantity)
    })
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(document.getElementById("quantity").textContent) || 1
      addToCart(product.id, quantity)
      window.location.href = "cart.html"
    })
  }
}

function loadRelatedProducts(product) {
  const relatedContainer = document.getElementById("relatedProducts")
  if (!relatedContainer) return

  // Get products from same category, excluding current product
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  // If not enough products in same category, fill with other products
  if (relatedProducts.length < 4) {
    const otherProducts = products
      .filter((p) => p.id !== product.id && !relatedProducts.includes(p))
      .slice(0, 4 - relatedProducts.length)
    relatedProducts.push(...otherProducts)
  }

  relatedContainer.innerHTML = relatedProducts
    .map(
      (relatedProduct) => `
    <div class="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
      <a href="product-detail.html?id=${relatedProduct.id}" class="block">
        <div class="relative pb-[100%]">
          <img src="${relatedProduct.image}" alt="${relatedProduct.name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform">
          ${relatedProduct.discount > 0 ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-${relatedProduct.discount}%</span>` : ""}
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-800 mb-1 line-clamp-2">${relatedProduct.name}</h3>
          <div class="flex items-center mb-1">
            <div class="flex text-yellow-400 text-sm">
              ${generateStars(relatedProduct.rating)}
            </div>
            <span class="text-xs text-gray-500 ml-1">(${relatedProduct.reviews})</span>
          </div>
          <div class="font-bold text-blue-600">Rp ${formatPrice(relatedProduct.price)}</div>
        </div>
      </a>
    </div>
  `,
    )
    .join("")
}

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
