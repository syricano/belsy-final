import { createContext, useContext, useEffect, useState } from 'react';
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from '@/data/cart';
import { errorHandler } from '@/utils';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    subtotalGross: 0,
    subtotalNet: 0,
    subtotalVat: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      errorHandler(err, 'Failed to load cart');
      setCart({ items: [], total: 0, subtotalGross: 0, subtotalNet: 0, subtotalVat: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addItem = async (menuId, quantity = 1) => {
    try {
      const data = await addCartItem(menuId, quantity);
      setCart(data);
    } catch (err) {
      errorHandler(err, 'Failed to add item');
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const data = await updateCartItem(itemId, quantity);
      setCart(data);
    } catch (err) {
      errorHandler(err, 'Failed to update item');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const data = await removeCartItem(itemId);
      setCart(data);
    } catch (err) {
      errorHandler(err, 'Failed to remove item');
    }
  };

  const clear = async () => {
    try {
      await clearCart();
      setCart({ items: [], total: 0, subtotalGross: 0, subtotalNet: 0, subtotalVat: 0 });
    } catch (err) {
      errorHandler(err, 'Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, clear, reload: loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartProvider;
