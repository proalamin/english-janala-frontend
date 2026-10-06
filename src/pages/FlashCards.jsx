import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

function IconBookmark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function FlashCards() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [bundle, setBundle] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const [bundleResponse, vocabularyResponse] = await Promise.all([
          api.get(`/lessons/${id}/`),
          api.get(`/lessons/${id}/vocabulary/`),
        ]);
        setBundle(bundleResponse.data);
        setVocabulary(vocabularyResponse.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const current = vocabulary[index];
  const total = vocabulary.length;

  function goTo(nextIndex) {
    if (nextIndex < 0 || nextIndex >= total) {
      return;
    }
    setIndex(nextIndex);
    setFlipped(false);
  }

  if (loading) {
    return <p className="status-message">{t("loadingVocabulary")}</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  if (!current) {
    return (
      <div className="empty-state card">
        <h3>{t("noVocabularyFound")}</h3>
        <p>{t("lessonNoVocabulary")}</p>
      </div>
    );
  }

  const PEEK_COUNT = 3;
  const leftPeeks = Array.from({ length: PEEK_COUNT }, (_, i) => vocabulary[index - 1 - i]).filter(Boolean);
  const rightPeeks = Array.from({ length: PEEK_COUNT }, (_, i) => vocabulary[index + 1 + i]).filter(Boolean);
  const progressPercent = total ? Math.round(((index + 1) / total) * 100) : 0;

  return (
    <section className="flashcards-page">
      <div className="flashcards-header">
        <span className="eyebrow">{bundle?.title || t("flashCards")}</span>
        <h2>{t("flashCards")}</h2>
        <p className="muted-text">{t("tapToSeeMeaning")}</p>
        <div className="flashcards-progress-track">
          <div className="flashcards-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flashcards-stage">
        <button
          type="button"
          className="flashcards-back"
          onClick={() => navigate(`/student/bundles/${id}/practice`)}
          aria-label={t("backToSegments")}
        >
          <IconArrowLeft />
        </button>
        <button
          type="button"
          className="flashcards-close"
          onClick={() => navigate(`/student/bundles/${id}/practice`)}
        >
          <IconClose />
          <span>{t("backToBundle")}</span>
        </button>

        <div className="flashcard-deck">
          {leftPeeks
            .slice()
            .reverse()
            .map((item, reversedIdx) => {
              const depth = leftPeeks.length - reversedIdx;
              return (
                <div
                  key={item.id}
                  className="flashcard-peek flashcard-peek-left"
                  style={{
                    transform: `translateX(${depth * -9}vw) scale(${1 - depth * 0.035})`,
                    zIndex: 10 - depth,
                  }}
                >
                  {item.word}
                </div>
              );
            })}

          {rightPeeks
            .slice()
            .reverse()
            .map((item, reversedIdx) => {
              const depth = rightPeeks.length - reversedIdx;
              return (
                <div
                  key={item.id}
                  className="flashcard-peek flashcard-peek-right"
                  style={{
                    transform: `translateX(${depth * 9}vw) scale(${1 - depth * 0.035})`,
                    zIndex: 10 - depth,
                  }}
                >
                  {item.word}
                </div>
              );
            })}

          <button
            type="button"
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped((value) => !value)}
          >
            <div className="flashcard-face flashcard-face-front">
              <span className="flashcard-bookmark"><IconBookmark /></span>
              <span className="flashcard-word">{current.word}</span>
            </div>
            <div className="flashcard-face flashcard-face-back">
              <span className="flashcard-meaning">{current.meaning}</span>
              {current.part_of_speech ? (
                <span className="flashcard-pos">({t(current.part_of_speech).charAt(0).toLowerCase()}.)</span>
              ) : null}
              {current.example ? <p className="flashcard-example">{current.example}</p> : null}
            </div>
          </button>
        </div>

        <div className="flashcards-nav">
          <button
            type="button"
            className="btn btn-outline flashcards-nav-btn"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
          >
            {t("previousPage")}
          </button>
          <span className="flashcards-counter">{index + 1}/{total}</span>
          <button
            type="button"
            className="btn btn-outline flashcards-nav-btn"
            onClick={() => goTo(index + 1)}
            disabled={index === total - 1}
          >
            {t("nextPage")}
          </button>
        </div>

        <button
          type="button"
          className="flashcards-toggle"
          onClick={() => setShowExtra((value) => !value)}
        >
          {showExtra ? t("hide") : t("seeSynonymsAntonyms")}
        </button>

        {showExtra ? (
          <div className="flashcards-extra-panel">
            {current.synonyms && current.synonyms.length > 0 ? (
              <p>
                <strong>{t("synonyms")}</strong>{" "}
                {current.synonyms
                  .map((entry) => `${entry.word}${entry.meaning ? ` (${entry.meaning})` : ""}`)
                  .join(", ")}
              </p>
            ) : null}
            {current.antonyms && current.antonyms.length > 0 ? (
              <p>
                <strong>{t("antonyms")}</strong>{" "}
                {current.antonyms
                  .map((entry) => `${entry.word}${entry.meaning ? ` (${entry.meaning})` : ""}`)
                  .join(", ")}
              </p>
            ) : null}
            {(!current.synonyms || current.synonyms.length === 0) &&
            (!current.antonyms || current.antonyms.length === 0) ? (
              <p className="muted-text">{t("noSynonymsAntonyms")}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
