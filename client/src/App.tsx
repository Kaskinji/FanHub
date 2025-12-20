import type { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/auth/login/Login";
import RegisterPage from "./pages/auth/register/Register";
import MainPage from "./pages/MainPage/MainPage.tsx"
import GamePage from "./pages/GamePage/GamePage.tsx";

const App: FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registration" element={<RegisterPage />} />
                    <Route path="/main" element={<MainPage onSearch={()=>{}} />} />
                    <Route path="/game/:id" element={<GamePage />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App
