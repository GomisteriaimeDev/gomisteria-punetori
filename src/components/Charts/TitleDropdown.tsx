import React, { useState } from "react";

const TitleDropdown = ({ title, onChange }: any) => {
  return (
    <div className="title-dropdown">
      <h6>{title}</h6>
    </div>
  );
};

export default TitleDropdown;
