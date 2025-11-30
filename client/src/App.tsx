import type { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout";
import LoginPage from "../src/app/auth/login/Login";
import RegisterPage from "../src/app/auth/register/Register";
import MainPage from "../src/app/main/MainPage"

const App: FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/Registration" element={<RegisterPage />} />
                    <Route path="/main" element={<MainPage />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App
