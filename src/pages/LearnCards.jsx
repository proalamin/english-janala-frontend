import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";
import { getBundleProgress, isWordKnown, toggleWordKnown } from "../progress";

export default function LearnCards() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingVocabulary, setLoadingVocabulary] = useState(false);
  const [error, setError] = useState("");
  const [knownVersion, setKnownVersion] = useState(0);

  const progress = getBundleProgress(vocabulary.map((item) => item.id));

  useEffect(() => {
    async function fetchLessons() {
      try {
        setError("");
        const response = await api.get("/lessons/");
        setLessons(response.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoadingLessons(false);
      }
    }

    fetchLessons();
  }, []);

  useEffect(() => {
    const bundleId = searchParams.get("bundle");
    if (!bundleId || loadingLessons || selectedLesson) {
      return;
    }
    const match = lessons.find((lesson) => String(lesson.id) === bundleId);
    if (match) {
      openLesson(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, loadingLessons, lessons]);

  async function openLesson(lesson) {
    try {
      setSelectedLesson(lesson);
      setVocabulary([]);
      setError("");
      setLoadingVocabulary(true);
      const response = await api.get(`/lessons/${lesson.id}/vocabulary/`);
      setVocabulary(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoadingVocabulary(false);
    }
  }

  function openWord(item) {
    setSelectedWord(item);
    setFlipped(false);
  }

  function closeWord() {
    setSelectedWord(null);
    setFlipped(false);
  }

  function handleToggleKnown(wordId) {
    toggleWordKnown(wordId);
    setKnownVersion((value) => value + 1);
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("practiceVocabulary")}</span>
          <h2>{t("learnUsingCards")}</h2>
          <p className="muted-text">{t("learnCardsCopy")}</p>
        </div>
        <Link className="btn btn-outline" to="/student/vocabulary">
          {t("backToVocabulary")}
        </Link>
      </div>

      {error ? <p className="status-message error">{error}</p> : null}

      <div className="learn-layout">
        <section className="learn-panel card">
          <div className="learn-panel-heading">
            <span className="eyebrow">{t("step1")}</span>
            <h3>{t("selectLesson")}</h3>
          </div>

          {loadingLessons ? <p className="status-message">{t("loadingLessons")}</p> : null}

          <div className="learn-lesson-list">
            {lessons.map((lesson) => (
              <button
                className={`learn-lesson-button ${selectedLesson?.id === lesson.id ? "active" : ""}`}
                type="button"
                key={lesson.id}
                onClick={() => openLesson(lesson)}
              >
                <strong>{lesson.title}</strong>
                <span>{lesson.description || t("practiceThisLesson")}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="learn-panel card">
          <div className="learn-panel-heading">
            <span className="eyebrow">{t("step2")}</span>
            <h3>{selectedLesson ? `${selectedLesson.title} ${t("vocabularyCards")}` : t("vocabularyCards")}</h3>
          </div>

          {!selectedLesson ? (
            <p className="muted-text">{t("selectLessonFirst")}</p>
          ) : null}

          {loadingVocabulary ? <p className="status-message">{t("loadingVocabulary")}</p> : null}

          {selectedLesson && !loadingVocabulary && vocabulary.length === 0 ? (
            <p className="muted-text">{t("noLessonCards")}</p>
          ) : null}

          {selectedLesson && !loadingVocabulary && vocabulary.length > 0 ? (
            <div className="bundle-progress">
              <div className="bundle-progress-track">
                <div
                  className={`bundle-progress-fill ${progress.complete ? "complete" : ""}`}
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <span className="bundle-progress-label">
                {progress.complete
                  ? t("bundleComplete")
                  : `${progress.known}/${progress.total} ${t("wordsLearned")}`}
              </span>
            </div>
          ) : null}

          <div className="learn-card-grid">
            {vocabulary.map((item) => (
              <button
                className="study-card-preview"
                type="button"
                key={item.id}
                onClick={() => openWord(item)}
              >
                <strong>
                  {item.word}
                  {isWordKnown(item.id) ? <span className="known-badge">✓</span> : null}
                </strong>
                <span>{t("clickPractice")}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {selectedWord ? (
        <div className="study-modal" role="dialog" aria-modal="true" aria-label={`${selectedWord.word} flash card`}>
          <div className="study-modal-backdrop" onClick={closeWord} />
          <div className="study-modal-content">
            <button className="modal-close" type="button" onClick={closeWord} aria-label={t("closeCard")}>
              ×
            </button>
            <button
              className={`flip-card ${flipped ? "flipped" : ""}`}
              type="button"
              onClick={() => setFlipped((value) => !value)}
            >
              <span className="flip-card-face flip-card-front">
                <span className="eyebrow">{t("vocabulary")}</span>
                <strong>{selectedWord.word}</strong>
                <small>{t("clickFlip")}</small>
              </span>
              <span className="flip-card-face flip-card-back">
                <span className="eyebrow">{t("details")}</span>
                <strong>{selectedWord.meaning}</strong>
                {selectedWord.pronunciation ? (
                  <span><b>{t("pronunciation")}</b> {selectedWord.pronunciation}</span>
                ) : null}
                {selectedWord.example ? (
                  <span><b>{t("exampleSentence")}</b> {selectedWord.example}</span>
                ) : null}
                <small>{t("clickFlipBack")}</small>
              </span>
            </button>
            <button
              className={`btn ${isWordKnown(selectedWord.id) ? "btn-outline" : "btn-primary"} known-toggle`}
              type="button"
              onClick={() => handleToggleKnown(selectedWord.id)}
            >
              {isWordKnown(selectedWord.id) ? t("markAsUnknown") : t("markAsKnown")}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
