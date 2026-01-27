import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Package, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import Navbar from './Navbar';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, showToast } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      showToast({
        type: 'error',
        title: 'Login Required',
        message: 'Please login to view your cart'
      });
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/cart');
      if (response.success) {
        setCart(response.data);
        const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load cart'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    try {
      setUpdating(itemId);
      const response = await apiFetch('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ itemId, quantity: newQuantity })
      });

      if (response.success) {
        setCart(response.data);
        const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Cart updated'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update cart'
      });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdating(itemId);
      const response = await apiFetch(`/cart/item/${itemId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        setCart(response.data);
        const totalItems = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Item removed from cart'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to remove item'
      });
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    
    return cart.items.reduce((total, item) => {
      if (!item.product || !item.product.sizes) return total;
      const size = item.product.sizes.find(s => 
        s.weight.toString() === item.size || s.weight === item.size
      );
      if (!size) return total;
      return total + (size.price * item.quantity);
    }, 0);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 pt-24">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/product"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-[#C8945C]" />
            Shopping Cart
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-[#F8F2EC] rounded-2xl p-12 text-center border border-[#E8DFD0]">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">Your cart is empty</p>
            <p className="text-muted-foreground text-sm mb-6">Start shopping to add items to your cart!</p>
            <Link
              to="/product"
              className="inline-block bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const size = item.product?.sizes?.find(s => 
                  s.weight.toString() === item.size || s.weight === item.size
                );
                const itemPrice = size?.price || 0;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#F8F2EC] rounded-xl p-6 border border-[#E8DFD0]"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.productName}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1">
                          {item.product?.productName || 'Product'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Size: {item.size}g
                        </p>
                        <p className="text-lg font-bold text-[#C8945C] mb-4">
                          AED {itemPrice.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border-2 border-[#E8DFD0] rounded-lg">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={updating === item._id}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={updating === item._id}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            disabled={updating === item._id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <div className="ml-auto text-right">
                            <p className="text-lg font-bold text-foreground">
                              AED {itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-[#F8F2EC] rounded-xl p-6 border border-[#E8DFD0] sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>AED {calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="border-t border-[#E8DFD0] pt-3">
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-[#C8945C]">AED {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/product"
                  className="block w-full bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white text-center py-3 rounded-xl font-semibold hover:shadow-lg transition-all mb-3"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

