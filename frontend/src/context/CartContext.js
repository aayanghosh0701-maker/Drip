import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, color, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.product === product._id && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map((i) =>
          i.product === product._id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        size,
        color,
        quantity,
      }];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCart((prev) =>
      prev.filter((i) => !(i.product === productId && i.size === size && i.color === color))
    );
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) return removeFromCart(productId, size, color);
    setCart((prev) =>
      prev.map((i) =>
        i.product === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
