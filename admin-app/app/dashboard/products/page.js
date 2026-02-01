'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Input,
} from '@mui/material';
import { Add, Edit, Delete, Image as ImageIcon } from '@mui/icons-material';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const categories = ['Ring', 'Necklace', 'Earring', 'Bangle', 'Bracelet', 'Pendant', 'Chain', 'Anklet'];
const purities = ['14K', '18K', '22K', '24K', 'Silver 925', 'Silver 999'];
const materials = ['Gold', 'Silver', 'Diamond', 'Platinum'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    material: '',
    purity: '',
    netWeight: '',
    grossWeight: '',
    stoneDetails: '',
    huidNumber: '',
    description: '',
    basePrice: '',
    isActive: true,
  });

  useEffect(() => {
    // TEMPORARY: Disable Firebase fetch until it's configured
    // TODO: Uncomment when Firebase is set up
    // fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product.id);
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        material: product.material || '',
        purity: product.purity || '',
        netWeight: product.netWeight || '',
        grossWeight: product.grossWeight || '',
        stoneDetails: product.stoneDetails || '',
        huidNumber: product.huidNumber || '',
        description: product.description || '',
        basePrice: product.basePrice || '',
        isActive: product.isActive !== false,
      });
      setImagePreview(product.images || []);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        category: '',
        material: '',
        purity: '',
        netWeight: '',
        grossWeight: '',
        stoneDetails: '',
        huidNumber: '',
        description: '',
        basePrice: '',
        isActive: true,
      });
      setImagePreview([]);
    }
    setImageFiles([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImageFiles([]);
    setImagePreview([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const uploadImages = async () => {
    const uploadedUrls = [];

    for (const file of imageFiles) {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku || !formData.category) {
      setError('Please fill in all required fields (Name, SKU, Category)');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    // TEMPORARY: Disable Firebase save until it's configured
    // TODO: Uncomment when Firebase is set up
    /*
    try {
      let imageUrls = imagePreview;

      // Upload new images if any
      if (imageFiles.length > 0) {
        const newUrls = await uploadImages();
        imageUrls = editingProduct ? [...imagePreview, ...newUrls] : newUrls;
      }

      const productData = {
        ...formData,
        images: imageUrls,
        updatedAt: new Date().toISOString(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct), productData);
        setSuccess('Product updated successfully!');
      } else {
        productData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'products'), productData);
        setSuccess('Product added successfully!');
      }

      handleCloseDialog();
      fetchProducts();
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    } finally {
      setLoading(false);
    }
    */

    // Demo mode - show success message without Firebase
    setSuccess(editingProduct ? 'Product updated successfully! (Demo mode - not saved to Firebase)' : 'Product added successfully! (Demo mode - not saved to Firebase)');
    setLoading(false);
    handleCloseDialog();
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);

    // TEMPORARY: Disable Firebase delete until it's configured
    // TODO: Uncomment when Firebase is set up
    /*
    try {
      await deleteDoc(doc(db, 'products', productId));
      setSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    } finally {
      setLoading(false);
    }
    */

    // Demo mode - show success message without Firebase
    setSuccess('Product deleted successfully! (Demo mode - not saved to Firebase)');
    setLoading(false);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="font-bold" sx={{ color: '#1E1B4B' }}>
          Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#1E1B4B',
            '&:hover': { backgroundColor: '#2D2963' },
            textTransform: 'none',
          }}
        >
          Add Product
        </Button>
      </Box>

      {success && <Alert severity="success" className="!mb-4">{success}</Alert>}
      {error && <Alert severity="error" className="!mb-4">{error}</Alert>}

      <Paper elevation={2} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Material</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Purity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Weight (g)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No products found. Add your first product!
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.material}</TableCell>
                    <TableCell>{product.purity}</TableCell>
                    <TableCell>{product.netWeight}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.isActive ? 'Active' : 'Inactive'}
                        color={product.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(product)}
                        sx={{ color: '#1E1B4B', mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(product.id)}
                        sx={{ color: '#d32f2f' }}
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

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Product Name *"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="SKU *"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Category *"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                variant="outlined"
                sx={{ minWidth: '200px' }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Material"
                value={formData.material || ''}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                variant="outlined"
                sx={{ minWidth: '200px' }}
              >
                {materials.map((mat) => (
                  <MenuItem key={mat} value={mat}>
                    {mat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Purity"
                value={formData.purity || ''}
                onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                variant="outlined"
                sx={{ minWidth: '200px' }}
              >
                {purities.map((pur) => (
                  <MenuItem key={pur} value={pur}>
                    {pur}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Net Weight (grams)"
                type="number"
                value={formData.netWeight || ''}
                onChange={(e) => setFormData({ ...formData, netWeight: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Gross Weight (grams)"
                type="number"
                value={formData.grossWeight || ''}
                onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Base Price (₹)"
                type="number"
                value={formData.basePrice || ''}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="HUID Number"
                value={formData.huidNumber || ''}
                onChange={(e) => setFormData({ ...formData, huidNumber: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Stone Details"
                value={formData.stoneDetails || ''}
                onChange={(e) => setFormData({ ...formData, stoneDetails: e.target.value })}
                variant="outlined"
                placeholder="e.g., 0.5 ct Diamond"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Status"
                value={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                variant="outlined"
                sx={{ minWidth: '200px' }}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                Product Images
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                sx={{
                  borderColor: '#1E1B4B',
                  color: '#1E1B4B',
                  '&:hover': { borderColor: '#2D2963', backgroundColor: 'rgba(30, 27, 75, 0.04)' },
                  textTransform: 'none',
                }}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {imagePreview.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                    />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ textTransform: 'none', color: '#666' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#1E1B4B',
              '&:hover': { backgroundColor: '#2D2963' },
              textTransform: 'none',
            }}
          >
            {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
