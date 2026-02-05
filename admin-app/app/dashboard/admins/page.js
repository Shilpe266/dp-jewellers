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
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Edit, Block, CheckCircle, PersonAdd } from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '@/lib/firebase';

const functions = getFunctions(app, 'asia-south1');

const PERMISSION_OPTIONS = [
  { key: 'manageProducts', label: 'Manage Products' },
  { key: 'manageOrders', label: 'Manage Orders' },
  { key: 'manageRates', label: 'Manage Rates' },
  { key: 'managePromotions', label: 'Manage Promotions' },
  { key: 'manageUsers', label: 'Manage Users' },
];

const buttonSx = {
  backgroundColor: '#1E1B4B',
  '&:hover': { backgroundColor: '#2D2963' },
  textTransform: 'none',
};

const getRoleChipColor = (role) => {
  switch (role) {
    case 'super_admin':
      return 'primary';
    case 'admin':
      return 'info';
    default:
      return 'default';
  }
};

const formatRoleLabel = (role) => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'editor':
      return 'Editor';
    default:
      return role;
  }
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Create admin dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({ email: '', role: 'admin' });

  // Edit admin dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editForm, setEditForm] = useState({
    role: 'admin',
    permissions: {
      manageProducts: false,
      manageOrders: false,
      manageRates: false,
      managePromotions: false,
      manageUsers: false,
    },
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const listAdmins = httpsCallable(functions, 'listAdmins');
      const result = await listAdmins();
      setAdmins(result.data.admins || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to load admins: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!createForm.email) {
      setError('Email is required');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const createAdmin = httpsCallable(functions, 'createAdmin');
      const result = await createAdmin({ email: createForm.email, role: createForm.role });
      setSuccess(result.data.message || 'Admin created successfully!');
      setOpenCreateDialog(false);
      setCreateForm({ email: '', role: 'admin' });
      fetchAdmins();
    } catch (err) {
      console.error('Error creating admin:', err);
      setError('Failed to create admin: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEditDialog = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      role: admin.role || 'admin',
      permissions: {
        manageProducts: admin.permissions?.manageProducts || false,
        manageOrders: admin.permissions?.manageOrders || false,
        manageRates: admin.permissions?.manageRates || false,
        managePromotions: admin.permissions?.managePromotions || false,
        manageUsers: admin.permissions?.manageUsers || false,
      },
    });
    setOpenEditDialog(true);
  };

  const handleUpdateAdmin = async () => {
    if (!selectedAdmin) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateAdmin = httpsCallable(functions, 'updateAdmin');
      await updateAdmin({
        uid: selectedAdmin.uid,
        role: editForm.role,
        permissions: editForm.permissions,
      });
      setSuccess('Admin updated successfully!');
      setOpenEditDialog(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err) {
      console.error('Error updating admin:', err);
      setError('Failed to update admin: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateAdmin = async (admin) => {
    if (!confirm(`Are you sure you want to deactivate ${admin.email}?`)) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const deactivateAdmin = httpsCallable(functions, 'deactivateAdmin');
      await deactivateAdmin({ uid: admin.uid });
      setSuccess(`Admin ${admin.email} deactivated successfully!`);
      fetchAdmins();
    } catch (err) {
      console.error('Error deactivating admin:', err);
      setError('Failed to deactivate admin: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateAdmin = async (admin) => {
    if (!confirm(`Are you sure you want to reactivate ${admin.email}?`)) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const reactivateAdmin = httpsCallable(functions, 'reactivateAdmin');
      await reactivateAdmin({ uid: admin.uid });
      setSuccess(`Admin ${admin.email} reactivated successfully!`);
      fetchAdmins();
    } catch (err) {
      console.error('Error reactivating admin:', err);
      setError('Failed to reactivate admin: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermissionChange = (key) => {
    setEditForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return '';
  
    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6
    );
  
    return date.toLocaleDateString();
  };  

  const formatPermissions = (permissions) => {
    if (!permissions) return 'None';
    const activePermissions = PERMISSION_OPTIONS
      .filter((p) => permissions[p.key])
      .map((p) => p.label);
    return activePermissions.length > 0 ? activePermissions.join(', ') : 'None';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#1E1B4B' }} />
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" className="font-bold" sx={{ color: '#1E1B4B' }}>
          Manage Admins
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setOpenCreateDialog(true)}
          sx={buttonSx}
        >
          Add Admin
        </Button>
      </Box>

      {success && (
        <Alert severity="success" className="!mb-4" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" className="!mb-4" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
        <DataGrid
          rows={admins}
          columns={[
            { field: 'email', headerName: 'Email', flex: 1, minWidth: 200, sortable: true },
            {
              field: 'role',
              headerName: 'Role',
              width: 130,
              sortable: true,
              renderCell: (params) => (
                <Chip
                  label={formatRoleLabel(params.row.role)}
                  color={getRoleChipColor(params.row.role)}
                  size="small"
                />
              ),
            },
            {
              field: 'isActive',
              headerName: 'Status',
              width: 100,
              sortable: true,
              renderCell: (params) => (
                <Chip
                  label={params.row.isActive ? 'Active' : 'Inactive'}
                  color={params.row.isActive ? 'success' : 'default'}
                  size="small"
                />
              ),
            },
            {
              field: 'permissions',
              headerName: 'Permissions',
              flex: 1,
              minWidth: 180,
              sortable: false,
              valueGetter: (value, row) => row.role === 'super_admin' ? 'All permissions' : formatPermissions(row.permissions),
              renderCell: (params) => (
                <Typography variant="body2" noWrap>
                  {params.row.role === 'super_admin' ? 'All permissions' : formatPermissions(params.row.permissions)}
                </Typography>
              ),
            },
            {
              field: 'createdAt',
              headerName: 'Created',
              width: 120,
              sortable: true,
              valueGetter: (value, row) => row.createdAt?._seconds ? new Date(row.createdAt._seconds * 1000) : null,
              renderCell: (params) => formatDate(params.row.createdAt),
            },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 140,
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                params.row.role === 'super_admin' ? (
                  <Chip label="Super Admin" size="small" color="primary" variant="outlined" />
                ) : (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit admin role and permissions" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(params.row)}
                        sx={{ color: '#1E1B4B' }}
                        disabled={actionLoading}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {params.row.isActive ? (
                      <Tooltip title="Deactivate: Admin will lose access to the dashboard" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleDeactivateAdmin(params.row)}
                          sx={{ color: '#FF9800' }}
                          disabled={actionLoading}
                        >
                          <Block fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Reactivate: Restore admin access to the dashboard" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleReactivateAdmin(params.row)}
                          sx={{ color: '#4CAF50' }}
                          disabled={actionLoading}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                )
              ),
            },
          ]}
          getRowId={(row) => row.uid}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'email', sort: 'asc' }] },
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
          localeText={{ noRowsLabel: 'No admins found' }}
        />
      </Paper>

      {/* Create Admin Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => {
          if (!actionLoading) {
            setOpenCreateDialog(false);
            setCreateForm({ email: '', role: 'admin' });
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Create New Admin
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                variant="outlined"
                disabled={actionLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                select
                label="Role"
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                variant="outlined"
                disabled={actionLoading}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1E1B4B', mb: 1 }}>
                  {createForm.role === 'admin' ? 'Admin Role Access:' : 'Editor Role Access:'}
                </Typography>
                {createForm.role === 'admin' ? (
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <li><Typography variant="body2">Manage Products (add, edit, delete, archive, restore)</Typography></li>
                    <li><Typography variant="body2">Manage Orders (view, update status)</Typography></li>
                    <li><Typography variant="body2">Manage Promotions</Typography></li>
                    <li><Typography variant="body2" sx={{ color: '#d32f2f' }}>Cannot manage metal rates</Typography></li>
                    <li><Typography variant="body2" sx={{ color: '#d32f2f' }}>Cannot manage other admin users</Typography></li>
                  </Box>
                ) : (
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <li><Typography variant="body2">View and edit products (limited)</Typography></li>
                    <li><Typography variant="body2">View orders</Typography></li>
                    <li><Typography variant="body2" sx={{ color: '#d32f2f' }}>Cannot delete or archive products</Typography></li>
                    <li><Typography variant="body2" sx={{ color: '#d32f2f' }}>Cannot manage metal rates</Typography></li>
                    <li><Typography variant="body2" sx={{ color: '#d32f2f' }}>Cannot manage promotions or users</Typography></li>
                    <li><Typography variant="body2" sx={{ color: '#d32f2f' }}>Cannot manage other admin users</Typography></li>
                  </Box>
                )}
                <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                  Note: Only Super Admins (created during deployment) have full access including rate management and admin user management.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setOpenCreateDialog(false);
              setCreateForm({ email: '', role: 'admin' });
            }}
            sx={{ textTransform: 'none', color: '#666' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateAdmin}
            variant="contained"
            disabled={actionLoading || !createForm.email}
            sx={buttonSx}
          >
            {actionLoading ? 'Creating...' : 'Create Admin'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          if (!actionLoading) {
            setOpenEditDialog(false);
            setSelectedAdmin(null);
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Edit Admin {selectedAdmin ? `- ${selectedAdmin.email}` : ''}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                select
                label="Role"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                variant="outlined"
                disabled={actionLoading}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: '#1E1B4B', fontWeight: 'bold', mb: 1 }}>
                Permissions
              </Typography>
              <FormGroup>
                {PERMISSION_OPTIONS.map((permission) => (
                  <FormControlLabel
                    key={permission.key}
                    control={
                      <Checkbox
                        checked={editForm.permissions[permission.key] || false}
                        onChange={() => handlePermissionChange(permission.key)}
                        disabled={actionLoading}
                        sx={{
                          color: '#1E1B4B',
                          '&.Mui-checked': { color: '#1E1B4B' },
                        }}
                      />
                    }
                    label={permission.label}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              setSelectedAdmin(null);
            }}
            sx={{ textTransform: 'none', color: '#666' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateAdmin}
            variant="contained"
            disabled={actionLoading}
            sx={buttonSx}
          >
            {actionLoading ? 'Updating...' : 'Update Admin'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
