import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import SegmentList from "./pages/SegmentList";
import AddSegment from "./pages/AddSegment";
import EditSegment from "./pages/EditSegment";
import SegmentBundles from "./pages/SegmentBundles";
import AddLesson from "./pages/AddLesson";
import EditLesson from "./pages/EditLesson";
import LessonVocabulary from "./pages/LessonVocabulary";
import BundlePractice from "./pages/BundlePractice";
import FlashCards from "./pages/FlashCards";
import VocabularyList from "./pages/VocabularyList";
import LearnCards from "./pages/LearnCards";
import AddVocabulary from "./pages/AddVocabulary";
import EditVocabulary from "./pages/EditVocabulary";
import WordDetails from "./pages/WordDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AllBundles from "./pages/AllBundles";
import { useLanguage } from "./language";


function RouteLoader() {
  const location = useLocation();
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [firstPath, setFirstPath] = useState(location.pathname);

  useEffect(() => {
    if (firstPath === location.pathname) {
      setFirstPath(null);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 520);
    return () => window.clearTimeout(timer);
  }, [firstPath, location.pathname]);

  if (!visible) {
    return null;
  }

  return (
    <div className="route-loader" role="status" aria-live="polite">
      <div className="route-loader-card">
        <div className="letter-loader" aria-hidden="true">
          <span>E</span>
          <span>J</span>
          <span>অ</span>
        </div>
        <strong>{t("routeLoading")}</strong>
        <p>{t("routeLoadingHint")}</p>
        <div className="loader-progress" aria-hidden="true" />
      </div>
    </div>
  );
}

function LegacyRedirect({ to }) {
  const params = window.location.pathname.split("/").filter(Boolean);
  const id = params[1];
  return <Navigate to={id ? `${to}/${id}` : to} replace />;
}

function PublicLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <RouteLoader />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/student/segments" element={<SegmentList />} />
          <Route path="/student/segments/:id" element={<SegmentBundles />} />
          <Route path="/student/bundles/:id" element={<LessonVocabulary />} />
          <Route path="/student/bundles/:id/practice" element={<BundlePractice />} />
          <Route path="/student/vocabulary" element={<VocabularyList />} />
          <Route path="/student/learn-cards" element={<LearnCards />} />
          <Route path="/student/vocabulary/:id" element={<WordDetails backTo="/student/vocabulary" />} />

          <Route path="/lessons" element={<Navigate to="/student/segments" replace />} />
          <Route path="/lessons/:id" element={<LegacyRedirect to="/student/bundles" />} />
          <Route path="/vocabulary" element={<Navigate to="/student/vocabulary" replace />} />
          <Route path="/vocabulary/:id" element={<LegacyRedirect to="/student/vocabulary" />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="segments" element={<SegmentList adminMode />} />
          <Route path="segments/new" element={<AddSegment />} />
          <Route path="segments/:id/edit" element={<EditSegment />} />
          <Route path="segments/:id" element={<SegmentBundles adminMode />} />
          <Route path="bundles" element={<AllBundles />} />
          <Route path="bundles/new" element={<AddLesson />} />
          <Route path="bundles/:id/edit" element={<EditLesson />} />
          <Route path="bundles/:id" element={<LessonVocabulary adminMode />} />
          <Route path="vocabulary" element={<VocabularyList adminMode />} />
          <Route path="vocabulary/new" element={<AddVocabulary />} />
          <Route path="vocabulary/:id/edit" element={<EditVocabulary />} />
          <Route path="vocabulary/:id" element={<WordDetails backTo="/admin/vocabulary" />} />
        </Route>

        <Route path="/student/bundles/:id/flashcards" element={<FlashCards />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
