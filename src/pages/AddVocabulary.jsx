import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

const initialForm = {
  segment: "",
  word: "",
  meaning: "",
  pronunciation: "",
  example: "",
  part_of_speech: "",
  difficulty: "medium",
  synonyms: "",
  antonyms: "",
};

export default function AddVocabulary() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [segments, setSegments] = useState([]);
  const [form, setForm] = useState({
    ...initialForm,
    segment: searchParams.get("segment") || "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSegments() {
      try {
        const response = await api.get("/segments/");
        setSegments(response.data);
      } catch (requestError) {
        setMessage(getApiErrorMessage(requestError));
      }
    }

    fetchSegments();
  }, []);

  function validate(currentForm) {
    const nextErrors = {};

    if (!currentForm.segment) {
      nextErrors.segment = "Segment is required.";
    }
    if (!currentForm.word.trim()) {
      nextErrors.word = "English word is required.";
    } else if (currentForm.word.length > 100) {
      nextErrors.word = "English word cannot exceed 100 characters.";
    }
    if (!currentForm.meaning.trim()) {
      nextErrors.meaning = "Bengali meaning is required.";
    } else if (currentForm.meaning.length > 255) {
      nextErrors.meaning = "Bengali meaning cannot exceed 255 characters.";
    }
    if (currentForm.pronunciation.length > 150) {
      nextErrors.pronunciation = "Pronunciation cannot exceed 150 characters.";
    }

    return nextErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/segments/${form.segment}/vocabulary/`, {
        word: form.word.trim(),
        meaning: form.meaning.trim(),
        pronunciation: form.pronunciation.trim(),
        example: form.example.trim(),
        part_of_speech: form.part_of_speech,
        difficulty: form.difficulty,
        synonyms: form.synonyms.trim(),
        antonyms: form.antonyms.trim(),
      });
      setMessage(
        `Vocabulary created successfully. Added to "${response.data.lesson_title}" (Bundle ${response.data.bundle_serial}).`,
      );
      setForm({ ...initialForm, segment: form.segment });
    } catch (requestError) {
      setMessage(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("admin")}</span>
          <h2>{t("addVocabulary")}</h2>
          <p className="muted-text">{t("addVocabularyCopy")}</p>
        </div>
        <Link className="btn btn-outline" to="/admin/vocabulary">
          {t("backToVocabulary")}
        </Link>
      </div>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label>
          <span className="label-text">
            {t("segment")} <span className="required-mark">*</span>
          </span>
          <select name="segment" value={form.segment} onChange={handleChange}>
            <option value="">{t("selectASegment")}</option>
            {segments.map((segment) => (
              <option key={segment.id} value={segment.id}>
                {segment.name}
              </option>
            ))}
          </select>
          {errors.segment ? (
            <span className="field-error">{errors.segment}</span>
          ) : null}
        </label>

        <label>
          <span className="label-text">
            {t("englishWordLabel")} <span className="required-mark">*</span>
          </span>
          <input
            name="word"
            value={form.word}
            onChange={handleChange}
          />
          {errors.word ? (
            <span className="field-error">{errors.word}</span>
          ) : null}
        </label>

        <label>
          <span className="label-text">
            {t("bengaliMeaningLabel")} <span className="required-mark">*</span>
          </span>
          <input
            name="meaning"
            value={form.meaning}
            onChange={handleChange}
          />
          {errors.meaning ? (
            <span className="field-error">{errors.meaning}</span>
          ) : null}
        </label>

        <label>
          <span className="label-text">{t("exampleOptional")}</span>
          <textarea
            name="example"
            rows="4"
            value={form.example}
            onChange={handleChange}
          />
        </label>

        <label>
          <span className="label-text">{t("partOfSpeech")}</span>
          <select name="part_of_speech" value={form.part_of_speech} onChange={handleChange}>
            <option value="">{t("selectOptional")}</option>
            {PARTS_OF_SPEECH.map((pos) => (
              <option key={pos} value={pos}>
                {t(pos)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="label-text">{t("difficulty")}</span>
          <select name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option value="easy">{t("easy")}</option>
            <option value="medium">{t("medium")}</option>
            <option value="hard">{t("hard")}</option>
          </select>
        </label>

        <label>
          <span className="label-text">{t("synonymsOptional")}</span>
          <input
            name="synonyms"
            value={form.synonyms}
            onChange={handleChange}
            placeholder={t("commaSeparatedPlaceholder")}
          />
        </label>

        <label>
          <span className="label-text">{t("antonymsOptional")}</span>
          <input
            name="antonyms"
            value={form.antonyms}
            onChange={handleChange}
            placeholder={t("commaSeparatedPlaceholder")}
          />
        </label>

        {message ? (
          <p
            className={`status-message ${message.includes("successfully") ? "success" : "error"}`}
          >
            {message}
          </p>
        ) : null}

        <div className="button-row">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t("saving") : t("saveVocabulary")}
          </button>
        </div>
      </form>
    </section>
  );
}
