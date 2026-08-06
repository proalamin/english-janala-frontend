import { useState } from "react";
import { api, getApiErrorMessage } from "../api/axios";

const initialForm = {
  title: "",
  description: "",
};

export default function AddLesson() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      await api.post("/lessons/", {
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setMessage("Lesson created successfully.");
      setForm(initialForm);
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
          <span className="eyebrow">Admin</span>
          <h2>Add Lesson</h2>
        </div>
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
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </form>
    </section>
  );
}
