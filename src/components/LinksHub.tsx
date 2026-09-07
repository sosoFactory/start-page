import React, { useState } from 'react';
import { BookmarkLink } from '../data/presetLinks';
import { Plus, Edit2, Trash2, Globe, Search, X } from 'lucide-react';
import { BookmarkModal } from './BookmarkModal';

interface Props {
  links: BookmarkLink[];
  onAddLink: (link: BookmarkLink) => void;
  onUpdateLink: (link: BookmarkLink) => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks: (newLinks: BookmarkLink[]) => void;
}

// 파비콘 로딩 실패 시 대체 배지를 지원하는 컴포넌트
const FaviconImage: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const [error, setError] = useState(false);

  const getFaviconUrl = (targetUrl: string) => {
    try {
      const domain = new URL(targetUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  };

  const faviconSrc = getFaviconUrl(url);

  if (error || !faviconSrc) {
    return (
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          backgroundColor: 'var(--color-canvas-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--color-brand)'
        }}
      >
        <Globe size={13} color="var(--color-slate-soft)" />
      </div>
    );
  }

  return (
    <img
      src={faviconSrc}
      alt={title}
      className="link-favicon"
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export const LinksHub: React.FC<Props> = ({
  links,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onReorderLinks
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BookmarkLink | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 드래그 앤 드롭 상태
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // 실시간 검색 필터링
  const isSearching = searchQuery.trim().length > 0;
  const filteredLinks = isSearching
    ? links.filter((link) => {
        const query = searchQuery.toLowerCase().trim();
        return link.title.toLowerCase().includes(query) || link.url.toLowerCase().includes(query);
      })
    : links;

  const formatDisplayUrl = (rawUrl: string) => {
    try {
      const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      const host = parsed.hostname.replace(/^www\./, '');
      const path =
        parsed.pathname === '/' && !parsed.search && !parsed.hash
          ? ''
          : `${parsed.pathname}${parsed.search}${parsed.hash}`.replace(/\/$/, '');

      return { host, path };
    } catch {
      const clean = rawUrl.replace(/^https?:\/\//, '').replace(/^www\./, '');
      return { host: clean, path: '' };
    }
  };

  const handleEdit = (link: BookmarkLink, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('이 바로가기를 삭제하시겠습니까?')) {
      onDeleteLink(id);
    }
  };

  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    // 드롭될 때까지 드래그오버 상태 유지
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...links];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);

    onReorderLinks(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <section className="saniti-card links-section">
      <div className="card-header">
        <div className="card-header-left">
          <span className="brand-dot" />
          <h2 className="card-title" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>자주 가는 링크</h2>
          <span className="mono-eyebrow" style={{ marginLeft: '6px', fontFamily: "'Noto Sans KR', sans-serif" }}>
            {isSearching ? `${filteredLinks.length}/${links.length} SITES` : `${links.length} SITES (DRAG TO REORDER)`}
          </span>
        </div>

        <div className="card-header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 실시간 필터 검색창 */}
          <div className="links-search-box">
            <Search size={13} className="links-search-icon" />
            <input
              type="text"
              className="links-search-input"
              placeholder="바로가기 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchQuery('');
              }}
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            />
            {searchQuery && (
              <button
                type="button"
                className="links-search-clear"
                onClick={() => setSearchQuery('')}
                title="검색어 지우기 (ESC)"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'Noto Sans KR', sans-serif" }}
            onClick={() => {
              setEditingLink(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={14} />
            바로가기 추가
          </button>
        </div>
      </div>

      <div className="links-card-body">
        {filteredLinks.length === 0 ? (
          <div className="links-empty-search">
            <Search size={24} style={{ color: 'var(--color-slate-soft)', marginBottom: '8px' }} />
            <div style={{ fontWeight: 600, color: 'var(--color-ink)', marginBottom: '4px' }}>
              '{searchQuery}'에 일치하는 바로가기가 없습니다
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setSearchQuery('')}
              style={{ marginTop: '8px', fontSize: '11.5px', padding: '4px 10px', fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              전체 바로가기 보기
            </button>
          </div>
        ) : (
          <div className="links-grid">
            {filteredLinks.map((link, index) => {
              const { host, path } = formatDisplayUrl(link.url);
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index;

              return (
                <a
                  key={link.id}
                  href={link.url}
                  draggable={!isSearching}
                  onDragStart={(e) => !isSearching && handleDragStart(e, index)}
                  onDragOver={(e) => !isSearching && handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => !isSearching && handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`link-tile ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''} ${isSearching ? 'no-drag' : ''}`}
                  title={isSearching ? link.title : "드래그하여 순서를 바꿀 수 있습니다"}
                >
                  <div className="link-tile-header">
                    <div className="link-favicon-wrapper">
                      <FaviconImage url={link.url} title={link.title} />
                    </div>

                    <div className="link-actions">
                      <button
                        className="link-action-btn"
                        title="수정"
                        onClick={(e) => handleEdit(link, e)}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="link-action-btn delete"
                        title="삭제"
                        onClick={(e) => handleDelete(link.id, e)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="link-title" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{link.title}</div>
                  <div className="link-url" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    <span className="link-url-host">{host}</span>
                    {path && <span className="link-url-path">{path}</span>}
                  </div>
                </a>
              );
            })}

            {/* 새 바로가기 추가 카드 (검색 중이 아닐 때만 노출) */}
            {!isSearching && (
              <button
                className="add-link-tile"
                onClick={() => {
                  setEditingLink(null);
                  setIsModalOpen(true);
                }}
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                <Plus size={20} />
                <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>
                  새 바로가기 추가
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      <BookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(link) => {
          if (editingLink) {
            onUpdateLink(link);
          } else {
            onAddLink(link);
          }
        }}
        editingLink={editingLink}
      />
    </section>
  );
};
