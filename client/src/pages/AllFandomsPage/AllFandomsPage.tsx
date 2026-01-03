// AllFandomsPage.tsx
import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header/Header";
import styles from "../AllFandomsPage/AllFandomsPage.module.scss";
import { useParams } from "react-router-dom";
import { fandomApi } from "../../api/FandomApi";
import { gameApi } from "../../api/GameApi";
import type { FandomReadDto } from "../../api/FandomApi";
import { Top } from "./Top/Top.tsx";
import { FandomsContent } from "./FandomsContent/FandomsContent.tsx";
import { FandomForm } from "./FandomForm/FandomForm";

export default function AllFandomsPage() {
  const { gameId: gameIdParam } = useParams<{ gameId?: string }>();
  const gameId = gameIdParam ? parseInt(gameIdParam, 10) : undefined;

  const [fandoms, setFandoms] = useState<FandomReadDto[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  const loadFandoms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: FandomReadDto[];

      if (gameId) {
        data = await fandomApi.searchFandomsByNameAndGame(
          gameId,
          searchQuery
        );
      } else if (searchQuery) {
        data = await fandomApi.searchFandomsByName(searchQuery);
      } else {
        data = await fandomApi.getFandoms();
      }

      setFandoms(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load fandoms";
      setError(errorMessage);
      console.error("Error loading fandoms:", err);
    } finally {
      setLoading(false);
    }
  }, [gameId, searchQuery]);

  useEffect(() => {
    // Если в URL указан gameId, подгружаем название игры для шапки
    const loadGameTitle = async () => {
      if (!gameId) {
        setSelectedGame(null);
        return;
      }

      try {
        const game = await gameApi.getGameById(gameId);
        setSelectedGame(game.title);
      } catch (err) {
        console.error("Failed to load game title:", err);
        setSelectedGame(null);
      }
    };

    loadGameTitle();

    const debounceTimer = setTimeout(() => {
      loadFandoms();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [loadFandoms, refreshTrigger, gameId]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAddFandomClick = () => {
    setShowAddForm(true);
  };

  const handleFandomCreated = () => {
    setShowAddForm(false);
    setRefreshTrigger(prev => prev + 1); // Обновляем список
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
  };

  return (
    <div className={styles.page}>
      {/* Форма добавления фандома (рендерится на этой странице) */}
        {showAddForm && (
          <div className={styles.formContainer}>
            <FandomForm
              gameId={gameId}
              onCancel={handleCancelForm}
              onSuccess={handleFandomCreated}
            />
          </div>
        )}
      <Header onSearch={() => {}} onSignIn={() => {}} />
      <main className={styles.content}>
        <Top
          onSearch={handleSearch}
          gameTitle={selectedGame || ""}
          gameId={gameId}
          searchQuery={searchQuery}
        />
        
        <FandomsContent
          fandoms={fandoms}
          loading={loading}
          error={error}
          gameTitle={selectedGame}
          onAddFandomClick={handleAddFandomClick}
        />
      </main>
    </div>
  );
}