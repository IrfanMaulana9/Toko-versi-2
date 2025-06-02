// Product Manager Class for handling all product data operations
class ProductManager {
    constructor() {
      this.storageKey = "tokoSerbaAda_products"
      this.products = this.loadProducts()
  
      // Initialize with default products if storage is empty
      if (this.products.length === 0) {
        this.initializeDefaultProducts()
      }
    }
  
    // Load products from localStorage
    loadProducts() {
      try {
        const stored = localStorage.getItem(this.storageKey)
        return stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error("Error loading products from localStorage:", error)
        return []
      }
    }
  
    // Save products to localStorage
    saveProducts() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.products))
      } catch (error) {
        console.error("Error saving products to localStorage:", error)
      }
    }
  
    // Initialize with default products
    initializeDefaultProducts() {
      const defaultProducts = [
        {
          id: 1,
          name: "iPhone 15 Pro Max",
          price: 18999000,
          originalPrice: 21999000,
          category: "elektronik",
          stock: 25,
          rating: 4.8,
          reviews: 156,
          discount: 14,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "iPhone 15 Pro Max dengan teknologi terdepan, kamera profesional, dan performa yang luar biasa. Dilengkapi dengan chip A17 Pro yang revolusioner dan sistem kamera yang canggih.",
          features: [
            "Chip A17 Pro dengan teknologi 3nm",
            "Sistem kamera Pro dengan lensa 5x Telephoto",
            "Layar Super Retina XDR 6.7 inci",
            "Baterai tahan hingga 29 jam video playback",
            "Tahan air IP68",
            "USB-C dengan dukungan USB 3",
          ],
          specifications: {
            Layar: "6.7 inci Super Retina XDR",
            Chip: "A17 Pro",
            Kamera: "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
            Storage: "256GB, 512GB, 1TB",
            Baterai: "4441 mAh",
            OS: "iOS 17",
            Warna: "Natural Titanium, Blue Titanium, White Titanium, Black Titanium",
          },
        },
        {
          id: 2,
          name: "Samsung Galaxy S24 Ultra",
          price: 16999000,
          originalPrice: 19999000,
          category: "elektronik",
          stock: 18,
          rating: 4.7,
          reviews: 203,
          discount: 15,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Samsung Galaxy S24 Ultra dengan S Pen yang disempurnakan, kamera 200MP yang menakjubkan, dan AI yang terintegrasi untuk produktivitas maksimal.",
          features: [
            "Kamera 200MP dengan AI Photography",
            "S Pen dengan latensi ultra-rendah",
            "Layar Dynamic AMOLED 2X 6.8 inci",
            "Snapdragon 8 Gen 3 for Galaxy",
            "Baterai 5000mAh dengan fast charging",
            "Samsung DeX untuk pengalaman desktop",
          ],
          specifications: {
            Layar: "6.8 inci Dynamic AMOLED 2X",
            Processor: "Snapdragon 8 Gen 3 for Galaxy",
            Kamera: "200MP Main, 50MP Periscope, 10MP Telephoto, 12MP Ultra Wide",
            RAM: "12GB",
            Storage: "256GB, 512GB, 1TB",
            Baterai: "5000 mAh",
            OS: "Android 14 dengan One UI 6.1",
          },
        },
        {
          id: 3,
          name: "MacBook Air M3",
          price: 17999000,
          originalPrice: null,
          category: "elektronik",
          stock: 12,
          rating: 4.9,
          reviews: 89,
          discount: 0,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "MacBook Air dengan chip M3 yang revolusioner memberikan performa luar biasa dalam desain yang tipis dan ringan. Sempurna untuk profesional dan kreatif.",
          features: [
            "Chip Apple M3 dengan 8-core CPU",
            "GPU hingga 10-core untuk grafis yang menakjubkan",
            "Layar Liquid Retina 13.6 inci",
            "Baterai hingga 18 jam",
            "Desain fanless yang senyap",
            "MagSafe charging dan 2 port Thunderbolt",
          ],
          specifications: {
            Processor: "Apple M3 chip",
            Layar: "13.6 inci Liquid Retina",
            Memory: "8GB, 16GB, 24GB unified memory",
            Storage: "256GB, 512GB, 1TB, 2TB SSD",
            Baterai: "Hingga 18 jam",
            Berat: "1.24 kg",
            Port: "2x Thunderbolt/USB 4, MagSafe 3, 3.5mm headphone",
          },
        },
        {
          id: 4,
          name: "Sony WH-1000XM5",
          price: 4999000,
          originalPrice: 5999000,
          category: "elektronik",
          stock: 35,
          rating: 4.6,
          reviews: 312,
          discount: 17,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Headphone wireless premium dengan noise canceling terdepan di industri. Nikmati audio berkualitas tinggi dengan kenyamanan maksimal.",
          features: [
            "Industry-leading noise canceling",
            "30 jam battery life",
            "Quick charge 3 menit untuk 3 jam playback",
            "Speak-to-chat technology",
            "Multipoint connection",
            "Hi-Res Audio dan LDAC",
          ],
          specifications: {
            Driver: "30mm dynamic driver",
            "Frequency Response": "4Hz-40kHz",
            Battery: "30 jam dengan NC on",
            Charging: "USB-C, quick charge",
            Weight: "250g",
            Connectivity: "Bluetooth 5.2, NFC",
            Codec: "SBC, AAC, LDAC",
          },
        },
        {
          id: 5,
          name: "Nike Air Jordan 1 Retro High",
          price: 2299000,
          originalPrice: null,
          category: "fashion",
          stock: 42,
          rating: 4.5,
          reviews: 178,
          discount: 0,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Sepatu basket ikonik yang telah menjadi legenda. Desain klasik yang timeless dengan kenyamanan modern untuk gaya hidup aktif.",
          features: [
            "Upper kulit premium",
            "Midsole foam untuk cushioning",
            "Rubber outsole dengan pola klasik",
            "Ankle support yang optimal",
            "Desain ikonik yang timeless",
            "Cocok untuk casual dan olahraga ringan",
          ],
          specifications: {
            Material: "Leather upper, rubber sole",
            Ukuran: "40-45",
            Warna: "Chicago, Bred, Royal Blue, Shadow",
            Style: "High-top basketball shoe",
            Origin: "Vietnam",
            Care: "Clean with damp cloth",
          },
        },
        {
          id: 6,
          name: "Adidas Ultraboost 22",
          price: 2799000,
          originalPrice: 3299000,
          category: "olahraga",
          stock: 28,
          rating: 4.4,
          reviews: 145,
          discount: 15,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Sepatu lari dengan teknologi BOOST yang memberikan energy return maksimal. Dirancang untuk pelari yang menginginkan performa terbaik.",
          features: [
            "BOOST midsole untuk energy return",
            "Primeknit upper yang breathable",
            "Continental rubber outsole",
            "Torsion System untuk stabilitas",
            "Sock-like fit yang nyaman",
            "Reflective details untuk visibility",
          ],
          specifications: {
            Technology: "BOOST, Primeknit, Continental",
            Drop: "10mm",
            Weight: "310g (size 9)",
            Ukuran: "39-46",
            Surface: "Road running",
            Support: "Neutral",
          },
        },
        {
          id: 7,
          name: "Vitamin C 1000mg",
          price: 149000,
          originalPrice: 199000,
          category: "kesehatan",
          stock: 150,
          rating: 4.3,
          reviews: 267,
          discount: 25,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Suplemen Vitamin C dosis tinggi untuk meningkatkan daya tahan tubuh dan kesehatan kulit. Formula yang mudah diserap tubuh.",
          features: [
            "1000mg Vitamin C per tablet",
            "Meningkatkan daya tahan tubuh",
            "Antioksidan untuk melawan radikal bebas",
            "Membantu pembentukan kolagen",
            "Non-acidic formula",
            "60 tablet per botol",
          ],
          specifications: {
            Kandungan: "Vitamin C (Ascorbic Acid) 1000mg",
            Bentuk: "Tablet",
            Jumlah: "60 tablet",
            Dosis: "1 tablet per hari",
            Kemasan: "Botol plastik",
            Expired: "2 tahun dari tanggal produksi",
          },
        },
        {
          id: 8,
          name: "Omega-3 Fish Oil",
          price: 299000,
          originalPrice: null,
          category: "kesehatan",
          stock: 85,
          rating: 4.6,
          reviews: 198,
          discount: 0,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Suplemen minyak ikan berkualitas tinggi dengan EPA dan DHA untuk kesehatan jantung dan otak. Diproduksi dari ikan laut dalam.",
          features: [
            "1000mg minyak ikan per softgel",
            "300mg EPA dan 200mg DHA",
            "Mendukung kesehatan jantung",
            "Meningkatkan fungsi otak",
            "Molecular distillation untuk kemurnian",
            "90 softgel per botol",
          ],
          specifications: {
            EPA: "300mg per softgel",
            DHA: "200mg per softgel",
            "Total Omega-3": "500mg per softgel",
            Bentuk: "Softgel",
            Jumlah: "90 softgel",
            Sumber: "Deep sea fish",
          },
        },
        {
          id: 9,
          name: "Rice Cooker Digital Miyako",
          price: 899000,
          originalPrice: 1199000,
          category: "rumah",
          stock: 22,
          rating: 4.2,
          reviews: 134,
          discount: 25,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Rice cooker digital dengan berbagai fungsi memasak. Dilengkapi dengan teknologi fuzzy logic untuk hasil nasi yang sempurna setiap saat.",
          features: [
            "Kapasitas 1.8 liter (10 cups)",
            "Fuzzy logic technology",
            "12 menu masak otomatis",
            "Keep warm hingga 24 jam",
            "Inner pot anti lengket",
            "Timer delay hingga 24 jam",
          ],
          specifications: {
            Kapasitas: "1.8 liter",
            Daya: "860 watt",
            Material: "Stainless steel + plastic",
            Dimensi: "28 x 35 x 25 cm",
            Berat: "4.2 kg",
            Garansi: "2 tahun",
          },
        },
        {
          id: 10,
          name: "Blender Philips HR2157",
          price: 1299000,
          originalPrice: null,
          category: "rumah",
          stock: 18,
          rating: 4.4,
          reviews: 89,
          discount: 0,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Blender powerful dengan teknologi ProBlend untuk hasil yang halus dan merata. Ideal untuk membuat smoothie, jus, dan berbagai minuman sehat.",
          features: [
            "Motor 700 watt yang powerful",
            "Teknologi ProBlend 6 pisau",
            "Jar kaca 1.5 liter",
            "2 kecepatan + pulse",
            "Safety lock system",
            "Mudah dibersihkan",
          ],
          specifications: {
            Daya: "700 watt",
            Kapasitas: "1.5 liter",
            "Material Jar": "Kaca tahan panas",
            Kecepatan: "2 speed + pulse",
            Dimensi: "20 x 20 x 42 cm",
            Garansi: "2 tahun resmi",
          },
        },
        {
          id: 11,
          name: "Kemeja Formal Pria",
          price: 299000,
          originalPrice: 399000,
          category: "fashion",
          stock: 45,
          rating: 4.1,
          reviews: 156,
          discount: 25,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Kemeja formal berkualitas premium dengan bahan katun yang nyaman dan breathable. Cocok untuk acara formal dan kasual.",
          features: [
            "100% katun premium",
            "Regular fit yang nyaman",
            "Wrinkle resistant",
            "Breathable dan soft touch",
            "Kancing berkualitas tinggi",
            "Tersedia berbagai ukuran",
          ],
          specifications: {
            Material: "100% Cotton",
            Fit: "Regular fit",
            Ukuran: "S, M, L, XL, XXL",
            Warna: "Putih, Biru, Abu-abu",
            Care: "Machine wash 30°C",
            Origin: "Indonesia",
          },
        },
        {
          id: 12,
          name: "Dress Wanita Elegant",
          price: 459000,
          originalPrice: null,
          category: "fashion",
          stock: 32,
          rating: 4.5,
          reviews: 203,
          discount: 0,
          image: "/placeholder.svg?height=500&width=500",
          description:
            "Dress elegant dengan desain modern yang cocok untuk berbagai acara. Bahan berkualitas tinggi dengan cutting yang flattering.",
          features: [
            "Bahan polyester premium",
            "A-line silhouette",
            "Midi length yang elegant",
            "Zipper belakang tersembunyi",
            "Lining untuk kenyamanan",
            "Desain timeless",
          ],
          specifications: {
            Material: "Polyester blend",
            Length: "Midi (knee length)",
            Ukuran: "S, M, L, XL",
            Warna: "Navy, Black, Maroon",
            Care: "Dry clean recommended",
            Fit: "A-line, regular fit",
          },
        },
      ]
  
      this.products = defaultProducts
      this.saveProducts()
    }
  
    // Get all products
    getAllProducts() {
      return [...this.products]
    }
  
    // Get product by ID
    getProductById(id) {
      return this.products.find((product) => product.id === id)
    }
  
    // Get products by category
    getProductsByCategory(category) {
      return this.products.filter((product) => product.category === category)
    }
  
    // Search products
    searchProducts(query) {
      const searchTerm = query.toLowerCase()
      return this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm),
      )
    }
  
    // Add new product
    addProduct(productData) {
      const newId = Math.max(...this.products.map((p) => p.id), 0) + 1
      const newProduct = {
        id: newId,
        rating: 4.0,
        reviews: 0,
        ...productData,
      }
  
      this.products.push(newProduct)
      this.saveProducts()
      return newProduct
    }
  
    // Update product
    updateProduct(id, productData) {
      const index = this.products.findIndex((product) => product.id === id)
      if (index === -1) {
        throw new Error("Product not found")
      }
  
      this.products[index] = {
        ...this.products[index],
        ...productData,
        id: id, // Ensure ID doesn't change
      }
  
      this.saveProducts()
      return this.products[index]
    }
  
    // Delete product
    deleteProduct(id) {
      const index = this.products.findIndex((product) => product.id === id)
      if (index === -1) {
        throw new Error("Product not found")
      }
  
      const deletedProduct = this.products.splice(index, 1)[0]
      this.saveProducts()
      return deletedProduct
    }
  
    // Get featured products (top rated or newest)
    getFeaturedProducts(limit = 4) {
      return this.products.sort((a, b) => b.rating - a.rating).slice(0, limit)
    }
  
    // Get products with discount
    getDiscountedProducts() {
      return this.products.filter((product) => product.discount > 0)
    }
  
    // Update stock
    updateStock(id, newStock) {
      const product = this.getProductById(id)
      if (!product) {
        throw new Error("Product not found")
      }
  
      product.stock = newStock
      this.saveProducts()
      return product
    }
  
    // Get low stock products
    getLowStockProducts(threshold = 10) {
      return this.products.filter((product) => product.stock <= threshold)
    }
  
    // Get categories
    getCategories() {
      const categories = [...new Set(this.products.map((product) => product.category))]
      return categories.sort()
    }
  
    // Get products count by category
    getProductsCountByCategory() {
      const counts = {}
      this.products.forEach((product) => {
        counts[product.category] = (counts[product.category] || 0) + 1
      })
      return counts
    }
  
    // Export products data
    exportProducts() {
      return {
        products: this.products,
        exportDate: new Date().toISOString(),
        totalProducts: this.products.length,
      }
    }
  
    // Import products data
    importProducts(data) {
      if (Array.isArray(data)) {
        this.products = data
      } else if (data.products && Array.isArray(data.products)) {
        this.products = data.products
      } else {
        throw new Error("Invalid import data format")
      }
  
      this.saveProducts()
      return this.products.length
    }
  
    // Clear all products (for testing)
    clearAllProducts() {
      this.products = []
      this.saveProducts()
    }
  
    // Reset to default products
    resetToDefault() {
      localStorage.removeItem(this.storageKey)
      this.products = []
      this.initializeDefaultProducts()
    }
  }
  
  // Initialize global product manager
  window.productManager = new ProductManager()
  
  // Export for use in other modules if needed
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ProductManager
  }
  
  // Console helper functions for debugging
  window.debugProducts = {
    showAll: () => console.table(window.productManager.getAllProducts()),
    showById: (id) => console.log(window.productManager.getProductById(id)),
    showByCategory: (category) => console.table(window.productManager.getProductsByCategory(category)),
    search: (query) => console.table(window.productManager.searchProducts(query)),
    addSample: () => {
      const sample = {
        name: "Sample Product",
        price: 100000,
        category: "elektronik",
        stock: 10,
        description: "This is a sample product for testing",
        features: ["Feature 1", "Feature 2"],
        specifications: { Brand: "Sample Brand" },
        image: "/placeholder.svg?height=500&width=500",
      }
      return window.productManager.addProduct(sample)
    },
    reset: () => window.productManager.resetToDefault(),
    clear: () => window.productManager.clearAllProducts(),
  }
  
  console.log("🛍️ Product Manager initialized with", window.productManager.getAllProducts().length, "products")
  console.log("💡 Use window.debugProducts for debugging helpers")
  