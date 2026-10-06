import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";
import WordMeaningListInput from "../components/WordMeaningListInput";

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

export default function EditVocabulary() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [form, setForm] = useState({
    lesson: "",
    word: "",
    meaning: "",
    pronunciation: "",
    example: "",
    part_of_speech: "",
    difficulty: "medium",
    synonyms: [],
    antonyms: [],
  });
  const [lessons, setLessons] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [lessonResponse, vocabularyResponse] = await Promise.all([
          api.get("/lessons/"),
          api.get(`/vocabulary/${id}/`),
        ]);

        setLessons(lessonResponse.data);
        setForm({
          lesson: String(vocabularyResponse.data.lesson || ""),
          word: vocabularyResponse.data.word || "",
          meaning: vocabularyResponse.data.meaning || "",
          pronunciation: vocabularyResponse.data.pronunciation || "",
          example: vocabularyResponse.data.example || "",
          part_of_speech: vocabularyResponse.data.part_of_speech || "",
          difficulty: vocabularyResponse.data.difficulty || "medium",
          synonyms: vocabularyResponse.data.synonyms || [],
          antonyms: vocabularyResponse.data.antonyms || [],
        });
      } catch (requestError) {
        setMessage(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  function validate(currentForm) {
    const nextErrors = {};

    if (!currentForm.lesson) {
      nextErrors.lesson = "Lesson is required.";
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
      setSaving(true);
      await api.patch(`/vocabulary/${id}/`, {
        lesson: Number(form.lesson),
        word: form.word.trim(),
        meaning: form.meaning.trim(),
        pronunciation: form.pronunciation.trim(),
        example: form.example.trim(),
        part_of_speech: form.part_of_speech,
        difficulty: form.difficulty,
        synonyms: form.synonyms,
        antonyms: form.antonyms,
      });
      setMessage("Vocabulary updated successfully.");
    } catch (requestError) {
      setMessage(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="status-message">{t("loadingVocabulary")}</p>;
  }

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("admin")}</span>
          <h2>{t("updateVocabulary")}</h2>
        </div>
        <Link className="btn btn-outline" to="/admin/vocabulary">
          {t("backToVocabulary")}
        </Link>
      </div>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label>
          <span className="label-text">
            {t("lesson")} <span className="required-mark">*</span>
          </span>
          <select name="lesson" value={form.lesson} onChange={handleChange}>
            <option value="">{t("selectALesson")}</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
          {errors.lesson ? (
            <span className="field-error">{errors.lesson}</span>
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

        <WordMeaningListInput
          label={t("synonymsOptional")}
          entries={form.synonyms}
          onChange={(entries) => setForm((current) => ({ ...current, synonyms: entries }))}
        />

        <WordMeaningListInput
          label={t("antonymsOptional")}
          entries={form.antonyms}
          onChange={(entries) => setForm((current) => ({ ...current, antonyms: entries }))}
        />

        {message ? (
          <p
            className={`status-message ${message.includes("successfully") ? "success" : "error"}`}
          >
            {message}
          </p>
        ) : null}

        <div className="button-row">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? t("updating") : t("updateVocabulary")}
          </button>
        </div>
      </form>
    </section>
  );
}
