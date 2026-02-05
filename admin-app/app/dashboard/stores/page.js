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
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Edit, Delete, Add, Store, Close } from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '@/lib/firebase';

const functions = getFunctions(app, 'asia-south1');

const buttonSx = {
  backgroundColor: '#1E1B4B',
  '&:hover': { backgroundColor: '#2D2963' },
  textTransform: 'none',
};

const emptyForm = {
  name: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
  email: '',
  openingHours: '',
  isActive: true,
  isPrimary: false,
};

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const listStores = httpsCallable(functions, 'listStores');
      const result = await listStores();
      setStores(result.data.stores || []);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError('Failed to load stores: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (store = null) => {
    if (store) {
      setEditingStore(store.id);
      setFormData({
        name: store.name || '',
        address: store.address || '',
        city: store.city || '',
        state: store.state || '',
        pincode: store.pincode || '',
        phone: store.phone || '',
        email: store.email || '',
        openingHours: store.openingHours || '',
        isActive: store.isActive !== false,
        isPrimary: store.isPrimary || false,
      });
    } else {
      setEditingStore(null);
      setFormData({ ...emptyForm });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStore(null);
    setFormData({ ...emptyForm });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.city) {
      setError('Please fill in required fields (Name, Address, City)');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingStore) {
        const updateStore = httpsCallable(functions, 'updateStore');
        await updateStore({ storeId: editingStore, ...formData });
        setSuccess('Store updated successfully!');
      } else {
        const createStore = httpsCallable(functions, 'createStore');
        await createStore(formData);
        setSuccess('Store created successfully!');
      }
      handleCloseDialog();
      fetchStores();
    } catch (err) {
      console.error('Error saving store:', err);
      setError('Failed to save store: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (storeId) => {
    if (!confirm('Are you sure you want to delete this store?')) return;

    try {
      const deleteStore = httpsCallable(functions, 'deleteStore');
      await deleteStore({ storeId });
      setSuccess('Store deleted successfully!');
      fetchStores();
    } catch (err) {
      console.error('Error deleting store:', err);
      setError('Failed to delete store: ' + (err.message || ''));
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="font-bold" sx={{ color: '#1E1B4B' }}>
          Store Locations
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={buttonSx}
        >
          Add Store
        </Button>
      </Box>

      {success && <Alert severity="success" className="!mb-4" onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" className="!mb-4" onClose={() => setError('')}>{error}</Alert>}

      <Paper elevation={2} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
        <DataGrid
          rows={stores}
          columns={[
            { field: 'name', headerName: 'Store Name', flex: 1, minWidth: 150, sortable: true },
            {
              field: 'address',
              headerName: 'Address',
              flex: 1.5,
              minWidth: 200,
              sortable: true,
              renderCell: (params) => (
                <Box>
                  <div>{params.row.address}</div>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {params.row.city}, {params.row.state} - {params.row.pincode}
                  </Typography>
                </Box>
              ),
            },
            { field: 'phone', headerName: 'Phone', width: 130, sortable: true },
            { field: 'openingHours', headerName: 'Hours', width: 150, sortable: true },
            {
              field: 'isPrimary',
              headerName: 'Primary',
              width: 90,
              sortable: true,
              renderCell: (params) => (
                params.row.isPrimary ? (
                  <Chip label="Primary" color="primary" size="small" />
                ) : null
              ),
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
              width: 120,
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                <>
                  <Tooltip title="Edit store details (address, phone, hours)" arrow>
                    <IconButton size="small" onClick={() => handleOpenDialog(params.row)} sx={{ color: '#1E1B4B', mr: 0.5 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete store: Permanently remove this location" arrow>
                    <IconButton size="small" onClick={() => handleDelete(params.row.id)} sx={{ color: '#d32f2f' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ),
            },
          ]}
          getRowId={(row) => row.id}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
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
          localeText={{ noRowsLabel: 'No stores found. Add your first store!' }}
        />
      </Paper>

      {/* Add/Edit Store Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Store />
            {editingStore ? 'Edit Store' : 'Add New Store'}
          </Box>
          <IconButton onClick={handleCloseDialog} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Store Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Address"
                required
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="City"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Opening Hours"
                placeholder="e.g., Mon-Sat: 10AM-8PM, Sun: 11AM-6PM"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1E1B4B' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1E1B4B' } }}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPrimary}
                    onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1E1B4B' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1E1B4B' } }}
                  />
                }
                label="Primary Store"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', color: '#666' }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving} sx={buttonSx}>
            {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : editingStore ? 'Update Store' : 'Add Store'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
