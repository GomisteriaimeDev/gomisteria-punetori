import React, { useState } from "react";
import "./Login.scss";
import logo from "../../assets/svg/logoWhite.svg";
import FormWrapper from "../../components/Form/Form";
import FormInput from "../../components/FormInput/FormInput";
import BlueButton from "../../components/BlueButton/BlueButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ added
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ added: normalize axios error shape
  const extractBackend = (err: any) => {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const code = data?.code;
    return { status, code, data };
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // HARD guard: prevents double-submit no matter what
    if (isSubmitting) return;

    // ✅ added
    setGeneralError(null);
    setFieldErrors({});

    // ✅ added: basic required checks
    const nextFieldErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextFieldErrors.email = "Email është i detyrueshëm.";
    if (!password)
      nextFieldErrors.password = "Fjalëkalimi është i detyrueshëm.";
    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/statistics"); // single navigation, after successful login
    } catch (error: any) {
      console.error("Login failed:", error);

      // ✅ added: show backend error
      const { status, code, data } = extractBackend(error);

      // If backend returns field-level errors (optional future):
      // { errors: { email: "...", password: "..." } }
      if (status === 400 && data?.errors) {
        setFieldErrors({
          email: data.errors.email,
          password: data.errors.password,
        });
        return;
      }

      if (status === 401) {
        if (code === "AUTH_NOT_ACTIVATED") {
          setGeneralError("Llogaria duhet të aktivizohet para identifikimit.");
        } else {
          setGeneralError("Emaili ose fjalëkalimi është i pasaktë.");
        }
        return;
      }

      setGeneralError("Identifikimi dështoi. Ju lutemi provoni më vonë.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="loginBg">
      <div className="loginWrapper">
        <img src={logo} alt="gomisteriaLogo" className="adminLoginLogo" />

        <FormWrapper onSubmit={handleLogin} title="Hyni">
          <div className="login-inputs">
            <FormInput
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* ✅ added: field error without relying on FormInput */}
            {fieldErrors.email && (
              <div className="error-message">{fieldErrors.email}</div>
            )}

            <FormInput
              type="password"
              name="password"
              id="password"
              placeholder="Fjalëkalimi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* ✅ added */}
            {fieldErrors.password && (
              <div className="error-message">{fieldErrors.password}</div>
            )}

            <div className="login-checkbox">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Më mbaj në mend</label>
            </div>
          </div>

          {/* ✅ added: global error banner */}
          {generalError && (
            <div className="error-message--global">{generalError}</div>
          )}

          <BlueButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Duke hyrë..." : "Hyr"}
          </BlueButton>

          <a href="/forgot-password">Keni harruar fjalëkalimin tuaj?</a>
        </FormWrapper>

        <div className="login-bottom" />
      </div>
    </div>
  );
};

export default Login;
