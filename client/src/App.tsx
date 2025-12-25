import type { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/auth/login/Login";
import RegisterPage from "./pages/auth/register/Register";
import MainPage from "./pages/MainPage/MainPage.tsx"
import GamePage from "./pages/GamePage/GamePage.tsx";
import FandomPage from "./pages/FandomPage/FandomPage.tsx";
import AllFandomsPage from "./pages/AllFandomsPage/AllFandomsPage.tsx";
import AllGamesPage from "./pages/AllGamesPage/AllGamesPage.tsx"
import PostsPage from "./pages/PostsPage/PostsPage.tsx";

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
                    <Route path="/fandom/:id" element={<FandomPage />} />
                    <Route path="/allfandoms" element = {<AllFandomsPage /> } />
                    <Route path="/allgames" element = {<AllGamesPage /> } />
                    <Route path="/posts" element = {<PostsPage /> } />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App
