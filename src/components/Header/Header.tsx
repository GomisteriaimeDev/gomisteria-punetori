import React, { useState } from "react";
import "./Header.scss";
import logo from "../../assets/svg/Logo.svg";
import box from "../../assets/svg/box.svg";
import search from "../../assets/svg/search.svg";
import shoppingBag from "../../assets/svg/shoppingBag.svg";
import arrow from "../../assets/svg/arrow-down.svg";
import rezervo from "../../assets/svg/tabler_reserved-line.svg";
import sherbime from "../../assets/svg/Sherbime.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
interface IDropdownItem {
  label: string;
  icon?: string;
}

interface IDropdownProps {
  label: string;
  items: IDropdownItem[];
  navigate: (path: string) => void;
}

const Dropdown: React.FC<IDropdownProps> = ({ label, items, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = ["/goma", "/fellne", "/aksesore"].some((path) =>
    location.pathname.includes(path)
  );

  const handleItemClick = (path: string) => {
    setIsOpen(false); // Close dropdown on click
    navigate(path);
  };
  return (
    <div className="dropdown-wrapper">
      <div
        className={`dropdown ${isOpen ? "open" : ""} ${
          isActive ? "active" : ""
        }`}
      >
        <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          <img src={box} alt="" /> {label} <img src={arrow} alt="" />
        </button>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path d="M5 0L9.33013 9.75H0.669873L5 0Z" fill="#fff" />
          </svg>
          {items.map((item, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => handleItemClick(`/${item.label.toLowerCase()}`)}
            >
              {item.icon && <img src={item.icon} alt="" />}
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Button: React.FC<{
  label: string;
  img: any;
  to: string;
  navigate: (path: string) => void;
}> = ({ label, img, to, navigate }) => {
  const location = useLocation();

  const isActive = location.pathname === `/${to}`;

  const handleButtonClick = () => {
    navigate(`/${to}`);
  };
  return (
    <a href={`/${to}`} onClick={handleButtonClick}>
      <button className={`action-button ${isActive ? "active" : ""}`}>
        <img src={img} alt="" />
        {label}
      </button>
    </a>
  );
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isOpenUser, setIsOpenUser] = useState(false);
  const { cartCount } = useCart();

  const dropdownItems: IDropdownItem[] = [
    { label: "Fellne" },
    { label: "Goma" },
    { label: "Aksesore" },
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (event: any) => {
    event?.preventDefault();
    navigate(`/search?searchTerm=${encodeURIComponent(searchQuery)}`);
  };
  return (
    <header className="header">
      <div className="header-left">
        <a href="/">
          <img
            src={logo}
            alt="gomisteriaImeLogo"
            style={{ width: 226, height: 40, marginBottom: -6 }}
          />
        </a>
        <div className="header-buttons">
          <Dropdown
            label="Produktet"
            items={dropdownItems}
            navigate={navigate}
          />
          <Button
            label="Shërbimet"
            img={sherbime}
            to="services"
            navigate={navigate}
          />
          <Button
            label="Rezervo"
            img={rezervo}
            to="reservation"
            navigate={navigate}
          />
        </div>
      </div>
      <div className="header-right">
        <form
          onSubmit={handleSearch}
          className="footer-content-right-inside searchaBar-input-container"
        >
          <input
            className="searchBar"
            type="text"
            placeholder="Kërko Produkte"
            onChange={(event: any) => setSearchQuery(event.target.value)}
          />

          <button type="submit" className="searchaBar-label">
            <img src={search} alt="" onClick={handleSearch} />
          </button>
        </form>
        <div className="header-user-actions">
          <a className="header-user" href="/account">
            <img
              className="header-user"
              src="https://s3-alpha-sig.figma.com/img/9ef6/539a/8ec9d8090780e878bc271fe32f04f49a?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kMuxYWeChEJ-ylZzS7sxtRROWSXvpfB2qK6TORd3HBtrQrfIhqsMovK0k2GTL8ZCRJdsmIapUaeDS3~34FEJXU7cIp2TaCsOVZiDj2K1zLHLCR~K4mCzkNGFBkgbH6S66pKvv9LDJB6ZcHSjo7Joc1LHxEXAYzb~d0ue7CObqZsQc8HeGnMsflTPpQHHPIr0AhAf6zU-wvhu5D06PNpLOcrEyvH1j5VOBMHgCFPNFMCCuOfcXSeWHUaKcw48OQrZGyGYML4pYt-mNyPmHtTrMAFZBxrChEoKJHj3HgixN4G7fXCHptQh-4PalBKRZ7eUhZVaOK2orLThIRARfW-Kdg__"
              alt=""
            />
          </a>
          <a href="/cart" className="cart-icon-wrapper">
            <img src={shoppingBag} alt="" className="shoppingBag" />
            {cartCount > 0 && (
              <span className="cart-count-indicator">{cartCount}</span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
