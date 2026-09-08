import React, { useState } from 'react';
import { KOREA_REGIONS, Region } from '../data/koreaRegions';
import { Search, MapPin } from 'lucide-react';
import { Modal } from './common/Modal';

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

  const filteredRegions = KOREA_REGIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="지역 선택"
      icon={<MapPin size={16} color="var(--color-brand)" />}
      footer={
        <button type="button" className="btn-secondary" onClick={onClose}>
          닫기
        </button>
      }
    >
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
    </Modal>
  );
};
