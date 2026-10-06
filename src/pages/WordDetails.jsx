import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

export default function WordDetails({ backTo = "/student/vocabulary" }) {
  const { t } = useLanguage();
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
    return <p className="status-message">{t("loadingWordDetails")}</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  return (
    <section className="detail-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("wordDetails")}</span>
          <h2>{item.word}</h2>
        </div>
        <Link className="btn btn-outline" to={backTo}>
          {t("backToVocabulary")}
        </Link>
      </div>

      <div className="card detail-card">
        <p>
          <strong>{t("englishWord")}</strong> {item.word}
        </p>
        <p>
          <strong>{t("bengaliMeaning")}</strong> {item.meaning}
        </p>
        <p>
          <strong>{t("lessonTitle")}</strong> {item.lesson_title}
        </p>
        {item.pronunciation ? (
          <p>
            <strong>{t("pronunciation")}</strong> {item.pronunciation}
          </p>
        ) : null}
        {item.part_of_speech ? (
          <p>
            <strong>{t("partOfSpeech")}</strong> {t(item.part_of_speech)}
          </p>
        ) : null}
        <p>
          <strong>{t("difficulty")}</strong> {t(item.difficulty)}
        </p>
        {item.synonyms && item.synonyms.length > 0 ? (
          <p>
            <strong>{t("synonyms")}</strong>{" "}
            {item.synonyms.map((entry, index) => (
              <span key={entry.word}>
                {entry.word} {entry.meaning ? `(${entry.meaning})` : ""}
                {index < item.synonyms.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        ) : null}
        {item.antonyms && item.antonyms.length > 0 ? (
          <p>
            <strong>{t("antonyms")}</strong>{" "}
            {item.antonyms.map((entry, index) => (
              <span key={entry.word}>
                {entry.word} {entry.meaning ? `(${entry.meaning})` : ""}
                {index < item.antonyms.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        ) : null}
        {item.example ? (
          <p>
            <strong>{t("exampleSentence")}</strong> {item.example}
          </p>
        ) : null}
      </div>
    </section>
  );
}
