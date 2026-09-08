import React, { useState, useEffect } from 'react';
import { BookmarkLink } from '../data/presetLinks';
import { normalizeUrl } from '../utils/urlHelper';
import { Globe } from 'lucide-react';
import { Modal } from './common/Modal';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingLink ? '바로가기 수정' : '새 바로가기 추가'}
      icon={<Globe size={16} color="var(--color-brand)" />}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose}>
            취소
          </button>
          <button type="submit" form="bookmark-form" className="btn-brand">
            {editingLink ? '저장' : '추가하기'}
          </button>
        </>
      }
    >
      <form id="bookmark-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
      </form>
    </Modal>
  );
};
