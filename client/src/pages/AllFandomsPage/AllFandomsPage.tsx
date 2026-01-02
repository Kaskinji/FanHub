// AllFandomsPage.tsx
import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header/Header";
import styles from "../AllFandomsPage/AllFandomsPage.module.scss";
import { useLocation } from "react-router-dom";
import type { GameContextData } from "../../types/Game";
import { fandomApi } from "../../api/FandomApi";
import type { FandomReadDto } from "../../api/FandomApi";
import { Top } from "./Top/Top.tsx";
import { FandomsContent } from "./FandomsContent/FandomsContent.tsx";
import { AddFandomForm } from "./AddFandomForm/AddFandomForm.tsx";

export default function AllFandomsPage() {
  const location = useLocation();
  const gameData = location.state as GameContextData;

  const [fandoms, setFandoms] = useState<FandomReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const selectedGame = gameData?.gameTitle;
  const gameId = gameData?.gameId;

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
    const debounceTimer = setTimeout(() => {
      loadFandoms();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [loadFandoms, refreshTrigger]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAddFandomClick = () => {
    setShowAddForm(true);
  };

  const handleFandomCreated = (fandomId: number) => {
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
            <AddFandomForm
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
          gameTitle={selectedGame}
          gameId={gameId}
          searchQuery={searchQuery}
        />
        
        
        
        <FandomsContent
          fandoms={fandoms}
          loading={loading}
          error={error}
          gameId={gameId}
          onAddFandomClick={handleAddFandomClick}
        />
      </main>
    </div>
  );
}