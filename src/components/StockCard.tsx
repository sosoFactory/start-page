import React, { useState, useEffect, useCallback } from 'react';
import { STOCK_DATA, StockItem } from '../data/stockData';
import { fetchAllStocks } from '../services/stockService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

type PeriodType = '1D' | '1W' | '1M' | '1Y';

const STOCK_ORDER = ['KOSPI', 'KOSDAQ', 'SPX', 'IXIC', 'TLT', 'GOLD', 'BTC'];

export const StockCard: React.FC = () => {
  const [stocks, setStocks] = useState<Record<string, StockItem>>(STOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useLocalStorage<string>('browser_home_stock_key', 'KOSPI');
  const [period, setPeriod] = useLocalStorage<PeriodType>('browser_home_stock_period', '1D');

  const stockKeys = STOCK_ORDER;
  const currentStock: StockItem = stocks[selectedKey] || stocks['KOSPI'] || STOCK_DATA['KOSPI'];
  const chartPoints = currentStock.history[period] || [];

  const chartColor = currentStock.isPositive ? '#ef4444' : '#2563eb';

  const loadStockData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllStocks();
      setStocks(data);
    } catch (err) {
      console.warn('시세 데이터 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStockData();
    // 5분 주기 실시간 시세 자동 갱신
    const timer = setInterval(loadStockData, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [loadStockData]);

  return (
    <div className="saniti-card">
      <div className="card-header">
        <div className="card-header-left">
          <Activity size={16} color="var(--color-brand)" />
          <h2 className="card-title">주요 시세</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="stock-period-tabs">
            {(['1D', '1W', '1M', '1Y'] as PeriodType[]).map((p) => (
              <button
                key={p}
                className={`period-btn ${period === p ? 'active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="link-action-btn"
            onClick={loadStockData}
            data-tooltip="새로고침"
            data-tooltip-pos="bottom-left"
            aria-label="새로고침"
            style={{ padding: '4px', marginLeft: '4px' }}
          >
            <RefreshCw size={12} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* 종목 탭: KOSPI, KOSDAQ, S&P 500, NASDAQ, TLT, GOLD, BTC */}
        <div className="stock-tabs-scroll" style={{ marginBottom: 'var(--spacing-md)' }}>
          {stockKeys.map((key) => {
            const stock = stocks[key] || STOCK_DATA[key];
            if (!stock) return null;
            return (
              <button
                key={key}
                className={`stock-tab ${selectedKey === key ? 'active' : ''}`}
                onClick={() => setSelectedKey(key)}
              >
                {stock.symbol}
              </button>
            );
          })}
        </div>

        {/* 현재가 및 등락률 헤더 */}
        <div className="stock-price-header">
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-slate)', marginBottom: '2px', fontWeight: 600 }}>
              {currentStock.name}
            </div>
            <div className="stock-main-price">
              {currentStock.price}
              <span style={{ fontSize: '13px', color: 'var(--color-slate-soft)', marginLeft: '4px', fontWeight: 500 }}>
                {currentStock.unit}
              </span>
            </div>
          </div>

          <div className={`stock-change-badge ${currentStock.isPositive ? 'up' : 'down'}`}>
            {currentStock.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{currentStock.change} ({currentStock.changePercent})</span>
          </div>
        </div>

        {/* 반응형 주가 영역 차트 (온전한 시간축 라벨) */}
        <div style={{ flex: 1, width: '100%', minHeight: '120px', marginTop: '6px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartPoints} margin={{ top: 6, right: 12, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id={`stockGradient-${selectedKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#cbd5e1"
                tick={{ fill: '#64748b', fontSize: 9.5, fontFamily: 'var(--font-sans)', fontWeight: 500 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                interval={period === '1M' ? 3 : 0}
              />
              <YAxis
                domain={['dataMin - 5', 'dataMax + 5']}
                hide={true}
              />
              <Tooltip
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
                          fontFamily: 'var(--font-sans)'
                        }}
                      >
                        <div style={{ color: '#64748b', fontWeight: 500 }}>{data.time}</div>
                        <div style={{ color: chartColor, fontWeight: 700 }}>
                          {data.value.toLocaleString()} {currentStock.unit}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#stockGradient-${selectedKey})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
