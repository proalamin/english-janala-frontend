import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LessonCard from "../components/LessonCard";
import { api, getApiErrorMessage } from "../api/axios";

export default function LessonList({ adminMode = false }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await api.get("/lessons/");
        setLessons(response.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  async function deleteLesson(lesson) {
    const confirmed = window.confirm(
      `Delete lesson "${lesson.title}"? This works only when the lesson has no vocabulary.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");
      await api.delete(`/lessons/${lesson.id}/`);
      setLessons((current) => current.filter((item) => item.id !== lesson.id));
      setMessage("Lesson deleted successfully.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{adminMode ? "Admin" : "Lessons"}</span>
          <h2>{adminMode ? "Manage Lessons" : "All Lessons"}</h2>
        </div>
        {adminMode ? (
          <Link className="btn btn-primary" to="/admin/lessons/new">
            Add Lesson
          </Link>
        ) : null}
      </div>

      {loading ? <p className="status-message">Loading lessons...</p> : null}
      {error ? <p className="status-message error">{error}</p> : null}
      {message ? <p className="status-message success">{message}</p> : null}

      {!loading && !error && lessons.length === 0 ? (
        <div className="empty-state card">
          <h3>No lessons found</h3>
          <p>{adminMode ? "Add your first lesson to start building the vocabulary database." : "No lessons are available yet."}</p>
          {adminMode ? (
            <Link className="btn btn-primary" to="/admin/lessons/new">
              Add Lesson
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="grid two-column-grid">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            adminMode={adminMode}
            onDelete={deleteLesson}
          />
        ))}
      </div>
    </section>
  );
}
