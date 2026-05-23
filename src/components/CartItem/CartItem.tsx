// CartItem.tsx
import React, { useState } from "react";
import "./CartItem.scss"; // Ensure this SCSS file is structured to style the component appropriately
import { ICartItem } from "../../utils/Types"; // Adjust the import to the new interface
import cancel from "../../assets/svg/serviceCartBoxCancel.svg";
import { useCart } from "../../context/CartContext";

interface CartItemProps {
  item: ICartItem;
  onQuantityChange: (itemId: string, newQuantity: number) => void; // Add this to communicate changes
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange }) => {
  const { removeItem } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleDecrement = () => {
    if (item?.product?.category === "aksesore") {
      const newQuantity = quantity - 1;
      if (newQuantity >= 1) {
        setQuantity(newQuantity);
        onQuantityChange(item.id, newQuantity);
      }
    } else {
      const newQuantity = quantity - 4;
      if (newQuantity >= 4) {
        setQuantity(newQuantity);
        onQuantityChange(item.id, newQuantity);
      }
    }
  };

  const handleIncrement = () => {
    if (item?.product?.category === "aksesore") {
      const newQuantity = quantity + 1;
      if (newQuantity >= 1) {
        setQuantity(newQuantity);
        onQuantityChange(item.id, newQuantity);
      }
    } else {
      const newQuantity = quantity + 4;
      if (newQuantity >= 4) {
        setQuantity(newQuantity);
        onQuantityChange(item.id, newQuantity);
      }
    }
  };
  const handleRemove = () => {
    removeItem(item.id);
  };
  const salePercentage =
    item.product.salePrice > 0
      ? Math.round(
          ((item.product.price - item.product.salePrice) / item.product.price) *
            100
        )
      : 0;
  return (
    <div className="cart-box">
      <div className="cart-box-left">
        <div className="cart-item-image">
          {salePercentage > 0 && (
            <span className="sale">{salePercentage}%</span>
          )}
          <img src={item.product.images[0].url} alt={item.product.name} />{" "}
        </div>
        <div className="cart-box-left-details">
          <div className="cart-item-description">
            <h5>{item.product.name}</h5>
            <p>
              Marka: <span>{item.product.marka}</span>
            </p>
            <p>
              Kategoria: <span>{item.product.category}</span>
            </p>
          </div>
          <div className="cart-box-counter">
            <p>Sasia: </p>
            <button onClick={handleDecrement}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrement}>+</button>
          </div>
        </div>
      </div>
      <div className="cart-box-right">
        <div className="cart-remove-button" onClick={handleRemove}>
          <img src={cancel} alt="Remove" />
          <span>Largo Produktin</span>
        </div>
        <div className="cart-total">
          {item.product.salePrice ? (
            <h5 className="strikethrough">
              {item.product.salePrice ? item.product?.price.toFixed(2) : null}€
            </h5>
          ) : null}
          <h3>
            {" "}
            {item.product.salePrice
              ? item.product?.salePrice.toFixed(2)
              : item.product?.price.toFixed(2)}
            €
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
