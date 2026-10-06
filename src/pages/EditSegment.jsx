import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

export default function EditSegment() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSegment() {
      try {
        const response = await api.get(`/segments/${id}/`);
        setForm({
          name: response.data.name || "",
          description: response.data.description || "",
        });
      } catch (requestError) {
        setMessage(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchSegment();
  }, [id]);

  function validate(currentForm) {
    const nextErrors = {};

    if (!currentForm.name.trim()) {
      nextErrors.name = "Segment name is required.";
    } else if (currentForm.name.length > 100) {
      nextErrors.name = "Segment name cannot exceed 100 characters.";
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
    setMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setSaving(true);
      await api.patch(`/segments/${id}/`, {
        name: form.name.trim(),
        description: form.description.trim(),
      });
      setMessage("Segment updated successfully.");
    } catch (requestError) {
      setMessage(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="status-message">{t("loadingSegments")}</p>;
  }

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("admin")}</span>
          <h2>{t("editSegment")}</h2>
        </div>
        <Link className="btn btn-outline" to="/admin/segments">
          {t("backToSegments")}
        </Link>
      </div>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label>
          <span className="label-text">
            {t("segmentName")} <span className="required-mark">*</span>
          </span>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name ? <span className="field-error">{errors.name}</span> : null}
        </label>

        <label>
          <span className="label-text">
            {t("description")} <span className="optional-note">({t("optional")})</span>
          </span>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        {message ? (
          <p
            className={`status-message ${message.includes("successfully") ? "success" : "error"}`}
          >
            {message}
          </p>
        ) : null}

        <div className="button-row">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? t("updating") : t("updateSegment")}
          </button>
        </div>
      </form>
    </section>
  );
}
