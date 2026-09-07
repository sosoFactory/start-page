import React, { useState, useRef, useEffect } from 'react';
import { Settings, Download, Upload } from 'lucide-react';
import { BookmarkLink } from '../data/presetLinks';

interface Props {
  links: BookmarkLink[];
  onImportLinks: (newLinks: BookmarkLink[]) => void;
}

export const SettingsDropdown: React.FC<Props> = ({ links, onImportLinks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

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
      setIsOpen(false);
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
          setIsOpen(false);
        }
      } catch (err) {
        console.error('북마크 가져오기 실패:', err);
        alert('JSON 파일을 파싱하는 중 오류가 발생했습니다. 올바른 JSON 파일인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="settings-dropdown-container" ref={containerRef}>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <button
        type="button"
        className={`settings-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="설정 및 데이터 관리"
        aria-label="설정"
      >
        <Settings size={15} />
      </button>

      {isOpen && (
        <div className="settings-menu">
          <div className="settings-menu-header">
            <span style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>데이터 관리</span>
          </div>

          <button
            type="button"
            className="settings-menu-item"
            onClick={handleExportJson}
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            <Download size={14} className="settings-menu-icon" />
            <div className="settings-menu-text">
              <span className="settings-menu-title">북마크 백업 (내보내기)</span>
              <span className="settings-menu-desc">현재 링크 목록을 JSON 파일로 다운로드</span>
            </div>
          </button>

          <button
            type="button"
            className="settings-menu-item"
            onClick={handleImportClick}
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            <Upload size={14} className="settings-menu-icon" />
            <div className="settings-menu-text">
              <span className="settings-menu-title">북마크 복원 (가져오기)</span>
              <span className="settings-menu-desc">JSON 파일에서 링크 목록 불러오기</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
