import React from "react";
import "./AddToCart.scss";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

interface AddToCartProps {
  productId: string;
  category: string;
  quantity?: number;
}

const AddToCart: React.FC<AddToCartProps> = ({
  productId,
  category,
  quantity,
}) => {
  const { addItem } = useCart();
  const { currentUser } = useAuth();
  const handleClick = () => {
    const finalQuantity =
      quantity ?? (category === "goma" || category === "fellne" ? 4 : 1);

    if (currentUser) {
      addItem(currentUser.id, productId, finalQuantity);
    } else {
      console.error(
        "User ID not found or addItemToCart method is not available"
      );
    }
  };

  return (
    <button className="blueButtonComponent" onClick={handleClick}>
      Shto në shportë
    </button>
  );
};

export default AddToCart;
