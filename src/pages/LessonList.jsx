import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LessonCard from "../components/LessonCard";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

export default function LessonList({ adminMode = false }) {
  const { t } = useLanguage();
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
          <span className="eyebrow">{adminMode ? t("admin") : t("lessons")}</span>
          <h2>{adminMode ? t("manageLessons") : t("allLessons")}</h2>
        </div>
        {adminMode ? (
          <Link className="btn btn-primary" to="/admin/lessons/new">
            {t("addLesson")}
          </Link>
        ) : null}
      </div>

      {loading ? <p className="status-message">{t("loadingLessons")}</p> : null}
      {error ? <p className="status-message error">{error}</p> : null}
      {message ? <p className="status-message success">{message}</p> : null}

      {!loading && !error && lessons.length === 0 ? (
        <div className="empty-state card">
          <h3>{t("noLessonsFound")}</h3>
          <p>{adminMode ? t("addFirstLesson") : t("noLessonsAvailable")}</p>
          {adminMode ? (
            <Link className="btn btn-primary" to="/admin/lessons/new">
              {t("addLesson")}
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
