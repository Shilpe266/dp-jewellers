'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
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
  Tooltip,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Visibility, Edit, Delete, Block, CheckCircle } from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '@/lib/firebase';

const functions = getFunctions(app, 'asia-south1');

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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const listUsers = httpsCallable(functions, 'listUsers');
      const result = await listUsers({ limit: 100 });
      setUsers(result.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const getUserDetails = httpsCallable(functions, 'getUserDetails');
      const result = await getUserDetails({ userId });
      setUserOrders(result.data.orders || []);
    } catch (err) {
      console.error('Error fetching user orders:', err);
    }
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

    try {
      const updateUser = httpsCallable(functions, 'updateUser');
      await updateUser({
        userId: selectedUser.id,
        ...editFormData,
      });

      setSuccess('User updated successfully!');
      setOpenEditDialog(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user: ' + (err.message || ''));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.isActive === false;
    const action = newStatus ? 'activate' : 'deactivate';

    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    setLoading(true);

    try {
      const updateUser = httpsCallable(functions, 'updateUser');
      await updateUser({ userId: user.id, isActive: newStatus });

      setSuccess(`User ${action}d successfully!`);
      fetchUsers();
    } catch (err) {
      setError(`Failed to ${action} user: ` + (err.message || ''));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    setLoading(true);

    try {
      const deleteUser = httpsCallable(functions, 'deleteUser');
      await deleteUser({ userId });
      setSuccess('User deactivated successfully!');
      fetchUsers();
    } catch (err) {
      setError('Failed to deactivate user: ' + (err.message || ''));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return '';
  
    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6
    );
  
    return date.toLocaleDateString();
  };  

  return (
    <div>
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1E1B4B' }}>
        Users Management
      </Typography>

      {success && <Alert severity="success" className="!mb-4" onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" className="!mb-4" onClose={() => setError('')}>{error}</Alert>}

      <Paper elevation={2} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
        <DataGrid
          rows={users}
          columns={[
            { field: 'name', headerName: 'Name', flex: 1, minWidth: 150, sortable: true, valueGetter: (value, row) => row.name || 'N/A' },
            { field: 'email', headerName: 'Email', flex: 1, minWidth: 180, sortable: true, valueGetter: (value, row) => row.email || 'N/A' },
            { field: 'phone', headerName: 'Phone', width: 130, sortable: true, valueGetter: (value, row) => row.phone || 'N/A' },
            {
              field: 'createdAt',
              headerName: 'Joined Date',
              width: 130,
              sortable: true,
              valueGetter: (value, row) => row.createdAt ? new Date(row.createdAt) : null,
              renderCell: (params) => formatDate(params.row.createdAt),
            },
            {
              field: 'isActive',
              headerName: 'Status',
              width: 100,
              sortable: true,
              renderCell: (params) => (
                <Chip
                  label={params.row.isActive !== false ? 'Active' : 'Inactive'}
                  color={params.row.isActive !== false ? 'success' : 'default'}
                  size="small"
                />
              ),
            },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 180,
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                <>
                  <Tooltip title="View user profile and order history" arrow>
                    <IconButton size="small" onClick={() => handleViewUser(params.row)} sx={{ color: '#1E1B4B', mr: 0.5 }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit user details (name, email, phone, address)" arrow>
                    <IconButton size="small" onClick={() => handleEditUser(params.row)} sx={{ color: '#1E1B4B', mr: 0.5 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={params.row.isActive !== false ? 'Deactivate: User will not be able to login or place orders' : 'Activate: Restore user access to the app'} arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleUserStatus(params.row)}
                      sx={{ color: params.row.isActive !== false ? '#FF9800' : '#4CAF50', mr: 0.5 }}
                    >
                      {params.row.isActive !== false ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deactivate user account (soft delete)" arrow>
                    <IconButton size="small" onClick={() => handleDeleteUser(params.row.id)} sx={{ color: '#d32f2f' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ),
            },
          ]}
          getRowId={(row) => row.id}
          loading={loading && users.length === 0}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5', fontWeight: 'bold' },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f9f9f9' },
            '& .MuiDataGrid-toolbarContainer': { p: 2, gap: 2 },
          }}
          localeText={{ noRowsLabel: 'No users found' }}
        />
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
