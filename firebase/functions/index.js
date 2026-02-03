const admin = require("firebase-admin");
admin.initializeApp();

// Import function modules
const products = require("./src/products");
const metalRates = require("./src/metalRates");
const priceCalculation = require("./src/priceCalculation");
const orders = require("./src/orders");
const adminUsers = require("./src/adminUsers");
const images = require("./src/images");

// ============================================
// PRODUCT FUNCTIONS
// ============================================
exports.createProduct = products.createProduct;
exports.updateProduct = products.updateProduct;
exports.deleteProduct = products.deleteProduct;
exports.getProduct = products.getProduct;
exports.listProducts = products.listProducts;

// ============================================
// METAL RATES FUNCTIONS
// ============================================
exports.updateMetalRates = metalRates.updateMetalRates;
exports.getMetalRates = metalRates.getMetalRates;

// ============================================
// PRICE CALCULATION (Firestore Trigger)
// ============================================
exports.onMetalRatesUpdate = priceCalculation.onMetalRatesUpdate;
exports.calculateProductPrice = priceCalculation.calculateProductPrice;

// ============================================
// ORDER FUNCTIONS
// ============================================
exports.createOrder = orders.createOrder;
exports.updateOrderStatus = orders.updateOrderStatus;
exports.getUserOrders = orders.getUserOrders;
exports.getOrderDetails = orders.getOrderDetails;

// ============================================
// ADMIN USER FUNCTIONS
// ============================================
exports.createAdmin = adminUsers.createAdmin;
exports.setAdminClaims = adminUsers.setAdminClaims;

// ============================================
// IMAGE FUNCTIONS
// ============================================
exports.onImageUpload = images.onImageUpload;
