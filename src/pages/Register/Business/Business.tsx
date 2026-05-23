import React, { useState } from "react";
import "./Business.scss";
import logo from "../../../assets/svg/Logo.svg";
import FormWrapper from "../../../components/Form/Form";
import FormInput from "../../../components/FormInput/FormInput";
import BlueButton from "../../../components/BlueButton/BlueButton";
import CustomSelect from "../../../components/FormSelect/FormSelect";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Business = () => {
  const [businessType, setBusinessType] = useState("Autosallon");
  const [modifiedData, setModifiedData] = useState({
    companyName: "",
    email: "",
    country: "",
    city: "",
    password: "",
    phone: "",
    address: "",
  });
  const [roadAssistance, setRoadAssistance] = useState("");
  const [workingHours, setWorkingHours] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleClient = async ({ event }: any) => {
    event.preventDefault();

    const {
      companyName,
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
        businessType,
        companyName,
        address,
        country,
        city,
        phone,
        roadAssistance:
          businessType === "Karrotec" ? roadAssistance : undefined,
        workingHours:
          businessType === "Karrotec" && roadAssistance === "Po"
            ? workingHours
            : undefined,
        ...rest,
      },
    };
    try {
      await axios.post(
        "https://gomisteria-api.onrender.com/api/users/registerBusiness",
        dataToSend
      );
      navigate("/register/business/success");
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

  const handleRoadAssistanceChange = (event: any) => {
    setRoadAssistance(event.target.value);
  };

  const handleWorkingHoursChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    setWorkingHours((currentHours) =>
      checked
        ? [...currentHours, value]
        : currentHours.filter((hour) => hour !== value)
    );
  };
  const handlePhoneNumberChange = (phoneNumber: string) => {
    modifiedData.phone = phoneNumber;
  };
  const businessTypes = [
    "Autosallon",
    "Taxi",
    "Rent a Car",
    "Postë",
    "Karrotrec",
    "Tjetër",
  ];
  const countryData = ["Kosovo", "Albania", "North Macedonia"];
  const cityData = ["Prihtina", "Peja", "Mitrovica"];

  const renderBusinessSpecificForm = () => {
    switch (businessType) {
      case "Autosallon":
        return (
          <div className="business-form">
            <div className="business-inputs">
              <FormInput
                placeholder="Emri i Kompanisë"
                type="text"
                onChange={handleChange}
                name="companyName"
              />
              <FormInput
                placeholder="Email Adresa"
                type="email"
                onChange={handleChange}
                name="email"
              />

              <PhoneNumberInput onPhoneNumberChange={handlePhoneNumberChange} />

              <div className="business-selections">
                <CustomSelect
                  data={countryData}
                  title="Select Country"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.country = event.target.value)
                  }
                  name="country"
                />
                <CustomSelect
                  data={cityData}
                  title="Select City"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.city = event.target.value)
                  }
                  name="city"
                />
              </div>
              <FormInput
                placeholder="Adresa"
                type="text"
                onChange={handleChange}
                name="address"
              />
              <FormInput
                placeholder="Fjalëkalimi"
                type="password"
                onChange={handleChange}
                name="password"
              />
            </div>
          </div>
        );
      case "Rent a Car":
        return (
          <div className="business-form">
            <div className="business-inputs">
              <FormInput
                placeholder="Emri i Kompanisë"
                type="text"
                onChange={handleChange}
                name="companyName"
              />
              <FormInput
                placeholder="Email Adresa"
                type="email"
                onChange={handleChange}
                name="email"
              />

              <PhoneNumberInput onPhoneNumberChange={handlePhoneNumberChange} />
              <div className="business-selections">
                <CustomSelect
                  data={countryData}
                  title="Select Country"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.country = event.target.value)
                  }
                  name="country"
                />
                <CustomSelect
                  data={cityData}
                  title="Select City"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.city = event.target.value)
                  }
                  name="city"
                />
              </div>
              <FormInput
                placeholder="Adresa"
                type="text"
                onChange={handleChange}
                name="address"
              />
              <FormInput
                placeholder="Fjalëkalimi"
                type="password"
                onChange={handleChange}
                name="password"
              />
            </div>
          </div>
        );
      case "Taxi":
        return (
          <div className="business-form">
            <div className="business-inputs">
              <FormInput
                placeholder="Emri i Kompanisë"
                type="text"
                onChange={handleChange}
                name="companyName"
              />
              <FormInput
                placeholder="Email Adresa"
                type="email"
                onChange={handleChange}
                name="email"
              />

              <PhoneNumberInput onPhoneNumberChange={handlePhoneNumberChange} />
              <div className="business-selections">
                <CustomSelect
                  data={countryData}
                  title="Select Country"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.country = event.target.value)
                  }
                  name="country"
                />
                <CustomSelect
                  data={cityData}
                  title="Select City"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.city = event.target.value)
                  }
                  name="city"
                />
              </div>
              <FormInput
                placeholder="Adresa"
                type="text"
                onChange={handleChange}
                name="address"
              />
              <FormInput
                placeholder="Fjalëkalimi"
                type="password"
                onChange={handleChange}
                name="password"
              />
            </div>
          </div>
        );
      case "Karrotrec":
        return (
          <div className="business-form">
            {/* Road Assistance Section */}
            <p className="radio-title">A beni asistencë rrugore?</p>
            <div id="roadAssistance" className="radio-details">
              <>
                <input
                  type="radio"
                  value="Po"
                  name="roadAssistance"
                  onChange={handleRoadAssistanceChange}
                />{" "}
                Po
              </>
              <>
                <input
                  type="radio"
                  value="Jo"
                  name="roadAssistance"
                  onChange={handleRoadAssistanceChange}
                />{" "}
                Jo
              </>
            </div>

            {/* Conditional rendering based on road assistance selection */}
            {roadAssistance === "Po" && (
              <div className="checkbox-group">
                <p className="orari">Orari i Punës</p>
                {[
                  "E Hënë — 8:00-18:00",
                  "E Martë — 8:00-18:00",
                  "E Mërkurë — Always Open",
                  "E enjte — 8:00-18:00",
                  "E premte — 8:00-18:00",
                  "E shtunë — 8:00-12:00",
                  "E dielë — Closed",
                ].map((day, index) => (
                  <div key={index} className="checkbox-details">
                    <input
                      type="checkbox"
                      id={day}
                      name="workDays"
                      value={day}
                      onChange={handleWorkingHoursChange}
                    />
                    <label htmlFor={day}>{day}</label>
                  </div>
                ))}
              </div>
            )}
            <div className="business-inputs">
              <FormInput
                placeholder="Emri i Kompanisë"
                type="text"
                onChange={handleChange}
                name="companyName"
              />
              <FormInput
                placeholder="Email Adresa"
                type="email"
                onChange={handleChange}
                name="email"
              />

              <PhoneNumberInput onPhoneNumberChange={handlePhoneNumberChange} />

              <div className="business-selections">
                <CustomSelect
                  data={countryData}
                  title="Select Country"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.country = event.target.value)
                  }
                  name="country"
                />
                <CustomSelect
                  data={cityData}
                  title="Select City"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.city = event.target.value)
                  }
                  name="city"
                />
              </div>
              <FormInput
                placeholder="Adresa"
                type="text"
                onChange={handleChange}
                name="address"
              />
              <FormInput
                placeholder="Fjalëkalimi"
                type="password"
                onChange={handleChange}
                name="password"
              />
            </div>
          </div>
        );
      case "Postë":
        return (
          <div className="business-form">
            <div className="business-inputs">
              <FormInput
                placeholder="Emri i Kompanisë"
                type="text"
                onChange={handleChange}
                name="companyName"
              />
              <FormInput
                placeholder="Email Adresa"
                type="email"
                onChange={handleChange}
                name="email"
              />

              <PhoneNumberInput onPhoneNumberChange={handlePhoneNumberChange} />
              <div className="business-selections">
                <CustomSelect
                  data={countryData}
                  title="Select Country"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.country = event.target.value)
                  }
                  name="country"
                />
                <CustomSelect
                  data={cityData}
                  title="Select City"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.city = event.target.value)
                  }
                  name="city"
                />
              </div>
              <FormInput
                placeholder="Adresa"
                type="text"
                onChange={handleChange}
                name="address"
              />
              <FormInput
                placeholder="Fjalëkalimi"
                type="password"
                onChange={handleChange}
                name="password"
              />
            </div>
          </div>
        );
      case "Tjetër":
        return (
          <div className="business-form">
            <div className="business-inputs">
              <FormInput
                placeholder="Emri i Kompanisë"
                type="text"
                onChange={handleChange}
                name="companyName"
              />
              <FormInput
                placeholder="Email Adresa"
                type="email"
                onChange={handleChange}
                name="email"
              />

              <PhoneNumberInput onPhoneNumberChange={handlePhoneNumberChange} />
              <div className="business-selections">
                <CustomSelect
                  data={countryData}
                  title="Select Country"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.country = event.target.value)
                  }
                  name="country"
                />
                <CustomSelect
                  data={cityData}
                  title="Select City"
                  onSelectChange={(event: { target: { value: any } }) =>
                    (modifiedData.city = event.target.value)
                  }
                  name="city"
                />
              </div>
              <FormInput
                placeholder="Adresa"
                type="text"
                onChange={handleChange}
                name="address"
              />
              <FormInput
                placeholder="Fjalëkalimi"
                type="password"
                onChange={handleChange}
                name="password"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="businessWrapper">
      <img src={logo} alt="Logo" />

      <FormWrapper onSubmit={handleClient} title="Krijoni një llogari">
        <CustomSelect
          data={businessTypes}
          title="Select Business Type"
          onSelectChange={(event: any) => setBusinessType(event.target.value)}
        />
        {renderBusinessSpecificForm()}

        <BlueButton type="submit">Vazhdoni</BlueButton>
        <span className="register-privacy-policy">
          Duke krijuar një llogari, ju pranoni{" "}
          <a href="/privacy-policy">Kushtet tona të Politikës së Privatësisë</a>
        </span>
      </FormWrapper>
    </div>
  );
};

export default Business;
