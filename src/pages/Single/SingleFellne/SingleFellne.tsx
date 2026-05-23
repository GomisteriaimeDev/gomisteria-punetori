import React, { ChangeEvent, useEffect, useState } from "react";
import "./SingleFellne.scss";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import guma from "../../../assets/images/guma.png";
import BlueButton from "../../../components/BlueButton/BlueButton";
import map from "../../../assets/images/map.png";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
import ProductItem from "../../../components/ProductItem/ProductItem";
import useFetchData, {
  getProductsByCategory,
  getProductsById,
} from "../../../services/api";
import { useParams } from "react-router-dom";
import capitalize from "../../../utils/Capitalize";
import Loader from "../../../components/Loader";

const SingleFellne = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>({});
  const [quantity, setQuanitity] = useState(4);
  const [activeImage, setActiveImage] = useState("");
  const { id: productId } = useParams();
  // const { data: products, isLoading: isLoadingRelated } = useFetchData(
  //   getProductsByCategory,
  //   "fellne",
  //   1,
  //   6
  // );

  const fetchProduct = async () => {
    const res = await getProductsById(productId);
    setProduct(res);

    setIsLoading(false);
    setActiveImage(res.images[0].url);
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
  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
  };
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
                  <img
                    src={activeImage || product?.images[0]?.url}
                    alt="tyre"
                  />

                  {salePercentage > 0 && (
                    <span className="sale">{salePercentage}%</span>
                  )}
                </div>
                <div className="small-images">
                  {product?.images?.map((image: any, index: any) => (
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
                <div>
                  <div className="product-title">
                    <h5>{product?.name}</h5>
                    <p>Gomisteriaime</p>
                  </div>
                  <div className="product-specs-fellne">
                    <h5>Zgjidh dimenzionin</h5>
                    <div className="product-dimension-selection">
                      {product?.details?.map((data: any, index: any) => (
                        <label key={index}>
                          <input
                            type="radio"
                            name="sizeLeft"
                            value={data?.dimenzioni}
                            onChange={handleRadioChange}
                          />
                          <span>{data?.dimenzioni}"</span>
                        </label>
                      ))}
                    </div>
                  </div>
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
                  <BlueButton>Shto në shportë</BlueButton>
                </div>
              </div>
            </div>

            <div className="product-goma-description">
              <div className="singleFellneCard">
                <table className="fellenTable">
                  <tr className="fellneTr">
                    <th className="fellneTh">
                      <p>Gjerësia</p>
                    </th>
                    <th className="fellneTh">
                      <p>ET</p>
                    </th>
                    <th className="fellneTh">
                      <p>CB</p>
                    </th>
                    <th className="fellneTh">
                      <p>H/PCD</p>
                    </th>
                    <th className="fellneTh">
                      <p>Ngjyra</p>
                    </th>
                  </tr>
                  {product?.details?.map((data: any, index: any) => (
                    <tr className="fellneTr" key={index}>
                      <td className="fellneTd">
                        <span>{data?.gjeresia}"</span>
                      </td>
                      <td className="fellneTd">
                        <span>{data?.et}</span>
                      </td>
                      <td className="fellneTd">
                        <span>{data?.cb}</span>
                      </td>
                      <td className="fellneTd">
                        <span>{data?.hpcd}</span>
                      </td>
                      <td className="fellneTd">
                        <span>{data?.ngjyra}</span>
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
              <p className="fellne-table-desc">
                Fellnet janë në stok tani dhe kerkojmë nga ju që pas pagesës së
                tyre me ardh me i tërhjek menjëher!{" "}
              </p>
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
          <div className="single-more-products-list">
            {/* {mockProductItems.items.map((data: any) => (
              <ProductItem key={data.id} productData={data} />
            ))} */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SingleFellne;
