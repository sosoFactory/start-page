import React, { useState } from 'react';
import { WeatherData, getWeatherInfo } from '../services/weatherService';
import { Region } from '../data/koreaRegions';
import { RegionSelectModal } from './RegionSelectModal';
import { CloudSun, MapPin, ChevronDown, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  onRefresh: () => void;
}

export const RainForecastCard: React.FC<Props> = ({
  weather,
  loading,
  selectedRegion,
  onSelectRegion,
  onRefresh
}) => {
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  if (!weather && loading) {
    return (
      <div className="saniti-card" style={{ minHeight: '330px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-mute)', fontSize: '13px' }}>
          날씨 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  const todayInfo = weather ? getWeatherInfo(weather.today.weatherCode) : { label: '', icon: '' };
  const tomorrowInfo = weather ? getWeatherInfo(weather.tomorrow.weatherCode) : { label: '', icon: '' };

  // 2시간 간격 데이터 (24포인트)
  const rawData = weather?.hourly.filter((_, i) => i % 2 === 0) || [];
  const currentHourNum = new Date().getHours();

  // 오늘의 현재 시간 인덱스 계산
  let todayCurrentIndex = -1;
  let todayCount = 0;

  rawData.forEach((h, idx) => {
    if (h.isToday) {
      todayCount++;
      const hourVal = parseInt(h.hour.replace('시', ''), 10);
      if (Math.abs(hourVal - currentHourNum) <= 1 && todayCurrentIndex === -1) {
        todayCurrentIndex = idx;
      }
    }
  });

  const chartData = rawData.map((h, idx) => {
    return {
      hour: h.hour,
      rainProb: h.rainProb,
      temp: h.temp,
      isToday: h.isToday,
      isNow: idx === todayCurrentIndex
    };
  });

  // 오늘(22시)과 내일(00시) 사이의 구분선 위치 계산
  const dividerPercent = rawData.length > 0 ? (todayCount / rawData.length) * 100 : 50;

  return (
    <div className="saniti-card">
      <div className="card-header">
        <div className="card-header-left">
          <CloudSun size={16} color="var(--color-rain-blue)" />
          <h2 className="card-title">날씨</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            className="weather-location-btn"
            onClick={() => setIsRegionModalOpen(true)}
          >
            <MapPin size={12} color="var(--color-brand)" />
            <span>{selectedRegion.name}</span>
            <ChevronDown size={12} />
          </button>

          <button
            className="link-action-btn"
            onClick={onRefresh}
            data-tooltip="새로고침"
            data-tooltip-pos="bottom-left"
            aria-label="새로고침"
            style={{ padding: '4px' }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {/* 오늘 및 내일 강수확률 요약 (오늘 카드 위계 강조) */}
        <div className="rain-highlight-grid">
          {/* 오늘 카드 (주요 강조) */}
          <div
            className="rain-day-card"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#cbd5e1',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="rain-day-header">
              <span style={{ fontSize: '11.5px', color: 'var(--color-slate-soft)', fontWeight: 600 }}>
                강수확률
              </span>
              <span
                className="rain-day-tag"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'var(--color-ink)',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.02em'
                }}
              >
                오늘
              </span>
            </div>

            <div className="rain-prob-display">
              <span className={`rain-prob-number ${(weather?.today.maxRainProb || 0) >= 40 ? 'high-prob' : ''}`}>
                {weather?.today.maxRainProb ?? 0}
              </span>
              <span className="rain-prob-unit">%</span>
            </div>

            <div className="rain-day-footer">
              <span style={{ fontWeight: 600 }}>{todayInfo.icon} {todayInfo.label}</span>
              <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--color-slate)' }}>
                최저 {weather?.today.tempMin}° · 최고 {weather?.today.tempMax}°
              </span>
            </div>
          </div>

          {/* 내일 카드 (보조 표시) */}
          <div className="rain-day-card">
            <div className="rain-day-header">
              <span style={{ fontSize: '11.5px', color: 'var(--color-slate-soft)', fontWeight: 600 }}>
                강수확률
              </span>
              <span
                className="rain-day-tag"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  backgroundColor: 'var(--color-canvas-elevated)',
                  color: 'var(--color-slate)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                내일
              </span>
            </div>

            <div className="rain-prob-display">
              <span className={`rain-prob-number ${(weather?.tomorrow.maxRainProb || 0) >= 40 ? 'high-prob' : ''}`}>
                {weather?.tomorrow.maxRainProb ?? 0}
              </span>
              <span className="rain-prob-unit">%</span>
            </div>

            <div className="rain-day-footer">
              <span style={{ fontWeight: 600 }}>{tomorrowInfo.icon} {tomorrowInfo.label}</span>
              <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--color-slate)' }}>
                최저 {weather?.tomorrow.tempMin}° · 최고 {weather?.tomorrow.tempMax}°
              </span>
            </div>
          </div>
        </div>

        {/* 48시간 강수확률 시간대별 바 차트 */}
        <div className="rain-chart-container" style={{ flex: 1, minHeight: '130px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div className="rain-chart-header" style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-slate-soft)' }}>
              시간대별 강수확률 (오늘~내일 48H)
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-slate)', fontWeight: 600 }}>
              현재 {weather?.currentTemp}°C
            </span>
          </div>

          <div style={{ flex: 1, width: '100%', minHeight: '100px', position: 'relative' }}>
            {/* 오늘(22시)과 내일(00시) 경계 세로 구분선 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 24,
                left: `calc(${dividerPercent}% - 6px)`,
                borderLeft: '1.5px dashed #94a3b8',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 6, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="hour"
                  stroke="#cbd5e1"
                  tick={({ x, y, payload, index }) => {
                    const isNow = chartData[index]?.isNow;
                    return (
                      <text
                        x={x}
                        y={y + 12}
                        textAnchor="middle"
                        fill={isNow ? '#f36458' : '#64748b'}
                        fontSize={9.5}
                        fontWeight={isNow ? 700 : 500}
                        fontFamily="'Pretendard', sans-serif"
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontFamily: "'Pretendard', sans-serif"
                          }}
                        >
                          <div style={{ color: '#64748b', marginBottom: '2px', fontWeight: 600 }}>
                            {data.isNow ? '● 지금 실시간' : data.isToday ? '오늘' : '내일'} {data.hour}
                          </div>
                          <div style={{ color: '#0284c7', fontWeight: 700 }}>
                            강수확률: {data.rainProb}%
                          </div>
                          <div style={{ color: '#1e293b', fontWeight: 500 }}>
                            기온: {data.temp}°C
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={50} stroke="#f36458" strokeDasharray="3 3" opacity={0.5} />
                <Bar dataKey="rainProb" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => {
                    let barFill = entry.rainProb >= 50 ? '#0284c7' : entry.rainProb >= 20 ? '#38bdf8' : '#e2e8f0';
                    if (entry.isNow) {
                      barFill = '#f36458';
                    }
                    return <Cell key={`cell-${index}`} fill={barFill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <RegionSelectModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedRegion={selectedRegion}
        onSelect={onSelectRegion}
      />
    </div>
  );
};
