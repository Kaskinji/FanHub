import type { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import MainPage from "./pages/MainPage/MainPage.tsx";
import GamePage from "./pages/GamePage/GamePage.tsx";
import FandomPage from "./pages/FandomPage/FandomPage.tsx";
import AllFandomsPage from "./pages/AllFandomsPage/AllFandomsPage.tsx";
import AllGamesPage from "./pages/AllGamesPage/AllGamesPage.tsx"
import PostsPage from "./pages/PostsPage/PostsPage.tsx";
import { AuthProvider } from "./contexts/AuthContext/AuthProvider.tsx";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage.tsx";

const App: FC = () => {
    return (
      <AuthProvider>

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
                    <Route path="/profile" element={<ProfilePage/>}/>
                </Routes>
            </Layout>
        </Router>
      </AuthProvider>
    );
  }
export default App;
