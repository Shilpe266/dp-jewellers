/**
 * Admin Setup Script
 *
 * Run this script once to set up the first super_admin users.
 * Usage: node firebase/scripts/setupAdmin.js
 *
 * Prerequisites:
 *   1. Install firebase-admin: npm install firebase-admin
 *   2. Download service account key from Firebase Console:
 *      Project Settings > Service Accounts > Generate New Private Key
 *   3. Set environment variable:
 *      export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
 */

const admin = require("firebase-admin");

// Initialize with service account
admin.initializeApp();

const db = admin.firestore();

// Admin emails to set up
const ADMIN_EMAILS = [
  "verma.varun2810@gmail.com",
  "shilpecsaxena9098@gmail.com",
];

async function setupAdmins() {
  console.log("Setting up admin accounts...\n");

  for (const email of ADMIN_EMAILS) {
    try {
      // Get user by email
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log(`Found user: ${email} (UID: ${userRecord.uid})`);

      // Set custom claims
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        admin: true,
        role: "super_admin",
      });
      console.log(`  Custom claims set.`);

      // Create admin document in Firestore
      await db.collection("admins").doc(userRecord.uid).set({
        email: email,
        role: "super_admin",
        permissions: {
          manageProducts: true,
          manageOrders: true,
          manageRates: true,
          managePromotions: true,
          manageUsers: true,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isActive: true,
      });
      console.log(`  Admin document created in Firestore.`);
      console.log(`  ${email} is now a super_admin.\n`);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.log(`  User ${email} not found in Firebase Auth.`);
        console.log(`  They need to sign up first, then run this script again.\n`);
      } else {
        console.error(`  Error setting up ${email}:`, error.message, "\n");
      }
    }
  }

  console.log("Admin setup complete!");
  console.log("IMPORTANT: Admin users must sign out and sign back in for custom claims to take effect.");
  process.exit(0);
}

setupAdmins();
