import React, { useState, useEffect } from 'react';
import { LinksHub } from './components/LinksHub';
import { RainForecastCard } from './components/RainForecastCard';
import { TodoCard } from './components/TodoCard';
import { PRESET_LINKS, BookmarkLink } from './data/presetLinks';
import { PRESET_TODOS } from './data/presetTodos';
import { TodoItem } from './types/todo';
import { DEFAULT_REGION, Region } from './data/koreaRegions';
import { WeatherData, fetchRainWeather } from './services/weatherService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DashboardSettings, DEFAULT_SETTINGS } from './types/settings';
import { HeaderClock } from './components/HeaderClock';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { Settings } from 'lucide-react';
import { suggestTags } from './utils/tagHelper';
import './styles/app.css';

export const App: React.FC = () => {
  // 1. 링크 목록 상태 관리
  const [links, setLinks] = useLocalStorage<BookmarkLink[]>('saniti_links_v1', PRESET_LINKS);

  // 기존에 등록된 북마크 중 태그가 없는 항목에 대해 최초 1회만 스마트 태그 마이그레이션 적용
  useEffect(() => {
    const isMigrated = localStorage.getItem('saniti_tag_migrated_v1');
    if (isMigrated) return;

    if (links && links.length > 0) {
      let hasUpdated = false;
      const migrated = links.map((link) => {
        if (!link.tags || link.tags.length === 0) {
          const autoTags = suggestTags(link.url, link.title);
          if (autoTags.length > 0) {
            hasUpdated = true;
            return { ...link, tags: autoTags };
          }
        }
        return link;
      });

      if (hasUpdated) {
        setLinks(migrated);
      }
      localStorage.setItem('saniti_tag_migrated_v1', 'true');
    }
  }, [links, setLinks]);

  // 2. 대시보드 환경설정 상태 관리
  const [settings, setSettings] = useLocalStorage<DashboardSettings>('saniti_settings_v1', DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 3. 오늘의 할 일 상태 관리
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('saniti_todos_v1', PRESET_TODOS);

  // 4. 날씨 및 지역 상태 관리
  const [selectedRegion, setSelectedRegion] = useLocalStorage<Region>('saniti_region_v1', DEFAULT_REGION);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // 날씨 데이터 로드 함수
  const loadWeather = async (region: Region) => {
    setWeatherLoading(true);
    try {
      const data = await fetchRainWeather(region);
      setWeather(data);
    } catch (e) {
      console.error('날씨 데이터 로드 오류:', e);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedRegion);
    const timer = setInterval(() => loadWeather(selectedRegion), 15 * 60 * 1000);
    return () => clearInterval(timer);
  }, [selectedRegion]);

  const handleSelectRegion = (region: Region) => {
    setSelectedRegion(region);
  };

  // 링크 CRUD 처리 함수
  const handleAddLink = (newLink: BookmarkLink) => {
    setLinks([...links, newLink]);
  };

  const handleUpdateLink = (updatedLink: BookmarkLink) => {
    setLinks(links.map((l) => (l.id === updatedLink.id ? updatedLink : l)));
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleReorderLinks = (reorderedLinks: BookmarkLink[]) => {
    setLinks(reorderedLinks);
  };

  const handleResetLinks = () => {
    setLinks(PRESET_LINKS);
  };

  // 할 일 CRUD 처리 함수
  const handleAddTodo = (text: string) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text,
      completed: false,
      createdAt: Date.now()
    };
    setTodos([newTodo, ...todos]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleUpdateTodo = (id: string, newText: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  return (
    <div className="dashboard-container">
      {/* 대시보드 상단 헤더 */}
      <header className="dashboard-header">
        <div className="header-brand">
          <span className="brand-dot" />
          <h1 className="header-title">STARTPAGE</h1>
          <span className="header-subtitle">DESKTOP DASHBOARD</span>
        </div>

        <div className="header-actions">
          {/* 실시간 시계 위젯 */}
          <HeaderClock settings={settings} />

          {/* 설정 버튼 */}
          <button
            type="button"
            className="settings-toggle-btn"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="설정"
          >
            <Settings size={14} />
            <span>설정</span>
          </button>
        </div>
      </header>

      {/* 메인 벤토 대시보드 그리드 */}
      <main className="dashboard-grid">
        {/* 좌측 영역: 62% 메인 링크 허브 */}
        <LinksHub
          links={links}
          onAddLink={handleAddLink}
          onUpdateLink={handleUpdateLink}
          onDeleteLink={handleDeleteLink}
          onReorderLinks={handleReorderLinks}
          openInNewTab={settings.openInNewTab}
        />

        {/* 우측 영역: 38% 위젯 (강수확률 예보 및 오늘의 할 일) */}
        <div className="dashboard-sidebar">
          {/* 상단 위젯: 날씨 및 강수확률 예보 카드 */}
          <RainForecastCard
            weather={weather}
            loading={weatherLoading}
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            onRefresh={() => loadWeather(selectedRegion)}
          />

          {/* 하단 위젯: 오늘의 할 일 카드 */}
          <TodoCard
            todos={todos}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onClearCompleted={handleClearCompleted}
            onUpdateTodo={handleUpdateTodo}
          />
        </div>
      </main>

      {/* 대시보드 하단 푸터 */}
      <Footer />

      {/* 환경설정 및 데이터 관리 모달 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        links={links}
        onImportLinks={setLinks}
        onResetLinks={handleResetLinks}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
};

export default App;
