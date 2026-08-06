import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about">
          <Link to="/" className="footer-brand-block">
            <span className="footer-mark">EJ</span>
            <span>
              <strong>English Janala</strong>
              <small>Vocabulary Learning App</small>
            </span>
          </Link>
          <p>
            A responsive DBMS project for organizing English vocabulary into
            lessons with Bengali meanings, examples, search, and content
            management.
          </p>
        </div>

        <div className="footer-column">
          <h3>Learn</h3>
          <Link to="/student/lessons">Browse Lessons</Link>
          <Link to="/student/vocabulary">Search Vocabulary</Link>
        </div>

        <div className="footer-column">
          <h3>Admin</h3>
          <Link to="/admin">Admin Panel</Link>
          <Link to="/admin/lessons">Manage Lessons</Link>
          <Link to="/admin/vocabulary">Manage Vocabulary</Link>
          <span className="footer-url">/admin</span>
        </div>

        <div className="footer-column">
          <h3>Project</h3>
          <span>React + Django REST</span>
          <span>SQLite Database</span>
          <span>Week 2 C/R/U Scope</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>UU Dev Nest Database Management System Project</span>
        <span>Built for vocabulary learning and content management</span>
      </div>
    </footer>
  );
}
