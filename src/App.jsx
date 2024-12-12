import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./routes/Home";
import Login from "./routes/auth/Login";
import Signup from "./routes/auth/Signup";
import ProtectedRoute from "./routes/auth/ProtectedRoute";
import Dashboard from "./routes/admin/dashboard";
import Lesson from "./routes/user/lesson/page";
import Tutorial from "./routes/user/tutorial/page";
import NavBar from "./components/common/NavBar";
import Layout from "./routes/admin/layout";
// import Lessons from "./routes/admin/lessons";
import AddLessons from "./routes/admin/add-lessons";
import AddVocabularies from "./routes/admin/add-vocabularies";
import ManageUsers from "./routes/admin/manage-users";
import LessonManagement from "./routes/admin/lesson-management";
import VocabularyManagement from "./routes/admin/vocabulary-management";
import LessonPage from "./routes/user/lesson/lesson-page";
import TutorialManagement from "./routes/admin/tutorial-management";

function App() {
  return (
<>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Lesson />
            </ProtectedRoute>
          }
        />

<Route
          path="/lessons/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <LessonPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutorials"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Tutorial />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lesson-management" element={<LessonManagement />} />
          {/* <Route path="lessons" element={<Lessons />} /> */}
          <Route path="add-lessons" element={<AddLessons />} />
          <Route path="add-vocabularies" element={<AddVocabularies />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="vocabulary-management" element={<VocabularyManagement />} />
          <Route path="tutorial-management" element={<TutorialManagement />} />
        </Route>
      </Routes>
      </>
  );
}

export default App;
