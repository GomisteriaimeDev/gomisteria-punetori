import React, { useEffect, useState } from "react";
import "./SingleGoma.scss";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import map from "../../../assets/images/map.png";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
import ProductItem from "../../../components/ProductItem/ProductItem";
import useFetchData, {
  getProductsByCategory,
  getProductsById,
} from "../../../services/api";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import capitalize from "../../../utils/Capitalize";
import AddToCart from "../../../components/AddToCart/AddToCart";

const SingleGoma = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>({});
  const [quantity, setQuanitity] = useState(4);
  const [activeImage, setActiveImage] = useState("");
  const { id: productId } = useParams();
  const { data: products, isLoading: isLoadingRelated } = useFetchData(
    getProductsByCategory,
    "goma",
    1,
    6
  );

  const fetchProduct = async () => {
    const res = await getProductsById(productId);
    setProduct(res);

    setIsLoading(false);
  };

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  const handleDecrement = () => {
    if (quantity > 4) {
      setQuanitity(quantity - 4);
    }
  };

  const handleIncrement = () => {
    setQuanitity(quantity + 4);
  };
  const handleImageClick = (imageUrl: string) => {
    setActiveImage(imageUrl);
  };

  const salePercentage =
    product.price > 0 && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <div>
      <Header />
      <div className="single-goma-wrapper">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="single-goma-details">
            <div className="product-left">
              <div className="product-images">
                <div className="main-image">
                  <img src={activeImage || product?.images[0].url} alt="tyre" />
                  {salePercentage > 0 && (
                    <span className="sale">{salePercentage}%</span>
                  )}
                </div>
                <div className="small-images">
                  {product?.images.map((image: any, index: any) => (
                    <div
                      className="small-image"
                      key={index}
                      onClick={() => handleImageClick(image.url)}
                    >
                      <img src={image?.url} alt="tyre" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="product-details">
                <div className="product-title">
                  <h5>{product?.name}</h5>
                  <p>Gomisteriaime</p>
                </div>
                <div className="product-specs">
                  <ul>
                    <li>
                      Marka: <span>{product?.marka}</span>
                    </li>
                    <li>
                      Kategoria: <span>{capitalize(product?.category)}</span>
                    </li>
                    <li>
                      Madhesia Gomës:{" "}
                      <span>{product?.details?.madhesiaGomes}</span>
                    </li>
                    <li>
                      Sezona: <span>{product?.details?.sezona}</span>
                    </li>
                    <li>
                      Indeksi i ngaerkesës:{" "}
                      <span>{product?.details?.indeksiNgarkeses}</span>
                    </li>
                    <li>
                      Indeksi i shpejtësisë:{" "}
                      <span>{product?.details?.indeksiShpejtesise}</span>
                    </li>
                  </ul>
                </div>
                <div className="product-actions">
                  <div className="product-prices">
                    <h5 className="strikethrough">
                      {product.salePrice ? product?.price.toFixed(2) : null}€
                    </h5>
                    <h3>
                      {" "}
                      {product.salePrice
                        ? product?.salePrice.toFixed(2)
                        : product?.price.toFixed(2)}
                      €
                    </h3>
                  </div>
                  <div className="product-box-counter">
                    <p>Sasia: </p>
                    <button onClick={handleDecrement}>-</button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrement}>+</button>
                  </div>
                  <AddToCart
                    productId={product?.id}
                    category={product?.category}
                    quantity={quantity}
                  />
                </div>
              </div>
            </div>

            <div className="product-goma-description">
              <div className="product-goma-description-item">
                <h6>Konsumi i karburantit</h6>
                <p>{product?.details?.konsumiKarburantit}</p>
              </div>
              <div className="product-goma-description-item">
                <h6>Në terrene të vështira:</h6>
                <p>{product?.details?.terrenVeshtire}</p>
              </div>
              <div className="product-goma-description-item">
                <h6>Niveli i zhurmës</h6>
                <p>{product?.details?.zhurma}</p>
              </div>
            </div>
          </div>
        )}

        <div className="single-page-map">
          <h5>Gjeni dyqanin më të afërt</h5>
          <img src={map} alt="" />
        </div>
        <div className="single-more-products">
          <div className="single-more-products-actions">
            <h2>Më të shiturat</h2>
            <a href="/goma">
              <OutlineButton>Të gjitha produktet</OutlineButton>
            </a>
          </div>
          {isLoadingRelated ? (
            <Loader />
          ) : (
            <div className="single-more-products-list">
              {products.data.map((product: any) => (
                <ProductItem key={product.id} productData={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SingleGoma;
