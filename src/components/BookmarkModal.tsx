import React, { useState, useEffect, useMemo } from 'react';
import { BookmarkLink } from '../data/presetLinks';
import { normalizeUrl } from '../utils/urlHelper';
import { cleanTags, normalizeTag, suggestTags } from '../utils/tagHelper';
import { Globe, Tag, X, Plus, Sparkles } from 'lucide-react';
import { Modal } from './common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: BookmarkLink) => void;
  editingLink?: BookmarkLink | null;
  existingTags?: string[];
}

export const BookmarkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editingLink,
  existingTags = []
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [hasManuallyEditedTags, setHasManuallyEditedTags] = useState(false);

  useEffect(() => {
    if (editingLink) {
      setUrl(editingLink.url);
      setTitle(editingLink.title);
      setTags(cleanTags(editingLink.tags));
      setHasManuallyEditedTags(true);
    } else {
      setUrl('');
      setTitle('');
      setTags([]);
      setHasManuallyEditedTags(false);
    }
    setTagInput('');
  }, [editingLink, isOpen]);

  // URL 또는 제목 입력 시 자동 추천 태그 계산
  const suggestedTags = useMemo(() => {
    if (!url.trim()) return [];
    return suggestTags(url, title, existingTags);
  }, [url, title, existingTags]);

  // 새 링크 추가 시, 사용자가 수동으로 태그를 수정하지 않았으면 추천 태그를 자동 기본값으로 설정
  useEffect(() => {
    if (!editingLink && !hasManuallyEditedTags && suggestedTags.length > 0) {
      setTags(suggestedTags);
    }
  }, [suggestedTags, editingLink, hasManuallyEditedTags]);

  const handleAddTag = (rawTag: string) => {
    const cleaned = normalizeTag(rawTag);
    if (!cleaned) return;
    if (!tags.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      setTags([...tags, cleaned]);
    }
    setHasManuallyEditedTags(true);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase()));
    setHasManuallyEditedTags(true);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) return;

    // 만약 인풋에 작성 중이던 태그가 있다면 함께 포함
    let finalTags = [...tags];
    if (tagInput.trim()) {
      const pending = normalizeTag(tagInput);
      if (pending && !finalTags.some((t) => t.toLowerCase() === pending.toLowerCase())) {
        finalTags.push(pending);
      }
    }
    finalTags = cleanTags(finalTags);

    // 제목이 비어있을 경우 도메인명으로 자동 대체
    const finalTitle = title.trim() || cleanUrl.replace(/^https?:\/\//, '').split('/')[0];

    onSave({
      id: editingLink ? editingLink.id : Date.now().toString(),
      title: finalTitle,
      url: cleanUrl,
      tags: finalTags
    });

    onClose();
  };

  // 아직 추가되지 않은 추천 태그 필터링 (대소문자 무시)
  const availableSuggestions = suggestedTags.filter(
    (st) => !tags.some((t) => t.toLowerCase() === st.toLowerCase())
  );

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

        {/* 태그 설정 */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Tag size={13} color="var(--color-brand)" />
            <span>태그 (분류)</span>
          </label>

          {/* 태그 입력 및 칩 영역 */}
          <div className="modal-tags-box">
            <div className="modal-tags-list">
              {tags.map((tag) => (
                <span key={tag} className="modal-tag-chip">
                  #{tag}
                  <button
                    type="button"
                    className="modal-tag-remove-btn"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`${tag} 태그 삭제`}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              <input
                type="text"
                className="modal-tag-input"
                placeholder={tags.length === 0 ? '태그 입력... (Enter 또는 쉼표)' : '태그 추가...'}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => {
                  if (tagInput.trim()) {
                    handleAddTag(tagInput);
                  }
                }}
              />
            </div>
          </div>

          {/* 추천 태그 안내 영역 */}
          {availableSuggestions.length > 0 && (
            <div className="modal-suggested-tags">
              <span className="modal-suggested-title">
                <Sparkles size={11} />
                추천 태그:
              </span>
              <div className="modal-suggested-list">
                {availableSuggestions.map((sTag) => (
                  <button
                    key={sTag}
                    type="button"
                    className="modal-suggest-chip"
                    onClick={() => handleAddTag(sTag)}
                  >
                    <Plus size={10} />
                    #{sTag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};
