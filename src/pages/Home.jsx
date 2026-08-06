import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home-page">
      <div className="hero">
        <div className="hero-content">
          <span className="eyebrow">Vocabulary Learning Platform</span>
          <h1>English Janala</h1>
          <p>
            Learn English vocabulary lesson by lesson with Bengali meanings,
            useful examples, and a clean search experience for quick revision.
          </p>

          <div className="button-row">
            <Link to="/student/lessons" className="btn btn-primary">
              Start Learning
            </Link>
            <Link to="/student/vocabulary" className="btn btn-secondary">
              Search Vocabulary
            </Link>
          </div>
        </div>

        <div className="hero-panel card">
          <span className="eyebrow">For Students</span>
          <h2>Learn with simple steps</h2>
          <div className="learning-steps">
            <div>
              <strong>1</strong>
              <span>Choose a lesson</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Read vocabulary</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Search and review</span>
            </div>
          </div>
        </div>
      </div>

      <div className="home-grid">
        <article className="card feature-card">
          <span className="pill">Lessons</span>
          <h3>Organized vocabulary</h3>
          <p>
            Browse lessons such as greetings, family, and food, then open each
            lesson to view its related words.
          </p>
          <Link className="text-link" to="/student/lessons">
            View lessons
          </Link>
        </article>

        <article className="card feature-card">
          <span className="pill">Search</span>
          <h3>Find words quickly</h3>
          <p>
            Search vocabulary by English word or Bengali meaning and open the
            details page for examples when available.
          </p>
          <Link className="text-link" to="/student/vocabulary">
            Search words
          </Link>
        </article>

      </div>
    </section>
  );
}
