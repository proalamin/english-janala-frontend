import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";
import { useAuth } from "../auth";
import LoginRequired from "../components/LoginRequired";

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const ROUND_SIZE = 4;

export default function MatchWords() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);

  const [roundIndex, setRoundIndex] = useState(0);
  const [shuffledMeanings, setShuffledMeanings] = useState([]);
  const [placements, setPlacements] = useState({});
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [status, setStatus] = useState("playing");
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/lessons/${id}/vocabulary/`);
        setVocabulary(response.data);
      } catch (requestError) {
        if (requestError.response?.status === 403) {
          setLocked(true);
        } else {
          setError(getApiErrorMessage(requestError));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const rounds = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < vocabulary.length; i += ROUND_SIZE) {
      chunks.push(vocabulary.slice(i, i + ROUND_SIZE));
    }
    return chunks;
  }, [vocabulary]);

  const roundWords = rounds[roundIndex] || [];

  useEffect(() => {
    setShuffledMeanings(shuffle(roundWords));
    setPlacements({});
    setSelectedWordId(null);
    setStatus("playing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex, rounds.length]);

  if (loading) {
    return <p className="status-message">{t("loadingVocabulary")}</p>;
  }

  if (locked) {
    return <LoginRequired />;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  if (rounds.length === 0) {
    return (
      <div className="empty-state card">
        <h3>{t("noVocabularyFound")}</h3>
        <p>{t("lessonNoVocabulary")}</p>
      </div>
    );
  }

  const placedWordIds = new Set(Object.values(placements).filter(Boolean));
  const availableWords = roundWords.filter((w) => !placedWordIds.has(w.id));

  function handleChipTap(wordId) {
    if (status !== "playing") return;
    setSelectedWordId((current) => (current === wordId ? null : wordId));
  }

  function handleBoxTap(meaningVocabId) {
    if (status !== "playing") return;
    const existing = placements[meaningVocabId];

    if (existing) {
      setPlacements((current) => {
        const next = { ...current };
        delete next[meaningVocabId];
        return next;
      });
      return;
    }

    if (selectedWordId) {
      setPlacements((current) => ({ ...current, [meaningVocabId]: selectedWordId }));
      setSelectedWordId(null);
    }
  }

  function handleSubmit() {
    if (status !== "playing") return;
    let correctCount = 0;
    const correctWordIds = [];
    shuffledMeanings.forEach((meaningItem) => {
      if (placements[meaningItem.id] === meaningItem.id) {
        correctCount += 1;
        correctWordIds.push(meaningItem.id);
      }
    });
    setScore((current) => ({
      correct: current.correct + correctCount,
      attempted: current.attempted + shuffledMeanings.length,
    }));
    setStatus("submitted");

    if (isAuthenticated && correctWordIds.length > 0) {
      api.post("/progress/words/", { vocabulary_ids: correctWordIds }).catch(() => {});
    }
  }

  function handleSolution() {
    if (status === "solved") return;
    const solved = {};
    shuffledMeanings.forEach((meaningItem) => {
      solved[meaningItem.id] = meaningItem.id;
    });
    setPlacements(solved);
    setSelectedWordId(null);
    setStatus("solved");
  }

  function handleNext() {
    setRoundIndex((current) => (current + 1 < rounds.length ? current + 1 : current));
  }

  function wordById(wordId) {
    return roundWords.find((w) => w.id === wordId);
  }

  const isLocked = status !== "playing";
  const selectedWord = selectedWordId ? wordById(selectedWordId) : null;

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("matchWords")}</span>
          <h2>{t("matchWords")}</h2>
          <p className="muted-text">{t("matchWordsInstructions")}</p>
        </div>
      </div>

      <div className="match-card card">
        <div className="match-topbar">
          <button
            type="button"
            className="match-exit"
            onClick={() => navigate(`/student/bundles/${id}/practice`)}
          >
            <IconArrowLeft />
            <span>{t("exit")}</span>
          </button>
          {score.attempted > 0 ? (
            <span className="match-score">{t("score")}: {score.correct}/{score.attempted}</span>
          ) : null}
        </div>

        {selectedWord ? (
          <div className="match-selected-bar">
            <span className="match-selected-label">{t("selectedWord")}</span>
            <span className="match-selected-chip">{selectedWord.word}</span>
          </div>
        ) : null}

        <div className="match-rounds">
          {rounds.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`match-round-dot ${i === roundIndex ? "active" : ""}`}
              onClick={() => setRoundIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="match-chip-row">
          {availableWords.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`match-chip ${selectedWordId === item.id ? "selected" : ""}`}
              onClick={() => handleChipTap(item.id)}
            >
              {item.word}
            </button>
          ))}
          {availableWords.length === 0 ? (
            <span className="muted-text match-chip-empty">{t("allWordsPlaced")}</span>
          ) : null}
        </div>

        <div className="match-rows">
          {shuffledMeanings.map((meaningItem) => {
            const placedWordId = placements[meaningItem.id];
            const placedWord = placedWordId ? wordById(placedWordId) : null;
            const isCorrect = placedWordId === meaningItem.id;
            let boxClass = "match-drop-box";
            if (isLocked && placedWord) {
              boxClass += isCorrect ? " correct" : " incorrect";
            } else if (placedWord) {
              boxClass += " filled";
            }

            return (
              <div className="match-row" key={meaningItem.id}>
                <button
                  type="button"
                  className={boxClass}
                  onClick={() => handleBoxTap(meaningItem.id)}
                  disabled={isLocked && status === "solved"}
                >
                  {placedWord ? placedWord.word : ""}
                </button>
                <div className="match-meaning-box">{meaningItem.meaning}</div>
              </div>
            );
          })}
        </div>

        <div className="match-actions">
          <button
            type="button"
            className="btn match-btn"
            onClick={handleNext}
            disabled={roundIndex >= rounds.length - 1}
          >
            {t("nextPage")}
          </button>
          <button
            type="button"
            className="btn match-btn"
            onClick={handleSubmit}
            disabled={isLocked || Object.keys(placements).length !== shuffledMeanings.length}
          >
            {t("submit")}
          </button>
          <button type="button" className="btn match-btn" onClick={handleSolution} disabled={status === "solved"}>
            {t("solution")}
          </button>
        </div>
      </div>
    </section>
  );
}
