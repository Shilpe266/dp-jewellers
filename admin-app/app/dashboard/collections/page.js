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
  Grid,
  Alert,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel,
  Tooltip,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Edit, Delete, Add, Close, Collections as CollectionsIcon, Search } from '@mui/icons-material';
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
  isActive: true,
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });

  // Product picker state
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const listCustomCollections = httpsCallable(functions, 'listCustomCollections');
      const result = await listCustomCollections();
      setCollections(result.data.collections || []);
    } catch (err) {
      setError('Failed to load collections: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const listProducts = httpsCallable(functions, 'listProducts');
      const result = await listProducts({ page: 1, pageSize: 500, status: 'active' });
      setAllProducts(result.data.products || []);
    } catch (err) {
      setError('Failed to load products: ' + (err.message || ''));
    } finally {
      setProductsLoading(false);
    }
  };

  const handleOpenDialog = (collection = null) => {
    if (collection) {
      setEditingCollectionId(collection.id);
      setFormData({ name: collection.name || '', isActive: collection.isActive !== false });
      setSelectedProducts(
        (collection.productIds || []).map((id) => {
          const found = allProducts.find((p) => p.productId === id || p.id === id);
          return found ? found : { productId: id, name: id };
        })
      );
    } else {
      setEditingCollectionId(null);
      setFormData({ ...emptyForm });
      setSelectedProducts([]);
    }
    setProductSearch('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCollectionId(null);
    setFormData({ ...emptyForm });
    setSelectedProducts([]);
    setProductSearch('');
  };

  // Ensure products are loaded when dialog opens
  useEffect(() => {
    if (openDialog && allProducts.length === 0) {
      fetchProducts();
    }
  }, [openDialog]);

  // Re-resolve selected products once allProducts are loaded
  useEffect(() => {
    if (editingCollectionId && allProducts.length > 0) {
      const collection = collections.find((c) => c.id === editingCollectionId);
      if (collection) {
        setSelectedProducts(
          (collection.productIds || []).map((id) => {
            const found = allProducts.find((p) => (p.productId || p.id) === id);
            return found ? found : { productId: id, name: id };
          })
        );
      }
    }
  }, [allProducts]);

  const toggleProduct = (product) => {
    const id = product.productId || product.id;
    const alreadySelected = selectedProducts.some((p) => (p.productId || p.id) === id);
    if (alreadySelected) {
      setSelectedProducts((prev) => prev.filter((p) => (p.productId || p.id) !== id));
    } else {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const removeSelectedProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => (p.productId || p.id) !== id));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Please enter a collection name.');
      return;
    }
    if (selectedProducts.length === 0) {
      setError('Please select at least one product.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const saveCustomCollection = httpsCallable(functions, 'saveCustomCollection');
      const result = await saveCustomCollection({
        collectionId: editingCollectionId || undefined,
        name: formData.name.trim(),
        productIds: selectedProducts.map((p) => p.productId || p.id),
        isActive: formData.isActive,
      });

      if (result.data.pendingApproval) {
        setSuccess(editingCollectionId ? 'Collection update submitted for approval.' : 'New collection submitted for approval.');
      } else {
        setSuccess(editingCollectionId ? 'Collection updated successfully!' : 'Collection created successfully!');
      }
      handleCloseDialog();
      fetchCollections();
    } catch (err) {
      setError('Failed to save collection: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (collectionId) => {
    if (!confirm('Are you sure you want to delete this collection? Banners linked to it may stop working.')) return;

    try {
      const deleteCustomCollection = httpsCallable(functions, 'deleteCustomCollection');
      const result = await deleteCustomCollection({ collectionId });
      if (result.data.pendingApproval) {
        setSuccess('Collection deletion submitted for approval.');
      } else {
        setSuccess('Collection deleted successfully!');
      }
      fetchCollections();
    } catch (err) {
      setError('Failed to delete collection: ' + (err.message || ''));
    }
  };

  const filteredProducts = allProducts.filter((p) => {
    if (!productSearch) return true;
    const search = productSearch.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(search) ||
      (p.productCode || '').toLowerCase().includes(search) ||
      (p.category || '').toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      field: 'name',
      headerName: 'Collection Name',
      flex: 1,
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'productIds',
      headerName: 'Products',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Chip
          label={`${(params.row.productIds || []).length} products`}
          size="small"
          sx={{ backgroundColor: '#E8EAF6', color: '#1E1B4B' }}
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
          <Tooltip title="Edit collection" arrow>
            <IconButton size="small" onClick={() => handleOpenDialog(params.row)} sx={{ color: '#1E1B4B', mr: 0.5 }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete collection" arrow>
            <IconButton size="small" onClick={() => handleDelete(params.row.id)} sx={{ color: '#d32f2f' }}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="font-bold" sx={{ color: '#1E1B4B' }}>
          Custom Collections
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={buttonSx}
        >
          Add Collection
        </Button>
      </Box>

      {success && <Alert severity="success" className="!mb-4" onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" className="!mb-4" onClose={() => setError('')}>{error}</Alert>}

      <Paper elevation={2} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
        <DataGrid
          rows={collections}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          rowHeight={56}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
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
          localeText={{ noRowsLabel: 'No collections yet. Create your first collection!' }}
        />
      </Paper>

      {/* Add/Edit Collection Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CollectionsIcon />
            {editingCollectionId ? 'Edit Collection' : 'Add New Collection'}
          </Box>
          <IconButton onClick={handleCloseDialog} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                size="small"
                label="Collection Name"
                required
                placeholder="e.g. Valentine Special, Wedding Collection"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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

            {/* Selected products chips */}
            {selectedProducts.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#1E1B4B' }}>
                  Selected Products ({selectedProducts.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 120, overflowY: 'auto', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  {selectedProducts.map((p) => {
                    const id = p.productId || p.id;
                    return (
                      <Chip
                        key={id}
                        label={p.name || id}
                        size="small"
                        onDelete={() => removeSelectedProduct(id)}
                        sx={{ backgroundColor: '#E8EAF6', color: '#1E1B4B' }}
                      />
                    );
                  })}
                </Box>
              </Grid>
            )}

            {/* Product search & picker */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Add Products *
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name, code, or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />
              {productsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} sx={{ color: '#1E1B4B' }} />
                </Box>
              ) : (
                <Box sx={{ maxHeight: 280, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  {filteredProducts.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center', color: '#999' }}>
                      <Typography variant="body2">No products found</Typography>
                    </Box>
                  ) : (
                    filteredProducts.map((product) => {
                      const id = product.productId || product.id;
                      const isSelected = selectedProducts.some((p) => (p.productId || p.id) === id);
                      return (
                        <Box
                          key={id}
                          onClick={() => toggleProduct(product)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 2,
                            py: 1,
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#E8EAF6' : 'transparent',
                            borderBottom: '1px solid #f0f0f0',
                            '&:hover': { backgroundColor: isSelected ? '#D1D5F0' : '#f9f9f9' },
                            '&:last-child': { borderBottom: 'none' },
                          }}
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: 0.5,
                              border: '2px solid',
                              borderColor: isSelected ? '#1E1B4B' : '#bbb',
                              backgroundColor: isSelected ? '#1E1B4B' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isSelected && (
                              <Box component="span" sx={{ color: 'white', fontSize: 12, lineHeight: 1 }}>✓</Box>
                            )}
                          </Box>
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                            />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{product.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#888' }}>
                              {product.productCode && `${product.productCode} · `}{product.category}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#1E1B4B', fontWeight: 500, flexShrink: 0 }}>
                            {product.finalPrice ? `₹${product.finalPrice.toLocaleString('en-IN')}` : ''}
                          </Typography>
                        </Box>
                      );
                    })
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', color: '#666' }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving} sx={buttonSx}>
            {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : editingCollectionId ? 'Update Collection' : 'Create Collection'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
