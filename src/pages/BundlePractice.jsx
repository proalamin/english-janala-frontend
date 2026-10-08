import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";
import { getKnownCount } from "../progress";
import { useAuth } from "../auth";
import LoginRequired from "../components/LoginRequired";

function IconCards() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="14" height="14" rx="2" />
      <path d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h11A1.5 1.5 0 0 1 21 4.5v11a1.5 1.5 0 0 1-1.5 1.5H18" />
    </svg>
  );
}

function IconPuzzle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h3a1.5 1.5 0 0 1 0 3 1.5 1.5 0 0 0 0 3h5v5a1.5 1.5 0 0 1-3 0 1.5 1.5 0 0 0-3 0v3H8a1.5 1.5 0 0 1 0-3 1.5 1.5 0 0 0 0-3H3V9a1.5 1.5 0 0 1 3 0 1.5 1.5 0 0 0 3 0V3Z" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 2 4 4-13 13-5 1 1-5Z" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h9l5 5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4.5 20V3.5A1.5 1.5 0 0 1 6 2Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

export default function BundlePractice() {
  const { t } = useLanguage();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [bundle, setBundle] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const bundleResponse = await api.get(`/lessons/${id}/`);
        setBundle(bundleResponse.data);
        const vocabularyResponse = await api.get(`/lessons/${id}/vocabulary/`);
        setVocabulary(vocabularyResponse.data);
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

  const total = vocabulary.length;
  const known =
    isAuthenticated && bundle?.known_count != null
      ? bundle.known_count
      : getKnownCount(vocabulary.map((item) => item.id));

  if (loading) {
    return <p className="status-message">{t("loadingBundles")}</p>;
  }

  if (locked) {
    return <LoginRequired />;
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("practiceVocabulary")}</span>
          <h2>{bundle?.title || t("lesson")}</h2>
          <p className="muted-text">{t("practiceHubCopy")}</p>
        </div>
        <Link className="btn btn-outline" to={`/student/bundles/${id}`}>
          {t("viewWordList")}
        </Link>
      </div>

      {error ? <p className="status-message error">{error}</p> : null}

      <div className="practice-hub-grid">
        <Link to={`/student/bundles/${id}/flashcards`} className="practice-card practice-card--flash">
          <span className="practice-card-icon"><IconCards /></span>
          <h3>{t("flashCards")}</h3>
          <p>{t("flashCardsCopy")}</p>
          <span className="practice-card-sub">{total} {t("words")}</span>
        </Link>

        <Link to={`/student/bundles/${id}/match`} className="practice-card practice-card--match">
          <span className="practice-card-icon"><IconPuzzle /></span>
          <h3>{t("matchWords")}</h3>
          <p>{t("matchWordsCopy")}</p>
          <div className="practice-card-stat">
            <strong>{known}/{total}</strong>
          </div>
          <span className="practice-card-sub">{Math.ceil(total / 4)} {t("rounds")}</span>
          <div className="practice-card-track">
            <div
              className="practice-card-fill"
              style={{ width: `${total ? Math.round((known / total) * 100) : 0}%` }}
            />
          </div>
        </Link>

        <div className="practice-card practice-card--sentence practice-card--soon">
          <span className="soon-badge">{t("comingSoon")}</span>
          <span className="practice-card-icon"><IconPencil /></span>
          <h3>{t("useInSentence")}</h3>
          <p>{t("useInSentenceCopy")}</p>
          <div className="practice-card-stat">
            <strong>0/{total}</strong>
          </div>
          <span className="practice-card-sub">{t("topScore")}: —</span>
          <div className="practice-card-track">
            <div className="practice-card-fill" style={{ width: "0%" }} />
          </div>
        </div>

        <div className="practice-card practice-card--test practice-card--soon">
          <span className="soon-badge">{t("comingSoon")}</span>
          <span className="practice-card-icon"><IconDoc /></span>
          <h3>{t("synonymAntonymTest")}</h3>
          <p>{t("optionalExam")}</p>
          <div className="practice-card-stat">
            <strong>{total} {t("questionsLabel")}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
