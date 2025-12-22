import type { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import MainPage from "./pages/MainPage/MainPage.tsx";
import GamePage from "./pages/GamePage/GamePage.tsx";
import { AuthProvider } from "./contexts/AuthContext/AuthProvider.tsx";

const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage onSearch={() => {}} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegisterPage />} />
            <Route path="/main" element={<MainPage onSearch={() => {}} />} />
            <Route path="/game/:id" element={<GamePage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
