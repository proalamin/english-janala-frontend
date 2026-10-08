import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

const initialForm = {
  name: "",
  phone: "",
  institute: "",
  email: "",
  password: "",
};

export default function Register() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(currentForm) {
    const nextErrors = {};
    if (!currentForm.name.trim()) nextErrors.name = "Name is required.";
    if (!currentForm.email.trim()) nextErrors.email = "Email is required.";
    if (!currentForm.password || currentForm.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    return nextErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await register({
        name: form.name.trim(),
        phone: form.phone.trim(),
        institute: form.institute.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/student/dashboard", { replace: true });
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
          <h2>{t("register")}</h2>
          <p className="muted-text">{t("registerCopy")}</p>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label>
          <span className="label-text">
            {t("nameLabel")} <span className="required-mark">*</span>
          </span>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name ? <span className="field-error">{errors.name}</span> : null}
        </label>

        <label>
          <span className="label-text">{t("phoneLabel")} <span className="optional-note">({t("optional")})</span></span>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>

        <label>
          <span className="label-text">{t("instituteLabel")} <span className="optional-note">({t("optional")})</span></span>
          <input name="institute" value={form.institute} onChange={handleChange} />
        </label>

        <label>
          <span className="label-text">
            {t("emailLabel")} <span className="required-mark">*</span>
          </span>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </label>

        <label>
          <span className="label-text">
            {t("passwordLabel")} <span className="required-mark">*</span>
          </span>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password ? <span className="field-error">{errors.password}</span> : null}
        </label>

        {error ? <p className="status-message error">{error}</p> : null}

        <div className="button-row">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t("creatingAccount") : t("createAccount")}
          </button>
        </div>

        <p className="auth-switch">
          {t("alreadyHaveAccount")} <Link to="/login">{t("login")}</Link>
        </p>
      </form>
    </section>
  );
}
