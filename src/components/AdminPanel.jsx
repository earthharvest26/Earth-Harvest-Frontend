import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Plus, Edit2, Trash2, Users, ShoppingBag, CreditCard, 
  BarChart3, Save, X, AlertCircle, CheckCircle, TrendingUp, 
  DollarSign, Eye, EyeOff, Ban, Unlock, Filter, Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import Navbar from './Navbar';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orderFilters, setOrderFilters] = useState({ status: '', paymentStatus: '' });
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);
  const [statusUpdateConfirm, setStatusUpdateConfirm] = useState(null);
  
  const [productForm, setProductForm] = useState({
    productName: '',
    brand: 'Earth & Harvest',
    smallDescription: '',
    longDescription: '',
    rating: 0,
    totalReviews: 0,
    soldThisMonth: 0,
    stock: 0,
    images: [''],
    sizes: [{ weight: 0, price: 0, oldPrice: 0, servings: '', pricePerGm: 0 }],
    ingredients: [''],
    features: [{ icon: '', title: '', desc: '' }],
    nutritionFacts: [{ name: '', value: '', bar: 0 }]
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/');
      showToast({
        type: 'error',
        title: 'Access Denied',
        message: 'Admin privileges required'
      });
      return;
    }

    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
    fetchCartCount();
  }, [isAuthenticated, user, navigate, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/admin/products');
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load products'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await apiFetch('/cart');
      if (response.success && response.data) {
        const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
      }
    } catch (error) {
      // Ignore cart errors for admin
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/admin/dashboard');
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard stats'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (filters = null) => {
    try {
      setOrdersLoading(true);
      const params = new URLSearchParams();
      const activeFilters = filters || orderFilters;
      if (activeFilters.status) params.append('status', activeFilters.status);
      if (activeFilters.paymentStatus) params.append('paymentStatus', activeFilters.paymentStatus);
      
      const response = await apiFetch(`/admin/orders?${params.toString()}`);
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load orders'
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      
      const response = await apiFetch(`/admin/users?${params.toString()}`);
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load users'
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus, currentStatus) => {
    // Show confirmation modal
    setStatusUpdateConfirm({ orderId, newStatus, currentStatus });
  };

  const confirmStatusUpdate = async () => {
    if (!statusUpdateConfirm) return;
    
    try {
      const response = await apiFetch(`/admin/orders/${statusUpdateConfirm.orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: statusUpdateConfirm.newStatus })
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Order status updated successfully!'
        });
        fetchOrders();
        setStatusUpdateConfirm(null);
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update order status'
      });
      setStatusUpdateConfirm(null);
    }
  };

  const handleToggleProductStatus = async (productId, currentStatus) => {
    try {
      const response = await apiFetch(`/admin/products/${productId}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled: !currentStatus })
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `Product ${!currentStatus ? 'enabled' : 'disabled'} successfully!`
        });
        fetchProducts();
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update product status'
      });
    }
  };

  const handleToggleUserBlock = async (userId, isBlocked) => {
    try {
      const response = await apiFetch(`/admin/users/${userId}/block`, {
        method: 'PATCH',
        body: JSON.stringify({ isBlocked: !isBlocked })
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `User ${!isBlocked ? 'blocked' : 'unblocked'} successfully!`
        });
        fetchUsers();
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({ ...selectedUser, isBlocked: !isBlocked });
        }
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update user status'
      });
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      setLoadingUserOrders(true);
      const response = await apiFetch(`/admin/users/${userId}`);
      if (response.success) {
        setSelectedUser(response.data.user);
        setUserOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load user details'
      });
    } finally {
      setLoadingUserOrders(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up empty arrays/strings
      const cleanedForm = {
        ...productForm,
        images: productForm.images.filter(img => img.trim() !== ''),
        ingredients: productForm.ingredients.filter(ing => ing.trim() !== ''),
        features: productForm.features.filter(f => f.title.trim() !== ''),
        nutritionFacts: productForm.nutritionFacts.filter(n => n.name.trim() !== ''),
        sizes: productForm.sizes.filter(s => s.weight > 0 && s.price > 0)
      };

      if (editingProduct) {
        // Update product
        const response = await apiFetch(`/admin/products/${editingProduct._id}`, {
          method: 'PUT',
          body: JSON.stringify(cleanedForm)
        });
        
        if (response.success) {
          showToast({
            type: 'success',
            title: 'Success',
            message: 'Product updated successfully!'
          });
          setShowProductForm(false);
          setEditingProduct(null);
          fetchProducts();
        }
      } else {
        // Create product
        const response = await apiFetch('/admin/products', {
          method: 'POST',
          body: JSON.stringify(cleanedForm)
        });
        
        if (response.success) {
          showToast({
            type: 'success',
            title: 'Success',
            message: 'Product created successfully!'
          });
          setShowProductForm(false);
          resetForm();
          fetchProducts();
        }
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to save product'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      productName: '',
      brand: 'Earth & Harvest',
      smallDescription: '',
      longDescription: '',
      rating: 0,
      totalReviews: 0,
      soldThisMonth: 0,
      stock: 0,
      images: [''],
      sizes: [{ weight: 0, price: 0, oldPrice: 0, servings: '', pricePerGm: 0 }],
      ingredients: [''],
      features: [{ icon: '', title: '', desc: '' }],
      nutritionFacts: [{ name: '', value: '', bar: 0 }]
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      productName: product.productName || '',
      brand: product.brand || 'Earth & Harvest',
      smallDescription: product.smallDescription || '',
      longDescription: product.longDescription || '',
      rating: product.rating || 0,
      totalReviews: product.totalReviews || 0,
      soldThisMonth: product.soldThisMonth || 0,
      stock: product.stock || 0,
      images: product.images && product.images.length > 0 ? product.images : [''],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [{ weight: 0, price: 0, oldPrice: 0, servings: '', pricePerGm: 0 }],
      ingredients: product.ingredients && product.ingredients.length > 0 ? product.ingredients : [''],
      features: product.features && product.features.length > 0 ? product.features : [{ icon: '', title: '', desc: '' }],
      nutritionFacts: product.nutritionFacts && product.nutritionFacts.length > 0 ? product.nutritionFacts : [{ name: '', value: '', bar: 0 }]
    });
    setShowProductForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await apiFetch(`/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Product deleted successfully!'
        });
        fetchProducts();
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete product'
      });
    }
  };

  // Show loading or redirect - don't render if not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          {activeTab === 'products' && (
            <button
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#C8945C] text-white rounded-lg hover:bg-[#B8844C] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'products'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            ) : dashboardStats ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#F8F2EC] rounded-xl p-6 border border-[#E8DFD0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-foreground">{dashboardStats.stats?.totalUsers || 0}</p>
                      </div>
                      <Users className="w-12 h-12 text-[#C8945C] opacity-50" />
                    </div>
                  </div>
                  <div className="bg-[#F8F2EC] rounded-xl p-6 border border-[#E8DFD0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                        <p className="text-3xl font-bold text-foreground">{dashboardStats.stats?.totalProducts || 0}</p>
                      </div>
                      <Package className="w-12 h-12 text-[#C8945C] opacity-50" />
                    </div>
                  </div>
                  <div className="bg-[#F8F2EC] rounded-xl p-6 border border-[#E8DFD0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-foreground">{dashboardStats.stats?.totalOrders || 0}</p>
                      </div>
                      <ShoppingBag className="w-12 h-12 text-[#C8945C] opacity-50" />
                    </div>
                  </div>
                  <div className="bg-[#F8F2EC] rounded-xl p-6 border border-[#E8DFD0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-foreground">AED {dashboardStats.stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-[#C8945C] opacity-50" />
                    </div>
                  </div>
                </div>

                {/* Pending Orders Alert */}
                {dashboardStats.stats?.pendingOrders > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-yellow-900">Pending Orders</p>
                      <p className="text-sm text-yellow-700">{dashboardStats.stats.pendingOrders} orders require attention</p>
                    </div>
                  </div>
                )}

                {/* Recent Orders */}
                <div className="bg-[#F8F2EC] rounded-xl p-6 border border-[#E8DFD0]">
                  <h3 className="text-xl font-bold text-foreground mb-4">Recent Orders</h3>
                  {dashboardStats.recentOrders?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardStats.recentOrders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg p-4 border border-[#E8DFD0]">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Order #{order._id?.toString().slice(-8).toUpperCase()}</p>
                              <p className="text-sm text-muted-foreground">{order.user?.name || order.user?.email || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{order.product?.productName || 'Product'}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.orderStatus === 'Confirmed' || order.orderStatus === 'Shipped'
                                ? 'bg-green-100 text-green-700'
                                : order.orderStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {order.orderStatus || 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent orders</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#F8F2EC] rounded-2xl p-12 text-center border border-[#E8DFD0]">
                <p className="text-muted-foreground">Failed to load dashboard data</p>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {loading && !showProductForm ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : showProductForm ? (
              <ProductForm
                productForm={productForm}
                setProductForm={setProductForm}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                loading={loading}
                editing={!!editingProduct}
              />
            ) : (
              <div className="grid gap-4">
                {products.length === 0 ? (
                  <div className="bg-[#F8F2EC] rounded-2xl p-12 text-center border border-[#E8DFD0]">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No products found</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowProductForm(true);
                      }}
                      className="px-4 py-2 bg-[#C8945C] text-white rounded-lg hover:bg-[#B8844C] transition-colors"
                    >
                      Create First Product
                    </button>
                  </div>
                ) : (
                  products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#F8F2EC] rounded-2xl p-6 border border-[#E8DFD0]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">{product.productName}</h3>
                          <p className="text-muted-foreground mb-4">{product.smallDescription}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-foreground">Stock: <strong>{product.stock}</strong></span>
                            <span className="text-foreground">Sizes: <strong>{product.sizes?.length || 0}</strong></span>
                            <span className="text-foreground">Rating: <strong>{product.rating || 0}</strong></span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleProductStatus(product._id, product.enabled !== false)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.enabled === false
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-yellow-500 text-white hover:bg-yellow-600'
                            }`}
                            title={product.enabled === false ? 'Enable Product' : 'Disable Product'}
                          >
                            {product.enabled === false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-[#F8F2EC] rounded-xl p-4 border border-[#E8DFD0]">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Order Status</label>
                  <select
                    value={orderFilters.status}
                    onChange={(e) => {
                      const newFilters = { ...orderFilters, status: e.target.value };
                      setOrderFilters(newFilters);
                      fetchOrders(newFilters);
                    }}
                    className="w-full border-2 border-[#E8DFD0] p-2 rounded-lg bg-white focus:border-[#C8945C] focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Payment Status</label>
                  <select
                    value={orderFilters.paymentStatus}
                    onChange={(e) => {
                      const newFilters = { ...orderFilters, paymentStatus: e.target.value };
                      setOrderFilters(newFilters);
                      fetchOrders(newFilters);
                    }}
                    className="w-full border-2 border-[#E8DFD0] p-2 rounded-lg bg-white focus:border-[#C8945C] focus:outline-none"
                  >
                    <option value="">All Payments</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      const clearedFilters = { status: '', paymentStatus: '' };
                      setOrderFilters(clearedFilters);
                      fetchOrders(clearedFilters);
                    }}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#F8F2EC] rounded-2xl p-12 text-center border border-[#E8DFD0]">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-[#F8F2EC] rounded-xl p-6 border border-[#E8DFD0]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-foreground">
                            Order #{order._id?.toString().slice(-8).toUpperCase()}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.orderStatus === 'Confirmed' || order.orderStatus === 'Shipped'
                              ? 'bg-green-100 text-green-700'
                              : order.orderStatus === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {order.orderStatus || 'Pending'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === 'Completed'
                              ? 'bg-blue-100 text-blue-700'
                              : order.paymentStatus === 'Failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Payment: {order.paymentStatus || 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Customer: {order.user?.name || order.user?.email || 'Unknown'}
                        </p>
                        {order.product && (
                          <p className="text-sm text-foreground">
                            {order.product.productName || 'Product'} - {order.sizeSelected}g × {order.quantity}
                          </p>
                        )}
                        <p className="text-lg font-bold text-[#C8945C] mt-2">
                          AED {order.amountPaid || '0.00'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date not available'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground">Update Status:</label>
                        <select
                          value={order.orderStatus || 'Pending'}
                          onChange={(e) => {
                            if (e.target.value !== order.orderStatus) {
                              handleOrderStatusUpdate(order._id, e.target.value, order.orderStatus);
                            }
                          }}
                          className="border-2 border-[#E8DFD0] p-2 rounded-lg bg-white focus:border-[#C8945C] focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-[#F8F2EC] rounded-xl p-4 border border-[#E8DFD0]">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setTimeout(fetchUsers, 300);
                    }}
                    className="w-full pl-10 border-2 border-[#E8DFD0] p-2 rounded-lg bg-white focus:border-[#C8945C] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Users List */}
            {usersLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-[#F8F2EC] rounded-2xl p-12 text-center border border-[#E8DFD0]">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="bg-[#F8F2EC] rounded-xl p-6 border border-[#E8DFD0]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-foreground">{user.name || 'Unknown'}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role || 'user'}
                          </span>
                          {user.isBlocked && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              Blocked
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Email: {user.email}</p>
                        {user.phoneNumber && (
                          <p className="text-sm text-muted-foreground">
                            Phone: {user.countryCode || ''} {user.phoneNumber}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewUserDetails(user._id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleToggleUserBlock(user._id, user.isBlocked)}
                          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                            user.isBlocked
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {user.isBlocked ? (
                            <>
                              <Unlock className="w-4 h-4" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Ban className="w-4 h-4" />
                              Block
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">User Details</h2>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setUserOrders([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">User Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold">{selectedUser.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-semibold">{selectedUser.role || 'user'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className={`font-semibold ${selectedUser.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Order History</h3>
                  {loadingUserOrders ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No orders found</p>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order._id} className="bg-[#F8F2EC] rounded-xl p-4 border border-[#E8DFD0]">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold">Order #{order._id?.toString().slice(-8).toUpperCase()}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.orderStatus === 'Confirmed' || order.orderStatus === 'Shipped'
                                ? 'bg-green-100 text-green-700'
                                : order.orderStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {order.orderStatus || 'Pending'}
                            </span>
                          </div>
                          {order.product && (
                            <p className="text-sm text-foreground mb-1">
                              {order.product.productName} - {order.sizeSelected}g × {order.quantity}
                            </p>
                          )}
                          <p className="text-lg font-bold text-[#C8945C]">AED {order.amountPaid || '0.00'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Update Confirmation Modal */}
        {statusUpdateConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Confirm Status Update</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to update order status from <strong>{statusUpdateConfirm.currentStatus}</strong> to <strong>{statusUpdateConfirm.newStatus}</strong>?
                {statusUpdateConfirm.newStatus !== 'Pending' && (
                  <span className="block mt-2 text-sm">An email notification will be sent to the customer.</span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStatusUpdateConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusUpdate}
                  className="flex-1 px-4 py-2 bg-[#C8945C] text-white rounded-lg hover:bg-[#B8844C] transition-colors font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ productForm, setProductForm, onSubmit, onCancel, loading, editing }) => {
  const addSize = () => {
    setProductForm({
      ...productForm,
      sizes: [...productForm.sizes, { weight: 0, price: 0, oldPrice: 0, servings: '', pricePerGm: 0 }]
    });
  };

  const removeSize = (index) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.filter((_, i) => i !== index)
    });
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...productForm.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setProductForm({ ...productForm, sizes: newSizes });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="bg-[#F8F2EC] rounded-2xl p-6 sm:p-8 border border-[#E8DFD0] space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {editing ? 'Edit Product' : 'Create New Product'}
      </h2>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Product Name *</label>
          <input
            type="text"
            required
            value={productForm.productName}
            onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Brand</label>
          <input
            type="text"
            value={productForm.brand}
            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Short Description *</label>
        <textarea
          required
          value={productForm.smallDescription}
          onChange={(e) => setProductForm({ ...productForm, smallDescription: e.target.value })}
          rows={2}
          className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Long Description</label>
        <textarea
          value={productForm.longDescription}
          onChange={(e) => setProductForm({ ...productForm, longDescription: e.target.value })}
          rows={4}
          className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
        />
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={productForm.rating}
            onChange={(e) => setProductForm({ ...productForm, rating: parseFloat(e.target.value) || 0 })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Total Reviews</label>
          <input
            type="number"
            min="0"
            value={productForm.totalReviews}
            onChange={(e) => setProductForm({ ...productForm, totalReviews: parseInt(e.target.value) || 0 })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Sold This Month</label>
          <input
            type="number"
            min="0"
            value={productForm.soldThisMonth}
            onChange={(e) => setProductForm({ ...productForm, soldThisMonth: parseInt(e.target.value) || 0 })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Stock *</label>
          <input
            type="number"
            required
            min="0"
            value={productForm.stock}
            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
            className="w-full border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Images (URLs)</label>
        {productForm.images.map((img, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Image URL"
              value={img}
              onChange={(e) => {
                const newImages = [...productForm.images];
                newImages[index] = e.target.value;
                setProductForm({ ...productForm, images: newImages });
              }}
              className="flex-1 border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
            />
            {productForm.images.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setProductForm({
                    ...productForm,
                    images: productForm.images.filter((_, i) => i !== index)
                  });
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
        >
          + Add Image
        </button>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Sizes *</label>
        {productForm.sizes.map((size, index) => (
          <div key={index} className="grid md:grid-cols-5 gap-2 mb-2 p-4 bg-white rounded-xl border border-[#E8DFD0]">
            <input
              type="number"
              placeholder="Weight (lbs)"
              required
              value={size.weight || ''}
              onChange={(e) => updateSize(index, 'weight', parseFloat(e.target.value) || 0)}
              className="border-2 border-[#E8DFD0] p-2 rounded-lg focus:border-[#C8945C] focus:outline-none"
            />
            <input
              type="number"
              placeholder="Price"
              required
              step="0.01"
              value={size.price || ''}
              onChange={(e) => updateSize(index, 'price', parseFloat(e.target.value) || 0)}
              className="border-2 border-[#E8DFD0] p-2 rounded-lg focus:border-[#C8945C] focus:outline-none"
            />
            <input
              type="number"
              placeholder="Old Price"
              step="0.01"
              value={size.oldPrice || ''}
              onChange={(e) => updateSize(index, 'oldPrice', parseFloat(e.target.value) || 0)}
              className="border-2 border-[#E8DFD0] p-2 rounded-lg focus:border-[#C8945C] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Servings"
              value={size.servings || ''}
              onChange={(e) => updateSize(index, 'servings', e.target.value)}
              className="border-2 border-[#E8DFD0] p-2 rounded-lg focus:border-[#C8945C] focus:outline-none"
            />
            {productForm.sizes.length > 1 && (
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
        >
          + Add Size
        </button>
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Ingredients</label>
        {productForm.ingredients.map((ing, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Ingredient name"
              value={ing}
              onChange={(e) => {
                const newIngredients = [...productForm.ingredients];
                newIngredients[index] = e.target.value;
                setProductForm({ ...productForm, ingredients: newIngredients });
              }}
              className="flex-1 border-2 border-[#E8DFD0] p-3 rounded-xl bg-white focus:border-[#C8945C] focus:outline-none"
            />
            {productForm.ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setProductForm({
                    ...productForm,
                    ingredients: productForm.ingredients.filter((_, i) => i !== index)
                  });
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setProductForm({ ...productForm, ingredients: [...productForm.ingredients, ''] })}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
        >
          + Add Ingredient
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-[#C8945C] text-white rounded-xl hover:bg-[#B8844C] transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {editing ? 'Update Product' : 'Create Product'}
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default AdminPanel;

