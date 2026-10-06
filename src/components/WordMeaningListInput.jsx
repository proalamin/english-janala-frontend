import { useLanguage } from "../language";

export default function WordMeaningListInput({ label, entries, onChange }) {
  const { t } = useLanguage();

  function updateEntry(index, field, value) {
    const next = entries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry,
    );
    onChange(next);
  }

  function addRow() {
    onChange([...entries, { word: "", meaning: "" }]);
  }

  function removeRow(index) {
    onChange(entries.filter((_, i) => i !== index));
  }

  return (
    <div className="word-meaning-list">
      <span className="label-text">{label}</span>
      {entries.map((entry, index) => (
        <div className="word-meaning-row" key={index}>
          <input
            placeholder={t("wordLabel")}
            value={entry.word}
            onChange={(event) => updateEntry(index, "word", event.target.value)}
          />
          <input
            placeholder={t("meaningLabel")}
            value={entry.meaning}
            onChange={(event) => updateEntry(index, "meaning", event.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline word-meaning-remove"
            onClick={() => removeRow(index)}
          >
            {t("remove")}
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline word-meaning-add" onClick={addRow}>
        {t("addRow")}
      </button>
    </div>
  );
}
