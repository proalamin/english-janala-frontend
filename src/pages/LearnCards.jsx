import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";

export default function LearnCards() {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingVocabulary, setLoadingVocabulary] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Learn</span>
          <h2>Learn Using Cards</h2>
          <p className="muted-text">Choose a lesson, then practice each vocabulary word with a flip card.</p>
        </div>
        <Link className="btn btn-outline" to="/student/vocabulary">
          Back to Vocabulary
        </Link>
      </div>

      {error ? <p className="status-message error">{error}</p> : null}

      <div className="learn-layout">
        <section className="learn-panel card">
          <div className="learn-panel-heading">
            <span className="eyebrow">Step 1</span>
            <h3>Select Lesson</h3>
          </div>

          {loadingLessons ? <p className="status-message">Loading lessons...</p> : null}

          <div className="learn-lesson-list">
            {lessons.map((lesson) => (
              <button
                className={`learn-lesson-button ${selectedLesson?.id === lesson.id ? "active" : ""}`}
                type="button"
                key={lesson.id}
                onClick={() => openLesson(lesson)}
              >
                <strong>{lesson.title}</strong>
                <span>{lesson.description || "Practice this lesson."}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="learn-panel card">
          <div className="learn-panel-heading">
            <span className="eyebrow">Step 2</span>
            <h3>{selectedLesson ? `${selectedLesson.title} Cards` : "Vocabulary Cards"}</h3>
          </div>

          {!selectedLesson ? (
            <p className="muted-text">Select a lesson first to see vocabulary cards.</p>
          ) : null}

          {loadingVocabulary ? <p className="status-message">Loading vocabulary...</p> : null}

          {selectedLesson && !loadingVocabulary && vocabulary.length === 0 ? (
            <p className="muted-text">No vocabulary is available for this lesson.</p>
          ) : null}

          <div className="learn-card-grid">
            {vocabulary.map((item) => (
              <button
                className="study-card-preview"
                type="button"
                key={item.id}
                onClick={() => openWord(item)}
              >
                <strong>{item.word}</strong>
                <span>Click to practice</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {selectedWord ? (
        <div className="study-modal" role="dialog" aria-modal="true" aria-label={`${selectedWord.word} flash card`}>
          <div className="study-modal-backdrop" onClick={closeWord} />
          <div className="study-modal-content">
            <button className="modal-close" type="button" onClick={closeWord} aria-label="Close card">
              ×
            </button>
            <button
              className={`flip-card ${flipped ? "flipped" : ""}`}
              type="button"
              onClick={() => setFlipped((value) => !value)}
            >
              <span className="flip-card-face flip-card-front">
                <span className="eyebrow">Vocabulary</span>
                <strong>{selectedWord.word}</strong>
                <small>Click card to flip</small>
              </span>
              <span className="flip-card-face flip-card-back">
                <span className="eyebrow">Details</span>
                <strong>{selectedWord.meaning}</strong>
                {selectedWord.pronunciation ? (
                  <span><b>Pronunciation:</b> {selectedWord.pronunciation}</span>
                ) : null}
                {selectedWord.example ? (
                  <span><b>Example:</b> {selectedWord.example}</span>
                ) : null}
                <small>Click card to flip back</small>
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
