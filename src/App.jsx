import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LessonList from "./pages/LessonList";
import AddLesson from "./pages/AddLesson";
import EditLesson from "./pages/EditLesson";
import LessonVocabulary from "./pages/LessonVocabulary";
import VocabularyList from "./pages/VocabularyList";
import LearnCards from "./pages/LearnCards";
import AddVocabulary from "./pages/AddVocabulary";
import EditVocabulary from "./pages/EditVocabulary";
import WordDetails from "./pages/WordDetails";
import AdminDashboard from "./pages/AdminDashboard";

function LegacyRedirect({ to }) {
  const params = window.location.pathname.split("/").filter(Boolean);
  const id = params[1];
  return <Navigate to={id ? `${to}/${id}` : to} replace />;
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student/lessons" element={<LessonList />} />
          <Route path="/student/lessons/:id" element={<LessonVocabulary />} />
          <Route path="/student/vocabulary" element={<VocabularyList />} />
          <Route path="/student/learn-cards" element={<LearnCards />} />
          <Route path="/student/vocabulary/:id" element={<WordDetails backTo="/student/vocabulary" />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/lessons" element={<LessonList adminMode />} />
          <Route path="/admin/lessons/new" element={<AddLesson />} />
          <Route path="/admin/lessons/:id/edit" element={<EditLesson />} />
          <Route path="/admin/lessons/:id" element={<LessonVocabulary adminMode />} />
          <Route path="/admin/vocabulary" element={<VocabularyList adminMode />} />
          <Route path="/admin/vocabulary/new" element={<AddVocabulary />} />
          <Route path="/admin/vocabulary/:id/edit" element={<EditVocabulary />} />
          <Route path="/admin/vocabulary/:id" element={<WordDetails backTo="/admin/vocabulary" />} />

          <Route path="/lessons" element={<Navigate to="/student/lessons" replace />} />
          <Route path="/lessons/:id" element={<LegacyRedirect to="/student/lessons" />} />
          <Route path="/vocabulary" element={<Navigate to="/student/vocabulary" replace />} />
          <Route path="/vocabulary/:id" element={<LegacyRedirect to="/student/vocabulary" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
