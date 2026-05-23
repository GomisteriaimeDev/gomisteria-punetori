import React from "react";
import "./RegisterSelect.scss";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
import BlueButton from "../../../components/BlueButton/BlueButton";
import RegisterPerson from "../../../assets/svg/RegisterPerson.svg";
import RegisterPeople from "../../../assets/svg/RegisterPeople.svg";
import logo from "../../../assets/svg/Logo.svg";

const RegisterSelect = () => {
  return (
    <div className="registerSelectWrapper">
      <img src={logo} alt="gomisteriaLogo" className="intro-logo" />
      <div className="register-select">
        <div className="register-select-header">Krijoni një llogari</div>
        <div className="register-select-buttons">
          <a href="/register/client" className="register-select-button">
            <OutlineButton>
              <img
                className="register-select-svg"
                src={RegisterPerson}
                alt="registerPersonImage"
              />
              Krijo Llogari Individuale
            </OutlineButton>
          </a>
          <a href="/register/business" className="register-select-button">
            <OutlineButton>
              <img
                className="register-select-svg"
                src={RegisterPeople}
                alt="registerPeopleImage"
              />
              Krijo Llogari Biznesi
            </OutlineButton>
          </a>
          <span className="register-privacy-policy">
            Duke krijuar një llogari, ju pranoni{" "}
            <a href="/privacy-policy">
              Kushtet tona të Politikës së Privatësisë{" "}
            </a>
          </span>
        </div>
        <div className="register-login-button">
          <a href="/login"><BlueButton>Hyr</BlueButton></a>
          <span className="posedon">Posedoni një llogari?</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelect;
