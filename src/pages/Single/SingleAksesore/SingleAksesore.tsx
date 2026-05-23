import React, { useState } from "react";
import "./SingleAksesore.scss";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import guma from "../../../assets/images/guma.png";
import BlueButton from "../../../components/BlueButton/BlueButton";
import map from "../../../assets/images/map.png";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
import ProductItem from "../../../components/ProductItem/ProductItem";

const mockProductItems = {
  currentPage: 1,
  itemsPerPage: 6,
  totalItems: 12, // Adjust based on the total number of items you have
  totalPages: Math.ceil(12 / 6), // Calculate total pages based on items
  items: [
    {
      id: 1,
      name: "245/45R19 SC-5 CONTI",
      brand: "Continental",
      category: "Goma",
      price: "112.50€/copë",
      image: guma,
    },
    {
      id: 2,
      name: "255/40R20 PZ4 SPORT",
      brand: "Pirelli",
      category: "Goma",
      price: "150.00€/copë",
      image: guma,
    },
    {
      id: 3,
      name: "225/50R17 TURANZA T005",
      brand: "Bridgestone",
      category: "Goma",
      price: "95.75€/copë",
      image: guma,
    },
    {
      id: 4,
      name: "245/45R19 SC-5 CONTI",
      brand: "Continental",
      category: "Goma",
      price: "112.50€/copë",
      image: guma,
    },
  ],
};
const SingleAksesore = () => {
  const [quantity, setQuanitity] = useState(4);

  const handleDecrement = () => {
    if (quantity > 1) {
      // Assuming you can't have less than 1 person
      setQuanitity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuanitity(quantity + 1);
  };
  return (
    <div>
      <Header />
      <div className="single-goma-wrapper">
        <div className="single-goma-details">
          <div className="product-left">
            <div className="product-images">
              <div className="main-image">
                <img src={guma} alt="tyre" />
              </div>
              <div className="small-images">
                <div className="small-image">
                  <img src={guma} alt="tyre" />
                </div>
                <div className="small-image">
                  <img src={guma} alt="tyre" />
                </div>
                <div className="small-image">
                  <img src={guma} alt="tyre" />
                </div>
              </div>
            </div>
            <div className="product-details">
              <div className="product-title">
                <h5>245/45R19 SC-5 CONTINENTAL</h5>
                <p>Gomisteriaime</p>
                <p>RATING</p>
              </div>
              <div className="product-specs">
                <ul>
                  <li>
                    Marka: <span>Continental</span>
                  </li>
                  <li>
                    Kategoria: <span>Goma</span>
                  </li>
                  <li>
                    Madhesia Gomës: <span>245/45R19</span>
                  </li>
                  <li>
                    Sezona: <span>Verore</span>
                  </li>
                  <li>
                    Indeksi i ngaerkesës: <span>91</span>
                  </li>
                  <li>
                    Indeksi i shpejtësisë: <span>H</span>
                  </li>
                </ul>
              </div>
              <div className="product-actions">
                <div className="product-prices">
                  <h5 className="strikethrough">493.00€</h5>
                  <h3>345.10€</h3>
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
            <div className="product-goma-description-item">
              <h6>Konsumi i karburantit</h6>
              <p>
                Bazuar në Rregulloren e BE-së (EC) Nr 1222/2009 të datës 1
                nëntor 2012, të gjitha gomat e shitura në Evropë duhet të kenë
                një etiketë zyrtare evropiane. Ky etiketë është 3 informacione:{" "}
                <br />
                <br />A (konsumi minimal) deri në G (konsumi maksimal)
              </p>
            </div>
            <div className="product-goma-description-item">
              <h6>Në terrene të vështira:</h6>
              <p>
                A (distanca më e shkurtër e ndalimit) deri në G (distanca më e
                gjatë e ndalimit)
              </p>
            </div>
            <div className="product-goma-description-item">
              <h6>Niveli i zhurmës</h6>
              <p>1 (më e lehtë), 2 (mesatare) 3 (më e zhurmshme)</p>
            </div>
          </div>
        </div>
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
            {mockProductItems.items.map((data: any) => (
              <ProductItem key={data.id} productData={data} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SingleAksesore;
