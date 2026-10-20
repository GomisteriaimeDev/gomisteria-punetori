import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.scss";
import logo from "../../assets/svg/Logo.svg";
import FormWrapper from "../../components/Form/Form";
import FormInput from "../../components/FormInput/FormInput";
import BlueButton from "../../components/BlueButton/BlueButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Ju lutem vendosni një email të vlefshëm.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        "https://gomisteria-api.onrender.com/api/users/request-password-reset",
        { email: email.trim() }
      );
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to request password reset:", err);
      setError(
        "Nuk mundëm të dërgojmë email-in e rivendosjes. Ju lutem provoni më vonë."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgotPasswordWrapper">
      <img src={logo} alt="gomisteriaLogo" />
      {submitted ? (
        <FormWrapper title="Kontrolloni Email-in Tuaj">
          <p>
            Nëse ekziston një llogari me atë email, ne kemi dërguar një lidhje
            për rivendosjen e fjalëkalimit.
          </p>
          <a href="/">Kthehu te Hyrja</a>
        </FormWrapper>
      ) : (
        <FormWrapper onSubmit={handleSubmit} title="Keni Harruar Fjalëkalimin">
          <p>
            Vendosni email-in tuaj dhe ne do t'ju dërgojmë një lidhje për të
            rivendosur fjalëkalimin.
          </p>
          <div className="forgotPassword-inputs">
            <FormInput
              placeholder="Email"
              type={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              isError={!!error}
            />
          </div>
          {error && <div className="error-message--global">{error}</div>}
          <BlueButton type="submit">
            {isSubmitting ? "Duke dërguar..." : "Dërgo Lidhjen"}
          </BlueButton>
          <a href="/">Kthehu te Hyrja</a>
        </FormWrapper>
      )}
    </div>
  );
};

export default ForgotPassword;
