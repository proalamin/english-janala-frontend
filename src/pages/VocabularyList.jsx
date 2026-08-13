import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VocabularyCard from "../components/VocabularyCard";
import { api, getApiErrorMessage } from "../api/axios";

export default function VocabularyList({ adminMode = false }) {
  const [vocabulary, setVocabulary] = useState([]);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadVocabulary();
  }, []);

  async function loadVocabulary(searchQuery = "") {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const nextQuery = searchQuery.trim();
      const endpoint = nextQuery
        ? `/vocabulary/search/?q=${encodeURIComponent(nextQuery)}`
        : "/vocabulary/";
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
    loadVocabulary(query);
  }

  function handleReset() {
    setQuery("");
    loadVocabulary("");
  }

  function searchSuggestion(value) {
    setQuery(value);
    loadVocabulary(value);
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
          <span className="eyebrow">{adminMode ? "Admin" : "Vocabulary"}</span>
          <h2>{adminMode ? "Manage Vocabulary" : "Search Vocabulary"}</h2>
        </div>
        {adminMode ? (
          <Link className="btn btn-primary" to="/admin/vocabulary/new">
            Add Vocabulary
          </Link>
        ) : (
          <Link className="btn btn-primary" to="/student/learn-cards">
            Learn Using Cards
          </Link>
        )}
      </div>

      <div className="search-panel card">
        <div className="search-panel-heading">
          <div>
            <h3>{adminMode ? "Find a vocabulary record" : "Find a word"}</h3>
            <p>
              Search using an English word or Bengali meaning. Results update
              from the vocabulary database.
            </p>
          </div>
          {!loading && !error ? (
            <span className="result-count">
              {activeQuery ? `${vocabulary.length} result(s)` : `${vocabulary.length} word(s)`}
            </span>
          ) : null}
        </div>

        <form className="search-bar" onSubmit={handleSubmit}>
          <label className="search-field">
            <span>Vocabulary search</span>
            <input
              type="search"
              placeholder="Example: Hello, মা, Rice"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Search
          </button>
          <button className="btn btn-outline" type="button" onClick={handleReset}>
            Reset
          </button>
        </form>

        <div className="search-suggestions" aria-label="Search suggestions">
          <span>Try:</span>
          {["Hello", "মা", "Rice"].map((item) => (
            <button type="button" key={item} onClick={() => searchSuggestion(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p className="status-message">Loading vocabulary...</p> : null}
      {error ? <p className="status-message error">{error}</p> : null}
      {message ? <p className="status-message success">{message}</p> : null}

      {!loading && !error && vocabulary.length === 0 ? (
        <div className="empty-state card">
          <h3>{activeQuery ? "No matching words found" : "No vocabulary found"}</h3>
          <p>
            {activeQuery
              ? `No result matched "${activeQuery}". Try another English word or Bengali meaning.`
              : adminMode
                ? "Add vocabulary records to start building the database."
                : "Vocabulary records are not available yet."}
          </p>
          {adminMode ? (
            <Link className="btn btn-primary" to="/admin/vocabulary/new">
              Add Vocabulary
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
