import React, { useState, useEffect } from 'react';
import { LinksHub } from './components/LinksHub';
import { RainForecastCard } from './components/RainForecastCard';
import { StockCard } from './components/StockCard';
import { PRESET_LINKS, BookmarkLink } from './data/presetLinks';
import { DEFAULT_REGION, Region } from './data/koreaRegions';
import { WeatherData, fetchRainWeather } from './services/weatherService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SettingsDropdown } from './components/SettingsDropdown';
import './styles/app.css';

export const App: React.FC = () => {
  // 1. 링크 목록 상태 관리
  const [links, setLinks] = useLocalStorage<BookmarkLink[]>('saniti_links_v1', PRESET_LINKS);

  // 2. 날씨 및 지역 상태 관리
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
          <SettingsDropdown links={links} onImportLinks={setLinks} />
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
        />

        {/* 우측 영역: 38% 위젯 (강수확률 예보 및 주요 시세) */}
        <div className="dashboard-sidebar">
          {/* 상단 위젯: 날씨 및 강수확률 예보 카드 */}
          <RainForecastCard
            weather={weather}
            loading={weatherLoading}
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            onRefresh={() => loadWeather(selectedRegion)}
          />

          {/* 하단 위젯: 7대 주요 자산 시세 카드 */}
          <StockCard />
        </div>
      </main>
    </div>
  );
};

export default App;
