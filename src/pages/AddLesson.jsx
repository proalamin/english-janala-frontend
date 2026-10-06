import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

const initialForm = {
  segment: "",
  title: "",
  description: "",
};

export default function AddLesson() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [segments, setSegments] = useState([]);
  const [form, setForm] = useState({
    ...initialForm,
    segment: searchParams.get("segment") || "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSegments() {
      try {
        const response = await api.get("/segments/");
        setSegments(response.data);
      } catch (requestError) {
        setMessage(getApiErrorMessage(requestError));
      }
    }

    fetchSegments();
  }, []);

  function validate(currentForm) {
    const nextErrors = {};

    if (!currentForm.segment) {
      nextErrors.segment = "Segment is required.";
    }
    if (!currentForm.title.trim()) {
      nextErrors.title = "Title is required.";
    } else if (currentForm.title.length > 150) {
      nextErrors.title = "Title cannot exceed 150 characters.";
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
      setLoading(true);
      await api.post("/lessons/", {
        segment: Number(form.segment),
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setMessage("Lesson created successfully.");
      setForm({ ...initialForm, segment: form.segment });
    } catch (requestError) {
      setMessage(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("admin")}</span>
          <h2>{t("addLesson")}</h2>
        </div>
        <Link
          className="btn btn-outline"
          to={form.segment ? `/admin/segments/${form.segment}` : "/admin/segments"}
        >
          {t("backToSegments")}
        </Link>
      </div>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label>
          <span className="label-text">
            {t("segment")} <span className="required-mark">*</span>
          </span>
          <select name="segment" value={form.segment} onChange={handleChange}>
            <option value="">{t("selectASegment")}</option>
            {segments.map((segment) => (
              <option key={segment.id} value={segment.id}>
                {segment.name}
              </option>
            ))}
          </select>
          {errors.segment ? <span className="field-error">{errors.segment}</span> : null}
        </label>

        <label>
          <span className="label-text">
            {t("title")} <span className="required-mark">*</span>
          </span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title ? (
            <span className="field-error">{errors.title}</span>
          ) : null}
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
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t("saving") : t("saveLesson")}
          </button>
        </div>
      </form>
    </section>
  );
}
