import React, { useState, useEffect } from 'react';
import { BookmarkLink } from '../data/presetLinks';
import { normalizeUrl } from '../utils/urlHelper';
import { X, Globe } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: BookmarkLink) => void;
  editingLink?: BookmarkLink | null;
}

export const BookmarkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editingLink
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (editingLink) {
      setUrl(editingLink.url);
      setTitle(editingLink.title);
    } else {
      setUrl('');
      setTitle('');
    }
  }, [editingLink, isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) return;

    // 제목이 비어있을 경우 도메인명으로 자동 대체
    const finalTitle = title.trim() || cleanUrl.replace(/^https?:\/\//, '').split('/')[0];

    onSave({
      id: editingLink ? editingLink.id : Date.now().toString(),
      title: finalTitle,
      url: cleanUrl
    });

    onClose();
  };

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
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="var(--color-brand)" />
              <h3 className="modal-title">
                {editingLink ? '바로가기 수정' : '새 바로가기 추가'}
              </h3>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 웹사이트 주소 (URL) */}
            <div className="form-group">
              <label className="form-label">
                웹사이트 주소 (URL)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="예: naver.com, https://github.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* 사이트 이름 */}
            <div className="form-group">
              <label className="form-label">
                사이트 이름
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 네이버, 깃허브 (비워두면 주소로 대체)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn-brand">
              {editingLink ? '저장' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
