export interface DashboardSettings {
  openInNewTab: boolean;        // 링크를 새 탭에서 열지 여부 (기본: false)
  showClock: boolean;           // 헤더 시계 표시 여부 (기본: true)
  clockFormat: '24h' | '12h';   // 시간 표기 방식 (기본: '24h')
  showClockSeconds: boolean;    // 초 단위 표시 여부 (기본: true)
}

export const DEFAULT_SETTINGS: DashboardSettings = {
  openInNewTab: false,
  showClock: true,
  clockFormat: '24h',
  showClockSeconds: true
};
