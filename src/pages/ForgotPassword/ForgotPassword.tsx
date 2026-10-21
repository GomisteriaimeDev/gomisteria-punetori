import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ForgotPassword.scss";
import logo from "../../assets/svg/Logo.svg";
import FormWrapper from "../../components/Form/Form";
import FormInput from "../../components/FormInput/FormInput";
import BlueButton from "../../components/BlueButton/BlueButton";

const API = "https://gomisteria-api.onrender.com/api/users";
const RESEND_SECONDS = 60;

type Step = "email" | "code" | "password" | "done";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const sendCode = async () => {
    if (isSubmitting) return;
    setError(null);

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Ju lutem vendosni një email të vlefshëm.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API}/request-password-reset-sms`, {
        email: email.trim(),
        portal: "punetori",
      });
      setMaskedPhone(res?.data?.phone ?? "");
      setCode("");
      setResendIn(RESEND_SECONDS);
      setStep("code");
    } catch (err: any) {
      console.error("Failed to request SMS reset:", err);
      const errorCode = err?.response?.data?.code;
      if (errorCode === "RESET_EMAIL_NOT_FOUND") {
        setError("Nuk ka asnjë llogari me këtë email.");
      } else if (errorCode === "RESET_NO_PHONE") {
        setError(
          "Kjo llogari nuk ka numër telefoni. Ju lutem kontaktoni administratorin."
        );
      } else if (err?.response?.status === 429) {
        setError("Ju lutem prisni një minutë para se të kërkoni një kod të ri.");
      } else {
        setError("Nuk mundëm të dërgojmë SMS-në. Ju lutem provoni më vonë.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async () => {
    if (isSubmitting) return;
    setError(null);

    if (!/^\d{6}$/.test(code.trim())) {
      setError("Ju lutem vendosni kodin me 6 shifra.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API}/verify-reset-code`, {
        email: email.trim(),
        portal: "punetori",
        code: code.trim(),
      });
      setToken(res?.data?.token ?? null);
      setStep("password");
    } catch (err) {
      console.error("Failed to verify reset code:", err);
      setError(
        "Kodi është i gabuar ose ka skaduar. Kontrolloni ose kërkoni një të ri."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async () => {
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
        `${API}/reset-password`,
        { newPassword: password },
        { params: { token } }
      );
      setStep("done");
    } catch (err) {
      console.error("Failed to reset password:", err);
      setError("Kjo rivendosje ka skaduar. Ju lutem filloni përsëri.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorBanner = error && (
    <div className="error-message--global">{error}</div>
  );

  return (
    <div className="forgotPasswordWrapper">
      <img src={logo} alt="gomisteriaLogo" />

      {step === "email" && (
        <FormWrapper onSubmit={sendCode} title="Keni Harruar Fjalëkalimin">
          <p>
            Vendosni email-in e llogarisë suaj dhe ne do t'ju dërgojmë një kod
            me SMS në numrin e telefonit të llogarisë.
          </p>
          <div className="forgotPassword-inputs">
            <FormInput
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              isError={!!error}
            />
          </div>
          {errorBanner}
          <BlueButton type="submit">
            {isSubmitting ? "Duke dërguar..." : "Dërgo Kodin"}
          </BlueButton>
          <a href="/">Kthehu te Hyrja</a>
        </FormWrapper>
      )}

      {step === "code" && (
        <FormWrapper onSubmit={verifyCode} title="Vendosni Kodin">
          <p>
            Ne dërguam një kod me 6 shifra me SMS në{" "}
            <strong>{maskedPhone}</strong>.
          </p>
          <div className="forgotPassword-inputs">
            <FormInput
              placeholder="Kodi me 6 shifra"
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              name="code"
              isError={!!error}
            />
          </div>
          {errorBanner}
          <BlueButton type="submit">
            {isSubmitting ? "Duke kontrolluar..." : "Vazhdo"}
          </BlueButton>
          {resendIn > 0 ? (
            <p>Ridërgo kodin pas {resendIn}s</p>
          ) : (
            <a
              href="#resend"
              onClick={(e) => {
                e.preventDefault();
                sendCode();
              }}
            >
              Ridërgo kodin
            </a>
          )}
          <a
            href="#change-email"
            onClick={(e) => {
              e.preventDefault();
              setError(null);
              setStep("email");
            }}
          >
            Përdor një email tjetër
          </a>
        </FormWrapper>
      )}

      {step === "password" && (
        <FormWrapper onSubmit={resetPassword} title="Ndërroni Fjalëkalimin">
          <div className="forgotPassword-inputs">
            <FormInput
              placeholder="Fjalëkalimi i ri"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              isError={!!error}
            />
            <FormInput
              placeholder="Konfirmoni fjalëkalimin e ri"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              name="passwordConfirm"
              isError={!!error}
            />
          </div>
          {errorBanner}
          <BlueButton type="submit">
            {isSubmitting ? "Duke ndërruar..." : "Ndërro Fjalëkalimin"}
          </BlueButton>
        </FormWrapper>
      )}

      {step === "done" && (
        <FormWrapper title="Fjalëkalimi u Rivendos me Sukses">
          <p>Tani mund të identifikoheni me fjalëkalimin tuaj të ri.</p>
          <a href="/">Shko te Hyrja</a>
        </FormWrapper>
      )}
    </div>
  );
};

export default ForgotPassword;
