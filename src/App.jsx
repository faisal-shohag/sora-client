import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./routes/Home";
import Login from "./routes/auth/Login";
import Signup from "./routes/auth/Signup";
import AuthProvider from "./providers/AuthProvider";
import ProtectedRoute from "./routes/auth/ProtectedRoute";
import Dashboard from "./routes/admin/dashboard";
import Lesson from "./routes/user/lesson/page";
import Tutorial from "./routes/user/tutorial/page";
import NavBar from "./components/common/NavBar";
import Layout from "./routes/admin/layout";
import Lessons from "./routes/admin/lessons";
import AddLessons from "./routes/admin/add-lessons";
import AddVocabularies from "./routes/admin/add-vocabularies";
import ManageUsers from "./routes/admin/manage-users";
import LessonManagement from "./routes/admin/lesson-management";
import VocabularyManagement from "./routes/admin/vocabulary-management";

function App() {
  return (
    <AuthProvider>
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
          <Route path="lessons" element={<Lessons />} />
          <Route path="add-lessons" element={<AddLessons />} />
          <Route path="add-vocabularies" element={<AddVocabularies />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="lesson-management" element={<LessonManagement />} />
          <Route path="vocabulary-management" element={<VocabularyManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
