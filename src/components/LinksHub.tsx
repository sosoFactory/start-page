import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BookmarkLink } from '../data/presetLinks';
import { Plus, Edit2, Trash2, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { BookmarkModal } from './BookmarkModal';
import { extractAllTags } from '../utils/tagHelper';
import {
  extractDomain,
  getFaviconSources,
  getCachedFavicon,
  setCachedFavicon,
  getSmartInitial,
  getInitialBadgeTheme,
  isDefaultGlobeImage
} from '../utils/faviconHelper';

interface Props {
  links: BookmarkLink[];
  onAddLink: (link: BookmarkLink) => void;
  onUpdateLink: (link: BookmarkLink) => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks: (newLinks: BookmarkLink[]) => void;
  openInNewTab?: boolean;
}

// 파비콘 다단계 폴백 및 스마트 이니셜 배지를 지원하는 컴포넌트
const FaviconImage: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const domain = extractDomain(url);
  const sources = getFaviconSources(url);
  const cached = domain ? getCachedFavicon(domain) : null;

  const [sourceIndex, setSourceIndex] = useState(0);
  const [useInitial, setUseInitial] = useState(() => Boolean(cached?.useInitial || sources.length === 0));

  // url 변경 시 상태 리셋
  useEffect(() => {
    const currentCached = domain ? getCachedFavicon(domain) : null;
    if (currentCached?.useInitial || sources.length === 0) {
      setUseInitial(true);
    } else {
      setUseInitial(false);
      setSourceIndex(0);
    }
  }, [url, domain]);

  const handleNextSource = () => {
    if (sourceIndex + 1 < sources.length) {
      setSourceIndex((prev) => prev + 1);
    } else {
      setUseInitial(true);
      if (domain) {
        setCachedFavicon(domain, { useInitial: true });
      }
    }
  };

  const handleError = () => {
    handleNextSource();
  };

  const handleLoad = async (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = sources[sourceIndex] || '';

    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      handleNextSource();
      return;
    }

    // Google Favicon V2 / S2(&sz=64)에서 16x16으로 반환된 경우, 726 바이트 기본 회색 지구본인지 정밀 판별 (Tina 같은 진짜 16x16 파비콘은 보존)
    const isGoogleFavicon = currentSrc.includes('google.com/s2/favicons') || currentSrc.includes('gstatic.com/faviconV2');
    if (isGoogleFavicon && img.naturalWidth === 16 && img.naturalHeight === 16) {
      const isGlobe = await isDefaultGlobeImage(currentSrc);
      if (isGlobe) {
        handleNextSource();
        return;
      }
    }

    if (domain && currentSrc) {
      setCachedFavicon(domain, { src: currentSrc });
    }
  };

  if (useInitial || !sources[sourceIndex]) {
    const initialText = getSmartInitial(title, url);
    const theme = getInitialBadgeTheme(title || domain || 'default');
    const isSingleChar = initialText.length === 1;

    return (
      <div
        className="link-favicon-badge"
        style={{
          backgroundColor: theme.bg,
          color: theme.color,
          fontSize: isSingleChar ? '11px' : '9.5px'
        }}
        title={title || domain}
      >
        {initialText}
      </div>
    );
  }

  const currentSrc = sources[sourceIndex];

  return (
    <img
      key={`${url}-${sourceIndex}`}
      src={currentSrc}
      alt={title}
      className="link-favicon"
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};

export const LinksHub: React.FC<Props> = ({
  links,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onReorderLinks,
  openInNewTab = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BookmarkLink | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isTagExpanded, setIsTagExpanded] = useState<boolean>(false);
  const [hasOverflow, setHasOverflow] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagListRef = useRef<HTMLDivElement>(null);

  // 전체 등록된 태그 및 빈도수 추출
  const allTagStats = useMemo(() => extractAllTags(links), [links]);
  const existingTagsList = useMemo(() => allTagStats.map((t) => t.tag), [allTagStats]);

  // 태그 목록 DOM 줄 수(2줄 초과 여부) 동적 감지
  useEffect(() => {
    const el = tagListRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length === 0) {
        setHasOverflow(false);
        return;
      }
      const lineTops = new Set(children.map((c) => c.offsetTop));
      // 브라우저 DOM 렌더링에서 고유 offsetTop이 3개 이상이면 2줄 초과
      // jsdom(테스트 환경)에서는 offsetTop이 0이므로 자식 개수로 보조 판별
      const isOver = lineTops.size > 2 || (lineTops.size <= 1 && children.length > 15);
      setHasOverflow(isOver);
    };

    checkOverflow();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkOverflow();
      });
      resizeObserver.observe(el);
    }

    window.addEventListener('resize', checkOverflow);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [allTagStats]);

  // 전역 '/' 단축키로 검색창 포커스
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        const isEditable = document.activeElement?.getAttribute('contenteditable') === 'true';

        // 이미 입력 요소에 포커스되어 있거나 모달이 열려 있는 경우 제외
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select' || isEditable || isModalOpen) {
          return;
        }

        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isModalOpen]);

  // 드래그 앤 드롭 상태
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // 실시간 검색 & 태그 필터링
  const isSearching = searchQuery.trim().length > 0;
  const isTagFiltered = selectedTag !== null;
  const isFiltering = isSearching || isTagFiltered;

  const filteredLinks = useMemo(() => {
    let result = links;

    if (selectedTag) {
      result = result.filter((link) => link.tags?.includes(selectedTag));
    }

    if (isSearching) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((link) => {
        const matchTitle = link.title.toLowerCase().includes(query);
        const matchUrl = link.url.toLowerCase().includes(query);
        const matchTag = link.tags?.some((t) => t.toLowerCase().includes(query));
        return matchTitle || matchUrl || matchTag;
      });
    }

    return result;
  }, [links, selectedTag, isSearching, searchQuery]);

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
          <h2 className="card-title">자주 가는 링크</h2>
          <span className="mono-eyebrow" style={{ marginLeft: '6px' }}>
            {isFiltering
              ? `${filteredLinks.length}/${links.length} SITES`
              : `${links.length} SITES (DRAG TO REORDER)`}
          </span>
        </div>

        <div className="card-header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 실시간 필터 검색창 */}
          <div className="links-search-box">
            <Search size={13} className="links-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="links-search-input"
              placeholder="바로가기 검색... (단축키: /)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                  searchInputRef.current?.blur();
                }
              }}
            />
            {searchQuery ? (
              <button
                type="button"
                className="links-search-clear"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                data-tooltip="지우기"
                aria-label="검색어 지우기"
              >
                <X size={12} />
              </button>
            ) : (
              <kbd
                className="links-search-kbd"
                data-tooltip="검색 단축키 (/)"
                data-tooltip-pos="bottom"
              >
                /
              </kbd>
            )}
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
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

      {/* 태그 클라우드 (등록된 태그가 있을 때 노출, 실제 2줄 초과 시 더보기 토글 지원) */}
      {allTagStats.length > 0 && (
        <div className={`tag-cloud-bar ${isTagExpanded ? 'expanded' : ''}`}>
          <div className="tag-cloud-list" ref={tagListRef}>
            <button
              type="button"
              className={`tag-pill ${selectedTag === null ? 'active' : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              전체 <span className="tag-pill-count">{links.length}</span>
            </button>
            {allTagStats.map(({ tag, count }) => (
              <button
                key={tag}
                type="button"
                className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag((prev) => (prev === tag ? null : tag))}
              >
                #{tag} <span className="tag-pill-count">{count}</span>
              </button>
            ))}
          </div>

          {/* 더보기 / 접기 토글 버튼 (2줄 초과 시 자동 노출) */}
          {(hasOverflow || isTagExpanded) && (
            <button
              type="button"
              className="tag-pill tag-pill-toggle"
              onClick={() => setIsTagExpanded((prev) => !prev)}
            >
              {isTagExpanded ? (
                <>
                  접기 <ChevronUp size={12} />
                </>
              ) : (
                <>
                  더보기 <ChevronDown size={12} />
                </>
              )}
            </button>
          )}
        </div>
      )}

      <div className="links-card-body">
        {filteredLinks.length === 0 ? (
          <div className="links-empty-search">
            <Search size={24} style={{ color: 'var(--color-slate-soft)', marginBottom: '8px' }} />
            <div style={{ fontWeight: 600, color: 'var(--color-ink)', marginBottom: '4px' }}>
              {isSearching
                ? `'${searchQuery}'에 일치하는 바로가기가 없습니다`
                : selectedTag
                ? `'#${selectedTag}' 태그를 가진 바로가기가 없습니다`
                : '등록된 바로가기가 없습니다'}
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag(null);
              }}
              style={{ marginTop: '8px', fontSize: '11.5px', padding: '4px 10px' }}
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
                  target={openInNewTab ? '_blank' : '_self'}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                  draggable={!isFiltering}
                  onDragStart={(e) => !isFiltering && handleDragStart(e, index)}
                  onDragOver={(e) => !isFiltering && handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => !isFiltering && handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`link-tile ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''} ${isFiltering ? 'no-drag' : ''}`}
                >
                  <div className="link-tile-header">
                    <div className="link-favicon-wrapper">
                      <FaviconImage url={link.url} title={link.title} />
                    </div>

                    <div className="link-actions">
                      <button
                        type="button"
                        className="link-action-btn"
                        data-tooltip="수정"
                        aria-label="바로가기 수정"
                        onClick={(e) => handleEdit(link, e)}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="link-action-btn delete"
                        data-tooltip="삭제"
                        aria-label="바로가기 삭제"
                        onClick={(e) => handleDelete(link.id, e)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="link-title">{link.title}</div>
                  <div className="link-url">
                    <span className="link-url-host">{host}</span>
                    {path && <span className="link-url-path">{path}</span>}
                  </div>

                  {/* 타일 내 태그 뱃지 목록 */}
                  {link.tags && link.tags.length > 0 && (
                    <div className="link-tile-tags">
                      {link.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="link-tag-badge">
                          #{tag}
                        </span>
                      ))}
                      {link.tags.length > 3 && (
                        <span className="link-tag-more">+{link.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </a>
              );
            })}

            {/* 새 바로가기 추가 카드 (필터/검색 중이 아닐 때만 노출) */}
            {!isFiltering && (
              <button
                className="add-link-tile"
                onClick={() => {
                  setEditingLink(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus size={20} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>
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
        existingTags={existingTagsList}
      />
    </section>
  );
};
