import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";

export default function EditLesson() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", description: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchLesson() {
      try {
        const response = await api.get(`/lessons/${id}/`);
        setForm({
          title: response.data.title || "",
          description: response.data.description || "",
        });
      } catch (requestError) {
        setMessage(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [id]);

  function validate(currentForm) {
    const nextErrors = {};

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
      setSaving(true);
      await api.patch(`/lessons/${id}/`, {
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setMessage("Lesson updated successfully.");
    } catch (requestError) {
      setMessage(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="status-message">Loading lesson...</p>;
  }

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Admin</span>
          <h2>Edit Lesson</h2>
        </div>
        <Link className="btn btn-outline" to="/admin/lessons">
          Back to Lessons
        </Link>
      </div>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label>
          Title
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
          Description
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
            {saving ? "Updating..." : "Update Lesson"}
          </button>
        </div>
      </form>
    </section>
  );
}
