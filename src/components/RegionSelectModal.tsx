import React, { useState, useEffect } from 'react';
import { KOREA_REGIONS, Region } from '../data/koreaRegions';
import { X, Search, MapPin } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: Region;
  onSelect: (region: Region) => void;
}

export const RegionSelectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedRegion,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // ESC 키 닫기 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredRegions = KOREA_REGIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        // 모달 외부 배경을 직접 클릭했을 때만 닫기 (인풋창 텍스트 드래그 시 닫힘 방어)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="var(--color-brand)" />
            <h3 className="modal-title">지역 선택</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">시/군/구 검색 (예: 일산, 분당, 강남)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '34px' }}
                placeholder="지역명을 입력하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <Search
                size={16}
                color="var(--color-mute)"
                style={{ position: 'absolute', left: '10px', top: '12px' }}
              />
            </div>
          </div>

          <div className="region-search-list">
            {filteredRegions.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-mute)', fontSize: '13px' }}>
                검색된 지역이 없습니다.
              </div>
            ) : (
              filteredRegions.map((region) => (
                <div
                  key={region.id}
                  className={`region-item ${selectedRegion.id === region.id ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(region);
                    onClose();
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{region.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-mute)' }}>
                    {region.fullName}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
