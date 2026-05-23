import React from "react";
import "./ProductItem.scss";

import capitalize from "../../utils/Capitalize";
import AddToCart from "../AddToCart/AddToCart";
const ProductItem = ({ productData }: any) => {
  return (
    <div className="product-item">
      <a href={`/${productData?.category.toLowerCase()}/${productData?.id}`}>
        <img
          src={productData?.images[0]?.url}
          alt=""
          className="product-image"
        />
      </a>
      <div className="product-item-content">
        <a href={`/${productData?.category.toLowerCase()}/${productData?.id}`}>
          <div className="item-content-header">
            <h5>{productData?.name}</h5>
            <div className="item-content-text">
              <p>
                Marka: <span>{productData?.marka}</span>
              </p>
              <p>
                Kategoria: <span>{capitalize(productData?.category)}</span>
              </p>
            </div>
          </div>
        </a>
        <div className="product-item-bottom">
          <h3>
            {productData.salePrice
              ? productData?.salePrice.toFixed(2)
              : productData?.price.toFixed(2)}
            €/copë
          </h3>
          <AddToCart
            productId={productData?.id}
            category={productData?.category}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
