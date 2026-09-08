import React, { useRef } from 'react';
import { X, Sliders, Database, HelpCircle, Download, Upload, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import { BookmarkLink } from '../data/presetLinks';
import { DashboardSettings } from '../types/settings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  links: BookmarkLink[];
  onImportLinks: (newLinks: BookmarkLink[]) => void;
  onResetLinks: () => void;
  settings: DashboardSettings;
  onUpdateSettings: (newSettings: DashboardSettings) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  links,
  onImportLinks,
  onResetLinks,
  settings,
  onUpdateSettings
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // JSON 내보내기 핸들러
  const handleExportJson = () => {
    try {
      const exportLinks = links.map(({ id, title, url }) => ({ id, title, url }));
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportLinks, null, 2));
      const downloadAnchor = document.createElement('a');
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `startpage-bookmarks-${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('북마크 내보내기 실패:', err);
      alert('북마크 내보내기에 실패했습니다.');
    }
  };

  // JSON 가져오기 핸들러
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!Array.isArray(parsed)) {
          alert('올바른 JSON 북마크 배열 형식이 아닙니다.');
          return;
        }

        const validatedLinks: BookmarkLink[] = [];
        for (const item of parsed) {
          if (typeof item === 'object' && item !== null && typeof item.url === 'string' && item.url.trim() !== '') {
            validatedLinks.push({
              id: typeof item.id === 'string' && item.id.trim() !== '' ? item.id : `link-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              title: typeof item.title === 'string' && item.title.trim() !== '' ? item.title.trim() : '이름 없음',
              url: item.url.trim()
            });
          }
        }

        if (validatedLinks.length === 0) {
          alert('가져올 수 있는 유효한 북마크 링크가 없습니다.');
          return;
        }

        if (window.confirm(`총 ${validatedLinks.length}개의 북마크 링크를 가져오시겠습니까?\n(기존 목록이 대체됩니다)`)) {
          onImportLinks(validatedLinks);
          alert(`북마크 ${validatedLinks.length}개를 성공적으로 복원했습니다.`);
        }
      } catch (err) {
        console.error('북마크 가져오기 실패:', err);
        alert('JSON 파일을 파싱하는 중 오류가 발생했습니다. 올바른 JSON 파일인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
  };

  // 기본값 초기화 핸들러
  const handleReset = () => {
    if (window.confirm('자주 가는 링크를 기본 대표 5개(YouTube, GitHub 등) 목록으로 초기화하시겠습니까?\n(기존 추가한 링크는 삭제됩니다)')) {
      onResetLinks();
      alert('기본 링크로 초기화되었습니다.');
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="settings-modal-dialog">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <div className="modal-header-left">
            <Sliders size={16} color="var(--color-brand)" />
            <h3 className="modal-title">대시보드 설정</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="닫기">
            <X size={16} />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="settings-modal-body">
          {/* 1. 일반 설정 섹션 */}
          <div className="settings-card-section">
            <div className="settings-section-title">
              <Sliders size={14} className="settings-section-icon" />
              <span>일반 설정</span>
            </div>

            <div className="settings-item-row">
              <div className="settings-item-info">
                <span className="settings-item-label">링크 열기 방식</span>
                <span className="settings-item-desc">자주 가는 링크 클릭 시 페이지 이동 방식</span>
              </div>
              <div className="settings-segmented-control">
                <button
                  type="button"
                  className={`segmented-btn ${!settings.openInNewTab ? 'active' : ''}`}
                  onClick={() => onUpdateSettings({ ...settings, openInNewTab: false })}
                >
                  현재 탭
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${settings.openInNewTab ? 'active' : ''}`}
                  onClick={() => onUpdateSettings({ ...settings, openInNewTab: true })}
                >
                  새 탭
                </button>
              </div>
            </div>

            <div className="settings-item-row">
              <div className="settings-item-info">
                <span className="settings-item-label">상단 디지털 시계 표시</span>
                <span className="settings-item-desc">대시보드 헤더에 실시간 시계 위젯 표시</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showClock}
                  onChange={(e) => onUpdateSettings({ ...settings, showClock: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {settings.showClock && (
              <>
                <div className="settings-item-row sub-row">
                  <div className="settings-item-info">
                    <span className="settings-item-label">시간 표기 포맷</span>
                    <span className="settings-item-desc">24시간제 또는 12시간제(오전/오후)</span>
                  </div>
                  <div className="settings-segmented-control">
                    <button
                      type="button"
                      className={`segmented-btn ${settings.clockFormat === '24h' ? 'active' : ''}`}
                      onClick={() => onUpdateSettings({ ...settings, clockFormat: '24h' })}
                    >
                      24시간제
                    </button>
                    <button
                      type="button"
                      className={`segmented-btn ${settings.clockFormat === '12h' ? 'active' : ''}`}
                      onClick={() => onUpdateSettings({ ...settings, clockFormat: '12h' })}
                    >
                      12시간제
                    </button>
                  </div>
                </div>

                <div className="settings-item-row sub-row">
                  <div className="settings-item-info">
                    <span className="settings-item-label">초(Seconds) 단위 표시</span>
                    <span className="settings-item-desc">시:분 뒤에 실시간 초 표시</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.showClockSeconds}
                      onChange={(e) => onUpdateSettings({ ...settings, showClockSeconds: e.target.checked })}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </>
            )}
          </div>

          {/* 2. 데이터 관리 섹션 */}
          <div className="settings-card-section">
            <div className="settings-section-title">
              <Database size={14} className="settings-section-icon" />
              <span>데이터 관리 & 백업</span>
            </div>

            <div className="settings-item-row">
              <div className="settings-item-info">
                <span className="settings-item-label">북마크 백업 및 복원</span>
                <span className="settings-item-desc">현재 저장된 {links.length}개의 북마크 링크를 JSON으로 내보내거나 가져옵니다</span>
              </div>
              <div className="settings-action-btns">
                <button type="button" className="btn-secondary" onClick={handleExportJson}>
                  <Download size={13} />
                  <span>내보내기</span>
                </button>
                <button type="button" className="btn-secondary" onClick={handleImportClick}>
                  <Upload size={13} />
                  <span>가져오기</span>
                </button>
              </div>
            </div>

            <div className="settings-item-row">
              <div className="settings-item-info">
                <span className="settings-item-label">기본 북마크로 초기화</span>
                <span className="settings-item-desc">초기 기본 5개 대표 링크(YouTube, GitHub 등) 상태로 되돌립니다</span>
              </div>
              <div className="settings-action-btns">
                <button type="button" className="btn-danger-outline" onClick={handleReset}>
                  <RotateCcw size={13} />
                  <span>초기화</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. 도움말 & 사용 가이드 섹션 */}
          <div className="settings-card-section">
            <div className="settings-section-title">
              <HelpCircle size={14} className="settings-section-icon" />
              <span>도움말 및 가이드</span>
            </div>

            <div className="settings-guide-card">
              <div className="guide-card-header">
                <Star size={13} color="var(--color-brand)" />
                <strong>툴바 별(⭐) 아이콘 1초 바로가기 추가</strong>
              </div>
              <p className="guide-card-text">
                웹서핑 중 브라우저 툴바의 산호색 별(⭐) 아이콘을 클릭하면 현재 페이지의 제목과 URL이 즉시 시작페이지에 추가됩니다.
              </p>
            </div>

            <div className="settings-guide-card">
              <div className="guide-card-header">
                <ShieldCheck size={13} color="#16a34a" />
                <strong>100% 로컬 데이터 보안</strong>
              </div>
              <p className="guide-card-text">
                모든 북마크와 사용자 설정은 외부 서버로 전송되지 않으며, 사용자 컴퓨터의 브라우저 로컬 저장소에만 안전하게 보관됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};
