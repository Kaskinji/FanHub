import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../../components/Header/Header";
import styles from "../AllFandomsPage/AllFandomsPage.module.scss";
import { useParams } from "react-router-dom";
import { fandomApi } from "../../api/FandomApi";
import { gameApi } from "../../api/GameApi";
import type { FandomReadDto, FandomStatsDto } from "../../api/FandomApi";
import { Top } from "./Top/Top.tsx";
import { FandomsContent } from "./FandomsContent/FandomsContent.tsx";
import { FandomForm } from "./FandomForm/FandomForm";

type FandomWithStats = FandomReadDto | FandomStatsDto;

// Type guard для проверки наличия статистики
const hasStats = (fandom: FandomWithStats): fandom is FandomStatsDto => {
  return 'subscribersCount' in fandom && 'postsCount' in fandom;
};

export default function AllFandomsPage() {
  const { gameId: gameIdParam } = useParams<{ gameId?: string }>();
  const gameId = gameIdParam ? parseInt(gameIdParam, 10) : undefined;

  const [allFandoms, setAllFandoms] = useState<FandomWithStats[]>([]); // Все загруженные фандомы
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'subscribers' | 'posts' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'desc' по умолчанию для подписчиков/постов
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Функция сортировки по названию (та же логика, что в SearchDropdown)
  const sortFandomsByName = (fandoms: FandomWithStats[], query: string): FandomWithStats[] => {
    if (!query.trim()) return fandoms;
    
    const lowerQuery = query.toLowerCase();
    
    return [...fandoms].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      // Точное совпадение - высший приоритет
      if (nameA === lowerQuery && nameB !== lowerQuery) return -1;
      if (nameA !== lowerQuery && nameB === lowerQuery) return 1;
      if (nameA === lowerQuery && nameB === lowerQuery) return 0;
      
      // Начинается с запроса - высокий приоритет
      const startsWithA = nameA.startsWith(lowerQuery);
      const startsWithB = nameB.startsWith(lowerQuery);
      
      if (startsWithA && !startsWithB) return -1;
      if (!startsWithA && startsWithB) return 1;
      
      // Если оба начинаются с запроса - сортируем по длине (короче первым)
      if (startsWithA && startsWithB) {
        return nameA.length - nameB.length;
      }
      
      // По позиции первого вхождения (раньше = выше)
      const positionA = nameA.indexOf(lowerQuery);
      const positionB = nameB.indexOf(lowerQuery);
      
      if (positionA !== positionB) {
        return positionA - positionB;
      }
      
      // Если позиция одинаковая - сортируем по длине (короче первым)
      return nameA.length - nameB.length;
    });
  };

  // Функция сортировки по подписчикам или постам
  const sortFandomsByStats = (fandoms: FandomWithStats[], sortType: 'subscribers' | 'posts', order: 'asc' | 'desc'): FandomWithStats[] => {
    return [...fandoms].sort((a, b) => {
      // Если у фандома нет статистики, он идет в конец
      if (!hasStats(a)) return 1;
      if (!hasStats(b)) return -1;
      
      const multiplier = order === 'asc' ? 1 : -1;
      
      if (sortType === 'subscribers') {
        return (b.subscribersCount - a.subscribersCount) * multiplier;
      } else {
        return (b.postsCount - a.postsCount) * multiplier;
      }
    });
  };

  // Применяем фильтры и сортировку локально
  const filteredFandoms = useMemo(() => {
    let filtered = [...allFandoms];
    
    // Фильтр по gameId, если указан
    if (gameId) {
      filtered = filtered.filter(fandom => fandom.gameId === gameId);
    }
    
    // Фильтр по названию
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(fandom => 
        fandom.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Применяем сортировку
    if (sortBy === 'subscribers' || sortBy === 'posts') {
      // Сортировка по статистике
      filtered = sortFandomsByStats(filtered, sortBy, sortOrder);
    } else if (sortBy === 'name') {
      // Сортировка по имени
      filtered = [...filtered].sort((a, b) => {
        const result = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? result : -result;
      });
    } else if (searchQuery.trim()) {
      // Сортировка по названию (релевантность поиска) только если нет явной сортировки
      filtered = sortFandomsByName(filtered, searchQuery);
    }
    
    return filtered;
  }, [allFandoms, gameId, searchQuery, sortBy, sortOrder]);

  const loadFandoms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: FandomWithStats[];

      // Загружаем все фандомы (или для конкретной игры, если указан gameId)
      if (gameId) {
        // Загружаем все фандомы для этой игры (без поиска) - возвращает FandomStatsDto[]
        data = await fandomApi.searchFandomsByNameAndGame(gameId, "");
      } else {
        // Загружаем все фандомы - возвращает FandomReadDto[]
        data = await fandomApi.getFandoms();
      }

      setAllFandoms(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load fandoms";
      setError(errorMessage);
      console.error("Error loading fandoms:", err);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

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
    loadFandoms();
  }, [loadFandoms, refreshTrigger, gameId]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Фильтрация происходит автоматически через useMemo
  }, []);

  const handleSortChange = useCallback((sortType: 'name' | 'subscribers' | 'posts') => {
    // Если кликаем на уже выбранный тип сортировки - меняем направление
    if (sortBy === sortType) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Если выбираем новый тип - сбрасываем направление на дефолтное
      setSortBy(sortType);
      // Для подписчиков и постов - по убыванию, для имени - по возрастанию
      setSortOrder(sortType === 'name' ? 'asc' : 'desc');
    }
  }, [sortBy]);

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
      <Header onSearch={() => {}} />
      <main className={styles.content}>
        <Top
          onSearch={handleSearch}
          gameTitle={selectedGame || ""}
          gameId={gameId}
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          hasStats={gameId !== undefined} // Если есть gameId, значит данные имеют статистику
        />
        
        <FandomsContent
          fandoms={filteredFandoms}
          loading={loading}
          error={error}
          gameTitle={selectedGame}
          onAddFandomClick={handleAddFandomClick}
        />
      </main>
    </div>
  );
}