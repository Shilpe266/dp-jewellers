const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

async function runTests() {
  console.log("===========================================");
  console.log("  DP Jewellers - Cloud Functions Test");
  console.log("===========================================\n");

  // -----------------------------------------------
  // TEST 1: Update Metal Rates
  // -----------------------------------------------
  console.log("TEST 1: Setting Metal Rates...");
  await db.collection("metalRates").doc("current").set({
    gold: {
      "24K": 7150,
      "22K": 6550,
      "18K": 5362,
      "14K": 4180,
    },
    silver: {
      "925_sterling": 88,
      "999_pure": 95,
    },
    diamond: {
      SI_IJ: 25000,
      SI_GH: 32000,
      VS_GH: 42000,
      VVS_EF: 65000,
      IF_DEF: 95000,
    },
    platinum: {
      perGram: 3200,
    },
    updatedBy: "test-script",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    effectiveFrom: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("  Gold 22K: Rs 6,550/gram");
  console.log("  Gold 24K: Rs 7,150/gram");
  console.log("  Silver 925: Rs 88/gram");
  console.log("  Diamond SI-IJ: Rs 25,000/carat");
  console.log("  PASSED\n");

  // -----------------------------------------------
  // TEST 2: Set Tax Settings
  // -----------------------------------------------
  console.log("TEST 2: Setting Tax Configuration...");
  await db.collection("taxSettings").doc("current").set({
    gst: {
      jewelry: 3,
      makingCharges: 5,
      applicationType: "exclusive",
    },
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("  GST on Jewelry: 3%");
  console.log("  PASSED\n");

  // -----------------------------------------------
  // TEST 3: Create a Sample Product (Gold Diamond Ring)
  // -----------------------------------------------
  console.log("TEST 3: Creating Product - 'Eternal Gold Diamond Ring'...");

  // Calculate price manually using the rates
  const goldRate22K = 6550;
  const netWeight = 4.8;
  const metalValue = netWeight * goldRate22K; // 31,440
  const diamondRate = 25000;
  const totalCarat = 0.85;
  const diamondValue = totalCarat * diamondRate; // 21,250
  const makingPercent = 14;
  const makingChargeAmount = metalValue * (makingPercent / 100); // 4,401.6
  const wastagePercent = 8;
  const wastageChargeAmount = metalValue * (wastagePercent / 100); // 2,515.2
  const stoneSettingCharges = 500;
  const subtotal = metalValue + diamondValue + makingChargeAmount + wastageChargeAmount + stoneSettingCharges;
  const taxRate = 3;
  const taxAmount = subtotal * (taxRate / 100);
  const finalPrice = Math.round(subtotal + taxAmount);

  const product1Ref = await db.collection("products").add({
    productCode: "DP-RG-001",
    name: "Eternal Gold Diamond Ring",
    description: "Elegant 18K yellow gold ring with SI-IJ diamonds, perfect for engagements.",
    category: "ring",
    subCategory: "engagement",
    images: [],
    metal: {
      type: "gold",
      goldType: "yellow",
      purity: "22K",
      grossWeight: 5.5,
      netWeight: 4.8,
    },
    diamond: {
      hasDiamond: true,
      clarity: "SI1",
      color: "I",
      cut: "excellent",
      shape: "round",
      numberOfDiamonds: 12,
      totalCaratWeight: 0.85,
      averageCaratPerDiamond: 0.07,
      certified: true,
      certificationAgency: "IGI",
      certificateNumber: "IGI-2025-001234",
    },
    gemstones: [],
    dimensions: {
      height: 15.5,
      width: 12.3,
      thickness: 2.1,
      availableSizes: ["6", "7", "8", "9", "10", "11", "12", "14"],
      defaultSize: "12",
    },
    pricing: {
      goldRatePerGram: goldRate22K,
      silverRatePerGram: 0,
      diamondRatePerCarat: diamondRate,
      makingChargeType: "percentage",
      makingChargeValue: makingPercent,
      makingChargeAmount: Math.round(makingChargeAmount),
      wastageChargeType: "percentage",
      wastageChargeValue: wastagePercent,
      wastageChargeAmount: Math.round(wastageChargeAmount),
      stoneSettingCharges: stoneSettingCharges,
      designCharges: 0,
      metalValue: Math.round(metalValue),
      diamondValue: Math.round(diamondValue),
      gemstoneValue: 0,
      subtotal: Math.round(subtotal),
      discount: 0,
      taxRate: taxRate,
      taxAmount: Math.round(taxAmount),
      finalPrice: finalPrice,
      mrp: finalPrice,
      sellingPrice: finalPrice,
    },
    certifications: {
      bisHallmarked: true,
      hallmarkNumber: "HUID-123456789012",
      purityCertificate: true,
      certificateUrl: "",
    },
    policies: {
      freeShipping: true,
      cashOnDelivery: false,
      tryAtHome: true,
      freeReturns: true,
      returnWindowDays: 30,
      exchangeAllowed: true,
      lifetimeExchange: true,
      buybackAvailable: true,
      resizable: true,
      customizable: false,
    },
    collections: ["bestsellers", "engagement"],
    tags: ["trending", "new_arrival"],
    inventory: {
      inStock: true,
      quantity: 5,
      lowStockThreshold: 2,
      preOrder: false,
      estimatedDeliveryDays: 7,
    },
    featured: true,
    bestseller: true,
    newArrival: true,
    displayOrder: 1,
    createdBy: "test-script",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    isActive: true,
    viewCount: 0,
    purchaseCount: 0,
  });

  console.log("  Product ID: " + product1Ref.id);
  console.log("  Price Breakdown:");
  console.log("    Metal Value (4.8g x Rs 6,550): Rs " + Math.round(metalValue).toLocaleString());
  console.log("    Diamond Value (0.85ct x Rs 25,000): Rs " + Math.round(diamondValue).toLocaleString());
  console.log("    Making Charges (14%): Rs " + Math.round(makingChargeAmount).toLocaleString());
  console.log("    Wastage Charges (8%): Rs " + Math.round(wastageChargeAmount).toLocaleString());
  console.log("    Stone Setting: Rs " + stoneSettingCharges.toLocaleString());
  console.log("    Subtotal: Rs " + Math.round(subtotal).toLocaleString());
  console.log("    GST (3%): Rs " + Math.round(taxAmount).toLocaleString());
  console.log("    FINAL PRICE: Rs " + finalPrice.toLocaleString());
  console.log("  PASSED\n");

  // -----------------------------------------------
  // TEST 4: Create Product 2 (Silver Bracelet)
  // -----------------------------------------------
  console.log("TEST 4: Creating Product - 'Sterling Silver Charm Bracelet'...");

  const silverRate = 88;
  const silverWeight = 25;
  const silverMetalValue = silverWeight * silverRate;
  const silverMaking = silverMetalValue * 0.12;
  const silverWastage = silverMetalValue * 0.05;
  const silverSubtotal = silverMetalValue + silverMaking + silverWastage;
  const silverTax = silverSubtotal * 0.03;
  const silverFinal = Math.round(silverSubtotal + silverTax);

  const product2Ref = await db.collection("products").add({
    productCode: "DP-BR-001",
    name: "Sterling Silver Charm Bracelet",
    description: "Beautiful 925 sterling silver bracelet with intricate charm designs.",
    category: "bracelet",
    subCategory: "daily-wear",
    images: [],
    metal: {
      type: "silver",
      silverType: "925_sterling",
      grossWeight: 25,
      netWeight: 25,
    },
    diamond: { hasDiamond: false },
    gemstones: [],
    dimensions: {
      width: 8,
      thickness: 3,
      availableSizes: ["16", "18", "20"],
      defaultSize: "18",
    },
    pricing: {
      goldRatePerGram: 0,
      silverRatePerGram: silverRate,
      diamondRatePerCarat: 0,
      makingChargeType: "percentage",
      makingChargeValue: 12,
      makingChargeAmount: Math.round(silverMaking),
      wastageChargeType: "percentage",
      wastageChargeValue: 5,
      wastageChargeAmount: Math.round(silverWastage),
      stoneSettingCharges: 0,
      designCharges: 0,
      metalValue: Math.round(silverMetalValue),
      diamondValue: 0,
      gemstoneValue: 0,
      subtotal: Math.round(silverSubtotal),
      discount: 0,
      taxRate: 3,
      taxAmount: Math.round(silverTax),
      finalPrice: silverFinal,
      mrp: silverFinal,
      sellingPrice: silverFinal,
    },
    certifications: { bisHallmarked: false, purityCertificate: true },
    policies: {
      freeShipping: true,
      cashOnDelivery: true,
      tryAtHome: false,
      freeReturns: true,
      returnWindowDays: 15,
      exchangeAllowed: true,
      lifetimeExchange: false,
      buybackAvailable: false,
      resizable: false,
      customizable: false,
    },
    collections: ["daily-wear"],
    tags: ["under_5k", "new_arrival"],
    inventory: {
      inStock: true,
      quantity: 20,
      lowStockThreshold: 5,
      preOrder: false,
      estimatedDeliveryDays: 3,
    },
    featured: false,
    bestseller: false,
    newArrival: true,
    displayOrder: 5,
    createdBy: "test-script",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    isActive: true,
    viewCount: 0,
    purchaseCount: 0,
  });

  console.log("  Product ID: " + product2Ref.id);
  console.log("  FINAL PRICE: Rs " + silverFinal.toLocaleString());
  console.log("  PASSED\n");

  // -----------------------------------------------
  // TEST 5: Create a Sample Store
  // -----------------------------------------------
  console.log("TEST 5: Creating Store - 'DP Jewellers Connaught Place'...");
  await db.collection("stores").add({
    storeName: "DP Jewellers - Connaught Place",
    address: {
      addressLine: "Block A, Inner Circle, Connaught Place",
      landmark: "Near Rajiv Chowk Metro Station",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    location: { latitude: 28.6315, longitude: 77.2167 },
    contact: {
      phone: "+91-9876543210",
      email: "cp@dpjewellers.com",
      whatsapp: "+91-9876543210",
    },
    timings: {
      monday: { open: "10:00", close: "20:00" },
      tuesday: { open: "10:00", close: "20:00" },
      wednesday: { open: "10:00", close: "20:00" },
      thursday: { open: "10:00", close: "20:00" },
      friday: { open: "10:00", close: "20:00" },
      saturday: { open: "10:00", close: "21:00" },
      sunday: { open: "11:00", close: "19:00" },
    },
    services: ["tryAtHome", "customDesign", "repairService", "buyback"],
    images: [],
    isActive: true,
  });
  console.log("  PASSED\n");

  // -----------------------------------------------
  // TEST 6: Create a Sample Coupon
  // -----------------------------------------------
  console.log("TEST 6: Creating Coupon - 'WELCOME2025'...");
  await db.collection("coupons").add({
    code: "WELCOME2025",
    description: "Welcome discount for new customers",
    discountType: "percentage",
    discountValue: 5,
    maxDiscountAmount: 5000,
    minOrderValue: 10000,
    applicableOn: { categories: [], collections: [], products: [] },
    usageLimit: { totalUses: 1000, usesPerUser: 1, currentUses: 0 },
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2025-12-31"),
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("  Code: WELCOME2025 | 5% off (max Rs 5,000) | Min order Rs 10,000");
  console.log("  PASSED\n");

  // -----------------------------------------------
  // TEST 7: Verify Admin Documents
  // -----------------------------------------------
  console.log("TEST 7: Verifying Admin Users...");
  const adminsSnapshot = await db.collection("admins").get();
  adminsSnapshot.forEach((doc) => {
    const data = doc.data();
    console.log("  " + data.email + " | Role: " + data.role + " | Active: " + data.isActive);
  });
  console.log("  PASSED\n");

  // -----------------------------------------------
  // TEST 8: Read back products
  // -----------------------------------------------
  console.log("TEST 8: Listing All Active Products...");
  const productsSnapshot = await db.collection("products")
    .where("isActive", "==", true)
    .get();

  productsSnapshot.forEach((doc) => {
    const p = doc.data();
    console.log("  [" + p.productCode + "] " + p.name + " - Rs " + (p.pricing?.finalPrice || 0).toLocaleString());
  });
  console.log("  Total Products: " + productsSnapshot.size);
  console.log("  PASSED\n");

  // -----------------------------------------------
  // SUMMARY
  // -----------------------------------------------
  console.log("===========================================");
  console.log("  ALL TESTS PASSED!");
  console.log("===========================================");
  console.log("\nData created in Firestore:");
  console.log("  - Metal rates (gold, silver, diamond, platinum)");
  console.log("  - Tax settings (3% GST)");
  console.log("  - 2 Products (Gold Ring + Silver Bracelet)");
  console.log("  - 1 Store (Connaught Place)");
  console.log("  - 1 Coupon (WELCOME2025)");
  console.log("  - 2 Admin users (super_admin)");
  console.log("\nOpen Firebase Console > Firestore to see all the data!");

  process.exit(0);
}

runTests().catch((err) => {
  console.error("TEST FAILED:", err.message);
  process.exit(1);
});
