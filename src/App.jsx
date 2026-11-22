import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TeamsPage from "./pages/TeamsPage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/equipos" element={<TeamsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
