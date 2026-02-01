'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import { Visibility, Edit, Delete, Block, CheckCircle } from '@mui/icons-material';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [userOrders, setUserOrders] = useState([]);

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  });

  useEffect(() => {
    // TEMPORARY: Disable Firebase fetch until it's configured
    // TODO: Uncomment when Firebase is set up
    // fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // TEMPORARY: Disable Firebase fetch until it's configured
    // TODO: Uncomment when Firebase is set up
    /*
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by creation date (newest first)
      usersList.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setUsers(usersList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    }
    */
  };

  const fetchUserOrders = async (userId) => {
    // TEMPORARY: Disable Firebase fetch until it's configured
    // TODO: Uncomment when Firebase is set up
    /*
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(ordersQuery);
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserOrders(ordersList);
    } catch (err) {
      console.error('Error fetching user orders:', err);
    }
    */
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    await fetchUserOrders(user.id);
    setOpenViewDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      isActive: user.isActive !== false,
    });
    setOpenEditDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setError('');
    setSuccess('');

    // TEMPORARY: Disable Firebase update until it's configured
    // TODO: Uncomment when Firebase is set up
    /*
    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        ...editFormData,
        updatedAt: new Date().toISOString(),
      });

      setSuccess('User updated successfully!');
      setOpenEditDialog(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    } finally {
      setLoading(false);
    }
    */

    // Demo mode - show success message without Firebase
    setSuccess('User updated successfully! (Demo mode - not saved to Firebase)');
    setLoading(false);
    setOpenEditDialog(false);
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = !user.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    setLoading(true);

    // TEMPORARY: Disable Firebase update until it's configured
    // TODO: Uncomment when Firebase is set up
    /*
    try {
      await updateDoc(doc(db, 'users', user.id), {
        isActive: newStatus,
        updatedAt: new Date().toISOString(),
      });

      setSuccess(`User ${action}d successfully!`);
      fetchUsers();
    } catch (err) {
      setError(`Failed to ${action} user`);
      console.error(err);
    } finally {
      setLoading(false);
    }
    */

    // Demo mode - show success message without Firebase
    setSuccess(`User ${action}d successfully! (Demo mode - not saved to Firebase)`);
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    // TEMPORARY: Disable Firebase delete until it's configured
    // TODO: Uncomment when Firebase is set up
    /*
    try {
      await deleteDoc(doc(db, 'users', userId));
      setSuccess('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    } finally {
      setLoading(false);
    }
    */

    // Demo mode - show success message without Firebase
    setSuccess('User deleted successfully! (Demo mode - not saved to Firebase)');
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1E1B4B' }}>
        Users Management
      </Typography>

      {success && <Alert severity="success" className="!mb-4">{success}</Alert>}
      {error && <Alert severity="error" className="!mb-4">{error}</Alert>}

      <Paper elevation={2} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Joined Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive !== false ? 'Active' : 'Inactive'}
                        color={user.isActive !== false ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewUser(user)}
                        sx={{ color: '#1E1B4B', mr: 1 }}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                        sx={{ color: '#1E1B4B', mr: 1 }}
                        title="Edit User"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleUserStatus(user)}
                        sx={{ color: user.isActive !== false ? '#FF9800' : '#4CAF50', mr: 1 }}
                        title={user.isActive !== false ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.isActive !== false ? <Block /> : <CheckCircle />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        sx={{ color: '#d32f2f' }}
                        title="Delete User"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View User Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          User Details
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Name
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {selectedUser.name || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Email
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {selectedUser.email || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {selectedUser.phone || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                    color={selectedUser.isActive !== false ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Address
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {selectedUser.address || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Joined Date
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {formatDate(selectedUser.createdAt)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {formatDate(selectedUser.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" className="font-bold mb-3" sx={{ color: '#1E1B4B' }}>
                Order History
              </Typography>

              {userOrders.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#666' }}>
                  No orders found for this user
                </Typography>
              ) : (
                <Box>
                  {userOrders.map((order) => (
                    <Box
                      key={order.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: '#F5F5F5',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <Typography variant="body1" className="font-semibold">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {formatDate(order.createdAt)}
                          </Typography>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Typography variant="body1" className="font-semibold">
                            ₹{order.totalAmount || 0}
                          </Typography>
                          <Chip
                            label={order.status?.toUpperCase() || 'PENDING'}
                            size="small"
                            color={order.status === 'completed' ? 'success' : 'default'}
                          />
                        </div>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenViewDialog(false)}
            sx={{ textTransform: 'none', color: '#666' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Edit User
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Name"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Phone"
                value={editFormData.phone || ''}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Address"
                value={editFormData.address || ''}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                select
                label="Status"
                value={editFormData.isActive}
                onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value })}
                variant="outlined"
                sx={{ minWidth: '200px' }}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{ textTransform: 'none', color: '#666' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#1E1B4B',
              '&:hover': { backgroundColor: '#2D2963' },
              textTransform: 'none',
            }}
          >
            {loading ? 'Updating...' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
