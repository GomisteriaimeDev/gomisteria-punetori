import React from "react";
import logo from "../../../assets/svg/Logo.svg";
import successCheck from "../../../assets/svg/SuccessCheck.svg";
import "./SuccessBusiness.scss"
const SuccessBusiness = () => {
  return (
    <div className="successPageWrapper">
      <img src={logo} alt="gomisteriImeLogo" className="gomisteriaLogoSuccess"/>
      <div className="successPageContent">
        <img src={successCheck} alt="checkmark" />
        <h4 className="successPageText">
          Ju faleminderit që u regjistruat! Dikush nga stafi së shpejti do ta
          konfirmoj biznesin tuaj! <br/><br/> Për vonesa kontakto +38345295665
        </h4>
      </div>
    </div>
  );
};

export default SuccessBusiness;
