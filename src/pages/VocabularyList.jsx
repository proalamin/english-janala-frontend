import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VocabularyCard from "../components/VocabularyCard";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

export default function VocabularyList({ adminMode = false }) {
  const { t } = useLanguage();
  const [vocabulary, setVocabulary] = useState([]);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadVocabulary();
  }, []);

  async function loadVocabulary(searchQuery = "", difficultyFilter = difficulty) {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const nextQuery = searchQuery.trim();
      const params = difficultyFilter ? `&difficulty=${difficultyFilter}` : "";
      const endpoint = nextQuery
        ? `/vocabulary/search/?q=${encodeURIComponent(nextQuery)}${params}`
        : `/vocabulary/?${params.replace(/^&/, "")}`;
      const response = await api.get(endpoint);
      setVocabulary(nextQuery ? response.data.results || [] : response.data);
      setActiveQuery(nextQuery);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadVocabulary(query, difficulty);
  }

  function handleReset() {
    setQuery("");
    setDifficulty("");
    loadVocabulary("", "");
  }

  function handleDifficultyChange(event) {
    const value = event.target.value;
    setDifficulty(value);
    loadVocabulary(query, value);
  }

  function searchSuggestion(value) {
    setQuery(value);
    loadVocabulary(value, difficulty);
  }

  async function deleteVocabulary(item) {
    const confirmed = window.confirm(`Delete vocabulary "${item.word}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");
      await api.delete(`/vocabulary/${item.id}/`);
      setVocabulary((current) =>
        current.filter((vocabularyItem) => vocabularyItem.id !== item.id),
      );
      setMessage("Vocabulary deleted successfully.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{adminMode ? t("admin") : t("learnVocabulary")}</span>
          <h2>{adminMode ? t("manageVocabulary") : t("searchVocabularyHeading")}</h2>
        </div>
        {adminMode ? (
          <Link className="btn btn-primary" to="/admin/vocabulary/new">
            {t("addVocabulary")}
          </Link>
        ) : (
          <Link className="btn btn-primary" to="/student/learn-cards">
            {t("learnUsingCards")}
          </Link>
        )}
      </div>

      <div className="search-panel card">
        <div className="search-panel-heading">
          <div>
            <h3>{adminMode ? t("findVocabularyRecord") : t("findWord")}</h3>
            <p>{t("searchPanelCopy")}</p>
          </div>
          {!loading && !error ? (
            <span className="result-count">
              {activeQuery ? `${vocabulary.length} ${t("resultCount")}` : `${vocabulary.length} ${t("wordCount")}`}
            </span>
          ) : null}
        </div>

        <form className="search-bar" onSubmit={handleSubmit}>
          <label className="search-field">
            <span>{t("vocabularySearch")}</span>
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            {t("search")}
          </button>
          <button className="btn btn-outline" type="button" onClick={handleReset}>
            {t("reset")}
          </button>
        </form>

        <label className="search-field difficulty-filter">
          <span>{t("difficulty")}</span>
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value="">{t("allDifficulties")}</option>
            <option value="easy">{t("easy")}</option>
            <option value="medium">{t("medium")}</option>
            <option value="hard">{t("hard")}</option>
          </select>
        </label>

        <div className="search-suggestions" aria-label={t("searchSuggestions")}>
          <span>{t("try")}</span>
          {["Hello", "মা", "Rice"].map((item) => (
            <button type="button" key={item} onClick={() => searchSuggestion(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p className="status-message">{t("loadingVocabulary")}</p> : null}
      {error ? <p className="status-message error">{error}</p> : null}
      {message ? <p className="status-message success">{message}</p> : null}

      {!loading && !error && vocabulary.length === 0 ? (
        <div className="empty-state card">
          <h3>{activeQuery ? t("noMatchingWords") : t("noVocabularyFound")}</h3>
          <p>
            {activeQuery
              ? `${t("noResultMatched")} "${activeQuery}".`
              : adminMode
                ? t("addVocabularyPrompt")
                : t("noVocabularyAvailable")}
          </p>
          {adminMode ? (
            <Link className="btn btn-primary" to="/admin/vocabulary/new">
              {t("addVocabulary")}
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="grid two-column-grid">
        {vocabulary.map((item) => (
          <VocabularyCard
            key={item.id}
            item={item}
            adminMode={adminMode}
            onDelete={deleteVocabulary}
          />
        ))}
      </div>
    </section>
  );
}
