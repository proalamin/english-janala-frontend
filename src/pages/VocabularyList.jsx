import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VocabularyCard from "../components/VocabularyCard";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

const PARTS_OF_SPEECH = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "interjection",
];

export default function VocabularyList({ adminMode = false }) {
  const { t } = useLanguage();
  const [vocabulary, setVocabulary] = useState([]);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("");
  const [segments, setSegments] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  useEffect(() => {
    if (adminMode) {
      api
        .get("/segments/")
        .then((response) => setSegments(response.data))
        .catch(() => {});
    }
  }, [adminMode]);

  useEffect(() => {
    loadVocabulary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadVocabulary(options = {}) {
    const nextPage = options.page ?? page;
    const searchQuery = options.query ?? query;
    const difficultyFilter = options.difficulty ?? difficulty;
    const partOfSpeechFilter = options.partOfSpeech ?? partOfSpeech;
    const segmentFilterValue = options.segment ?? segmentFilter;

    try {
      setLoading(true);
      setError("");
      setMessage("");
      const nextQuery = searchQuery.trim();

      const params = new URLSearchParams();
      if (difficultyFilter) params.set("difficulty", difficultyFilter);
      if (partOfSpeechFilter) params.set("part_of_speech", partOfSpeechFilter);
      if (segmentFilterValue) params.set("segment", segmentFilterValue);

      if (nextQuery) {
        params.set("q", nextQuery);
        const response = await api.get(`/vocabulary/search/?${params.toString()}`);
        setVocabulary(response.data.results || []);
        setCount(response.data.count || 0);
        setHasNext(false);
        setHasPrevious(false);
        setPage(1);
      } else {
        params.set("page", nextPage);
        params.set("page_size", pageSize);
        const response = await api.get(`/vocabulary/?${params.toString()}`);
        setVocabulary(response.data.results || []);
        setCount(response.data.count || 0);
        setHasNext(Boolean(response.data.next));
        setHasPrevious(Boolean(response.data.previous));
        setPage(nextPage);
      }
      setActiveQuery(nextQuery);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadVocabulary({ page: 1 });
  }

  function handleReset() {
    setQuery("");
    setDifficulty("");
    setPartOfSpeech("");
    setSegmentFilter("");
    loadVocabulary({ page: 1, query: "", difficulty: "", partOfSpeech: "", segment: "" });
  }

  function handleDifficultyChange(event) {
    const value = event.target.value;
    setDifficulty(value);
    loadVocabulary({ page: 1, difficulty: value });
  }

  function handlePartOfSpeechChange(event) {
    const value = event.target.value;
    setPartOfSpeech(value);
    loadVocabulary({ page: 1, partOfSpeech: value });
  }

  function handleSegmentChange(event) {
    const value = event.target.value;
    setSegmentFilter(value);
    loadVocabulary({ page: 1, segment: value });
  }

  function searchSuggestion(value) {
    setQuery(value);
    loadVocabulary({ page: 1, query: value });
  }

  function goToPage(nextPage) {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }
    loadVocabulary({ page: nextPage });
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
      setMessage("Vocabulary deleted successfully.");
      loadVocabulary();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  const isSearching = Boolean(activeQuery);

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
              {count} {isSearching ? t("resultCount") : t("wordCount")}
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

        <div className="filter-row">
          <label className="search-field difficulty-filter">
            <span>{t("difficulty")}</span>
            <select value={difficulty} onChange={handleDifficultyChange}>
              <option value="">{t("allDifficulties")}</option>
              <option value="easy">{t("easy")}</option>
              <option value="medium">{t("medium")}</option>
              <option value="hard">{t("hard")}</option>
            </select>
          </label>

          <label className="search-field difficulty-filter">
            <span>{t("partOfSpeech")}</span>
            <select value={partOfSpeech} onChange={handlePartOfSpeechChange}>
              <option value="">{t("allPartsOfSpeech")}</option>
              {PARTS_OF_SPEECH.map((pos) => (
                <option key={pos} value={pos}>
                  {t(pos)}
                </option>
              ))}
            </select>
          </label>

          {adminMode ? (
            <label className="search-field difficulty-filter">
              <span>{t("segment")}</span>
              <select value={segmentFilter} onChange={handleSegmentChange}>
                <option value="">{t("allSegments")}</option>
                {segments.map((segment) => (
                  <option key={segment.id} value={segment.id}>
                    {segment.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

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
          <h3>{isSearching ? t("noMatchingWords") : t("noVocabularyFound")}</h3>
          <p>
            {isSearching
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

      {!isSearching && !loading && !error && count > pageSize ? (
        <div className="pagination">
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={!hasPrevious}
          >
            {t("previousPage")}
          </button>
          <span className="pagination-info">
            {t("page")} {page} {t("of")} {totalPages}
          </span>
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={!hasNext}
          >
            {t("nextPage")}
          </button>
        </div>
      ) : null}
    </section>
  );
}
