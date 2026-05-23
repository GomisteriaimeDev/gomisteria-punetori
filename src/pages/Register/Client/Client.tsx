import React, { useState } from "react";
import "./Client.scss";
import logo from "../../../assets/svg/Logo.svg";
import FormWrapper from "../../../components/Form/Form";
import FormInput from "../../../components/FormInput/FormInput";
import BlueButton from "../../../components/BlueButton/BlueButton";
import CustomSelect from "../../../components/FormSelect/FormSelect";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
import axios from "axios";

const Client = () => {
  const [modifiedData, setModifiedData] = useState({
    fullName: "",
    email: "",
    country: "",
    city: "",
    address: "",
    password: "",
    phone: "",
  });
  const handlePhoneNumberChange = (phoneNumber: string) => {
    modifiedData.phone = phoneNumber;
  };
  const handleClient = async ({ event }: any) => {
    event.preventDefault();

    const {
      fullName,
      email,
      address,
      password,
      country,
      city,
      phone,
      ...rest
    } = modifiedData;

    const dataToSend = {
      email,
      password,
      specialFields: {
        fullName,
        address,
        country,
        city,
        phone,
        ...rest,
      },
    };

    try {
      await axios.post(
        "https://gomisteria-api.onrender.com/api/users/registerClient",
        dataToSend
      );
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setModifiedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const countryData = ["Kosovo", "Albania", "North Macedonia"];
  const cityData = ["Prihtina", "Peja", "Mitrovica"];
  return (
    <div className="clientWrapper">
      <img src={logo} alt="gomisteriaLogo" />
      <FormWrapper onSubmit={handleClient} title="Krijoni një llogari">
        <div className="client-inputs">
          <FormInput
            placeholder="Emri i Plotë"
            type={"text"}
            onChange={handleChange}
            name="fullName"
          />
          <FormInput
            placeholder="Email Adresa"
            type={"email"}
            onChange={handleChange}
            name="email"
          />
          <div className="client-selections">
            <div className="selection">
              <CustomSelect
                data={countryData}
                title="Select Country"
                onSelectChange={(event: { target: { value: any } }) =>
                  (modifiedData.country = event.target.value)
                }
              />
            </div>
            <div className="selection">
              <CustomSelect
                data={cityData}
                title="Select City"
                onSelectChange={(event: { target: { value: any } }) =>
                  (modifiedData.city = event.target.value)
                }
              />
            </div>
          </div>
          <PhoneNumberInput onPhoneNumberChange={handlePhoneNumberChange} />
          <FormInput
            placeholder="Adresa"
            type={"text"}
            onChange={handleChange}
            name="address"
          />
          <FormInput
            placeholder="Fjalëkalimi"
            type={"password"}
            onChange={handleChange}
            name="password"
          />
        </div>
        <BlueButton type="submit">
          Vazhdoni
          <br />
        </BlueButton>
        <span className="register-privacy-policy">
          Duke krijuar një llogari, ju pranoni{" "}
          <a href="/privacy-policy">
            Kushtet tona të Politikës së Privatësisë{" "}
          </a>
        </span>
      </FormWrapper>
    </div>
  );
};

export default Client;
