const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

/**
 * Create an admin user (callable by super_admin only)
 * Sets custom claims and creates admin document in Firestore
 */
exports.createAdmin = onCall({ region: "asia-south1" }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  // Verify caller is super_admin
  const callerDoc = await db.collection("admins").doc(request.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== "super_admin") {
    throw new HttpsError("permission-denied", "Only super admins can create admin accounts.");
  }

  const { email, role, permissions } = request.data;

  if (!email) {
    throw new HttpsError("invalid-argument", "Email is required.");
  }

  const validRoles = ["super_admin", "admin", "editor"];
  if (!role || !validRoles.includes(role)) {
    throw new HttpsError("invalid-argument", `Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }

  // Check if user exists in Firebase Auth
  let userRecord;
  try {
    userRecord = await admin.auth().getUserByEmail(email);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      throw new HttpsError(
        "not-found",
        `No Firebase Auth user found with email ${email}. The user must sign up first.`
      );
    }
    throw new HttpsError("internal", "Error looking up user.");
  }

  // Set custom claims for admin
  await admin.auth().setCustomUserClaims(userRecord.uid, {
    admin: true,
    role: role,
  });

  // Create admin document in Firestore
  const adminData = {
    email: email,
    role: role,
    permissions: permissions || {
      manageProducts: role === "super_admin" || role === "admin",
      manageOrders: role === "super_admin" || role === "admin",
      manageRates: role === "super_admin",
      managePromotions: role === "super_admin" || role === "admin",
      manageUsers: role === "super_admin",
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: request.auth.uid,
    isActive: true,
  };

  await db.collection("admins").doc(userRecord.uid).set(adminData);

  return {
    adminId: userRecord.uid,
    email,
    role,
    message: `Admin account created for ${email} with role: ${role}.`,
  };
});

/**
 * Set admin custom claims (for initial bootstrap or repair)
 * This is a special function - first call can be made without admin verification
 * if no admins exist yet (bootstrap mode)
 */
exports.setAdminClaims = onCall({ region: "asia-south1" }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  // Check if any admins exist (bootstrap mode)
  const adminsSnapshot = await db.collection("admins")
    .where("isActive", "==", true)
    .limit(1)
    .get();

  const isBootstrap = adminsSnapshot.empty;

  if (!isBootstrap) {
    // Normal mode - verify caller is super_admin
    const callerDoc = await db.collection("admins").doc(request.auth.uid).get();
    if (!callerDoc.exists || callerDoc.data().role !== "super_admin") {
      throw new HttpsError("permission-denied", "Only super admins can set admin claims.");
    }
  }

  const { uid } = request.data;
  const targetUid = uid || request.auth.uid;

  // In bootstrap mode, only allow setting claims for the caller
  if (isBootstrap && targetUid !== request.auth.uid) {
    throw new HttpsError("permission-denied", "In bootstrap mode, you can only set claims for yourself.");
  }

  // Set custom claims
  await admin.auth().setCustomUserClaims(targetUid, {
    admin: true,
    role: "super_admin",
  });

  // Create admin document if it doesn't exist
  const adminRef = db.collection("admins").doc(targetUid);
  const adminDoc = await adminRef.get();

  if (!adminDoc.exists) {
    const userRecord = await admin.auth().getUser(targetUid);
    await adminRef.set({
      email: userRecord.email || "",
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
  }

  return {
    uid: targetUid,
    message: isBootstrap
      ? "Bootstrap complete. You are now a super admin. Sign out and sign back in for claims to take effect."
      : "Admin claims updated. User must sign out and back in for changes to take effect.",
  };
});
