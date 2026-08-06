import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";

export default function WordDetails({ backTo = "/student/vocabulary" }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVocabulary() {
      try {
        const response = await api.get(`/vocabulary/${id}/`);
        setItem(response.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchVocabulary();
  }, [id]);

  if (loading) {
    return <p className="status-message">Loading word details...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  return (
    <section className="detail-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Word Details</span>
          <h2>{item.word}</h2>
        </div>
        <Link className="btn btn-outline" to={backTo}>
          Back to Vocabulary
        </Link>
      </div>

      <div className="card detail-card">
        <p>
          <strong>English Word:</strong> {item.word}
        </p>
        <p>
          <strong>Bengali Meaning:</strong> {item.meaning}
        </p>
        <p>
          <strong>Lesson Title:</strong> {item.lesson_title}
        </p>
        {item.pronunciation ? (
          <p>
            <strong>Pronunciation:</strong> {item.pronunciation}
          </p>
        ) : null}
        {item.example ? (
          <p>
            <strong>Example Sentence:</strong> {item.example}
          </p>
        ) : null}
      </div>
    </section>
  );
}
