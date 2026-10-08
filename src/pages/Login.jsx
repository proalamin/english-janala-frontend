import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      const user = await login(form.email.trim(), form.password);
      const redirectTo = location.state?.from;
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (user.is_staff) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-page auth-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("account")}</span>
          <h2>{t("login")}</h2>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label>
          <span className="label-text">
            {t("emailLabel")} <span className="required-mark">*</span>
          </span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          <span className="label-text">
            {t("passwordLabel")} <span className="required-mark">*</span>
          </span>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        {error ? <p className="status-message error">{error}</p> : null}

        <div className="button-row">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t("loggingIn") : t("login")}
          </button>
        </div>

        <p className="auth-switch">
          {t("noAccountYet")} <Link to="/register">{t("register")}</Link>
        </p>
      </form>
    </section>
  );
}
