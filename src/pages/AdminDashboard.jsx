import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Admin</span>
          <h2>Content Management</h2>
          <p className="muted-text">
            Manage lesson and vocabulary records with Create, View, and Update
            operations.
          </p>
        </div>
      </div>

      <div className="grid two-column-grid">
        <article className="card">
          <h3>Lessons</h3>
          <p className="muted-text">
            Add new lessons, view the lesson list, and update lesson details.
          </p>
          <div className="button-row">
            <Link className="btn btn-primary" to="/admin/lessons">
              Manage Lessons
            </Link>
            <Link className="btn btn-outline" to="/admin/lessons/new">
              Add Lesson
            </Link>
          </div>
        </article>

        <article className="card">
          <h3>Vocabulary</h3>
          <p className="muted-text">
            Add vocabulary, search all records, and update word information.
          </p>
          <div className="button-row">
            <Link className="btn btn-primary" to="/admin/vocabulary">
              Manage Vocabulary
            </Link>
            <Link className="btn btn-outline" to="/admin/vocabulary/new">
              Add Vocabulary
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
