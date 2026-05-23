import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

// Assuming CartItem and Cart structure based on your initial setup
interface CartItem {
  product?: any;
  id: string;
  name: string;
  quantity: number;
  
}

interface Cart {
  id?:string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart;
  cartCount: number;
  getCart: (userId: string) => Promise<void>;
  addItem: (
    userId: string,
    productId: string,
    quantity: number
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [cartCount, setCartCount] = useState<number>(0);

  // Dynamically calculate cart count
  useEffect(() => {
    const newCount = cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(newCount);
  }, [cart]);

  // Fetch cart data
  const getCart = async (userId: string) => {
    try {
      const { data } = await axios.get(
        `https://gomisteria-api.onrender.com/api/cart/${userId}`
      );
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      getCart(userId);
    }
  }, []);
  // Add item to cart
  const addItem = async (
    userId: string,
    productId: string,
    quantity: number
  ) => {
    try {
      await axios.post("https://gomisteria-api.onrender.com/api/cart/items", {
        userId,
        productId,
        quantity,
      });
      getCart(userId); // Optionally refresh cart data after adding
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      await axios.delete(`https://gomisteria-api.onrender.com/api/cart/items/${itemId}`);
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item.id !== itemId),
      })); // Optimistically update UI without re-fetching
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Update item quantity in cart
  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      await axios.patch(`https://gomisteria-api.onrender.com/api/cart/items/${itemId}`, {
        quantity,
      });
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      })); // Optimistically update UI without re-fetching
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        getCart,
        addItem,
        removeItem,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;
