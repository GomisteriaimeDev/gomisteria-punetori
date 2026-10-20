import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "../ForgotPassword/ForgotPassword.scss";
import logo from "../../assets/svg/Logo.svg";
import FormWrapper from "../../components/Form/Form";
import FormInput from "../../components/FormInput/FormInput";
import BlueButton from "../../components/BlueButton/BlueButton";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);

    if (password.length < 6) {
      setError("Fjalëkalimi duhet të ketë të paktën 6 karaktere.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Fjalëkalimet nuk përputhen. Ju lutemi provoni përsëri.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        "https://gomisteria-api.onrender.com/api/users/reset-password",
        { newPassword: password },
        { params: { token } }
      );
      setSuccess(true);
    } catch (err) {
      console.error("Failed to reset password:", err);
      setError(
        "Lidhja e rivendosjes është e pavlefshme ose ka skaduar. Ju lutem kërkoni një të re."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="forgotPasswordWrapper">
        <img src={logo} alt="gomisteriaLogo" />
        <FormWrapper title="Lidhje e Pavlefshme">
          <p>
            Kjo lidhje për rivendosjen e fjalëkalimit është e pavlefshme. Ju
            lutem kërkoni një të re.
          </p>
          <a href="/forgot-password">Kërko Lidhje të Re</a>
        </FormWrapper>
      </div>
    );
  }

  if (success) {
    return (
      <div className="forgotPasswordWrapper">
        <img src={logo} alt="gomisteriaLogo" />
        <FormWrapper title="Fjalëkalimi u Rivendos me Sukses">
          <p>Tani mund të identifikoheni me fjalëkalimin tuaj të ri.</p>
          <a href="/">Shko te Hyrja</a>
        </FormWrapper>
      </div>
    );
  }

  return (
    <div className="forgotPasswordWrapper">
      <img src={logo} alt="gomisteriaLogo" />
      <FormWrapper onSubmit={handleSubmit} title="Ndërroni Fjalëkalimin">
        <div className="forgotPassword-inputs">
          <FormInput
            placeholder="Fjalëkalimi i ri"
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            isError={!!error}
          />
          <FormInput
            placeholder="Konfirmoni fjalëkalimin e ri"
            type={"password"}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            name="passwordConfirm"
            isError={!!error}
          />
        </div>
        {error && <div className="error-message--global">{error}</div>}
        <BlueButton type="submit">
          {isSubmitting ? "Duke ndërruar..." : "Ndërro Fjalëkalimin"}
        </BlueButton>
      </FormWrapper>
    </div>
  );
};

export default ResetPassword;
