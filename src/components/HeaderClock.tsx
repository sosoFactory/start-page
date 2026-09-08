import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { DashboardSettings } from '../types/settings';

interface Props {
  settings: DashboardSettings;
}

export const HeaderClock: React.FC<Props> = ({ settings }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!settings.showClock) {
    return null;
  }

  // 날짜 포맷 (예: 9월 8일 (화))
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayStr = dayNames[now.getDay()];
  const dateDisplay = `${month}월 ${date}일 (${dayStr})`;

  // 시간 포맷
  const hours24 = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  let timeDisplay = '';
  if (settings.clockFormat === '12h') {
    const period = hours24 >= 12 ? '오후' : '오전';
    const hours12 = hours24 % 12 || 12;
    timeDisplay = settings.showClockSeconds
      ? `${period} ${hours12}:${minutes}:${seconds}`
      : `${period} ${hours12}:${minutes}`;
  } else {
    const hoursStr = String(hours24).padStart(2, '0');
    timeDisplay = settings.showClockSeconds
      ? `${hoursStr}:${minutes}:${seconds}`
      : `${hoursStr}:${minutes}`;
  }

  return (
    <div className="header-clock">
      <Clock size={13} className="header-clock-icon" />
      <span className="header-clock-date">{dateDisplay}</span>
      <span className="header-clock-time">{timeDisplay}</span>
    </div>
  );
};
