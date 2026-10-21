import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ForgotPassword.scss";
import logo from "../../assets/svg/Logo.svg";
import FormWrapper from "../../components/Form/Form";
import FormInput from "../../components/FormInput/FormInput";
import BlueButton from "../../components/BlueButton/BlueButton";

const API = "https://gomisteria-api.onrender.com/api/users";
const RESEND_SECONDS = 60;

type Step = "phone" | "code" | "account" | "password" | "done";
type Account = { token: string; email: string; name: string };

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
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

    if (phone.replace(/\D/g, "").length < 8) {
      setError("Ju lutem vendosni një numër telefoni të vlefshëm.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API}/request-password-reset-sms`, {
        phone: phone.trim(),
        portal: "punetori",
      });
      setCode("");
      setResendIn(RESEND_SECONDS);
      setStep("code");
    } catch (err: any) {
      console.error("Failed to request SMS reset:", err);
      setError(
        err?.response?.status === 429
          ? "Ju lutem prisni një minutë para se të kërkoni një kod të ri."
          : "Nuk mundëm të dërgojmë SMS-në. Ju lutem provoni më vonë."
      );
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
        phone: phone.trim(),
        portal: "punetori",
        code: code.trim(),
      });
      const found: Account[] = res?.data?.accounts ?? [];
      if (found.length === 1) {
        setToken(found[0].token);
        setStep("password");
      } else {
        setAccounts(found);
        setStep("account");
      }
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

      {step === "phone" && (
        <FormWrapper onSubmit={sendCode} title="Keni Harruar Fjalëkalimin">
          <p>
            Vendosni numrin e telefonit të llogarisë suaj dhe ne do t'ju
            dërgojmë një kod me SMS.
          </p>
          <div className="forgotPassword-inputs">
            <FormInput
              placeholder="Numri i telefonit (p.sh. 045 123 456)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              name="phone"
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
            Nëse ky numër i përket një llogarie, ne dërguam një kod me 6 shifra
            në <strong>{phone}</strong>.
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
            href="#change-number"
            onClick={(e) => {
              e.preventDefault();
              setError(null);
              setStep("phone");
            }}
          >
            Ndrysho numrin
          </a>
        </FormWrapper>
      )}

      {step === "account" && (
        <FormWrapper title="Zgjidhni Llogarinë">
          <p>
            Ky numër përdoret nga më shumë se një llogari. Cilën dëshironi të
            rivendosni?
          </p>
          <div className="forgotPassword-inputs">
            {accounts.map((account) => (
              <BlueButton
                key={account.token}
                type="button"
                onClick={() => {
                  setToken(account.token);
                  setStep("password");
                }}
              >
                {account.name ? `${account.name} · ` : ""}
                {account.email}
              </BlueButton>
            ))}
          </div>
          <a href="/">Kthehu te Hyrja</a>
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
