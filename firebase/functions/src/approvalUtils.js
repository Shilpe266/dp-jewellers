/**
 * Determines whether the given admin's changes require approval.
 * super_admin: never needs approval
 * Other roles: needs approval UNLESS skipApproval is true
 */
function requiresApproval(adminData) {
  if (adminData.role === "super_admin") return false;
  if (adminData.skipApproval === true) return false;
  return true;
}

module.exports = { requiresApproval };
