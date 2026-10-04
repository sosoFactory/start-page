import React, { useState, useRef, useEffect } from 'react';
import { TodoTab } from '../../types/todo';
import { TabStats } from '../../utils/todoHelper';
import { Plus, Pencil, X, Check } from 'lucide-react';

interface Props {
  tabs: TodoTab[];
  activeTabId: string;
  tabStatsMap: Record<string, TabStats>;
  onSelectTab?: (tabId: string) => void;
  onAddTab?: (name: string) => void;
  onUpdateTab?: (id: string, newName: string) => void;
  onDeleteTab?: (id: string) => void;
}

export const TodoTabBar: React.FC<Props> = ({
  tabs,
  activeTabId,
  tabStatsMap,
  onSelectTab,
  onAddTab,
  onUpdateTab,
  onDeleteTab
}) => {
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState('');

  const newTabInputRef = useRef<HTMLInputElement>(null);
  const editTabInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingTab && newTabInputRef.current) {
      newTabInputRef.current.focus();
    }
  }, [isAddingTab]);

  useEffect(() => {
    if (editingTabId && editTabInputRef.current) {
      editTabInputRef.current.focus();
      editTabInputRef.current.select();
    }
  }, [editingTabId]);

  const handleSaveNewTab = () => {
    const trimmed = newTabName.trim();
    if (trimmed && onAddTab) {
      onAddTab(trimmed);
    }
    setNewTabName('');
    setIsAddingTab(false);
  };

  const handleSaveEditTab = (id: string) => {
    const trimmed = editingTabName.trim();
    if (trimmed && onUpdateTab) {
      onUpdateTab(id, trimmed);
    }
    setEditingTabId(null);
  };

  const handleDeleteTabClick = (e: React.MouseEvent, tab: TodoTab) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    if (window.confirm(`'${tab.name}' 탭을 삭제하시겠습니까?\n소속된 할 일은 기본 탭으로 안전하게 이전됩니다.`)) {
      onDeleteTab?.(tab.id);
    }
  };

  return (
    <div className="todo-tabs-bar" role="tablist" aria-label="할 일 탭 목록">
      <div className="todo-tabs-list">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isEditing = editingTabId === tab.id;
          const stats = tabStatsMap[tab.id] || { total: 0, completed: 0 };
          const badgeText = stats.total > 0 ? `${stats.completed}/${stats.total}` : '0';

          if (isEditing) {
            return (
              <div key={tab.id} className="todo-tab-item active editing">
                <input
                  ref={editTabInputRef}
                  type="text"
                  className="todo-tab-inline-input"
                  value={editingTabName}
                  onChange={(e) => setEditingTabName(e.target.value)}
                  onBlur={() => handleSaveEditTab(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEditTab(tab.id);
                    if (e.key === 'Escape') setEditingTabId(null);
                  }}
                  maxLength={20}
                  aria-label="탭 이름 수정 입력"
                />
                <button
                  type="button"
                  className="todo-tab-icon-btn"
                  onClick={() => handleSaveEditTab(tab.id)}
                  aria-label="수정 완료"
                >
                  <Check size={11} />
                </button>
              </div>
            );
          }

          return (
            <div
              key={tab.id}
              className={`todo-tab-item ${isActive ? 'active' : ''}`}
              role="tab"
              aria-selected={isActive}
            >
              <button
                type="button"
                className="todo-tab-btn"
                onClick={() => onSelectTab?.(tab.id)}
                onDoubleClick={() => {
                  setEditingTabId(tab.id);
                  setEditingTabName(tab.name);
                }}
              >
                <span className="todo-tab-name">{tab.name}</span>
                <span className="todo-tab-badge">{badgeText}</span>
              </button>

              {/* 탭 관리 버튼 (호버 시 노출) */}
              <span className="todo-tab-actions">
                <button
                  type="button"
                  className="todo-tab-action-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTabId(tab.id);
                    setEditingTabName(tab.name);
                  }}
                  data-tooltip="탭 이름 수정"
                  data-tooltip-pos="bottom"
                  aria-label="탭 이름 수정"
                >
                  <Pencil size={10} />
                </button>
                {tabs.length > 1 && (
                  <button
                    type="button"
                    className="todo-tab-action-icon delete"
                    onClick={(e) => handleDeleteTabClick(e, tab)}
                    data-tooltip="탭 삭제"
                    data-tooltip-pos="bottom"
                    aria-label="탭 삭제"
                  >
                    <X size={11} />
                  </button>
                )}
              </span>
            </div>
          );
        })}

        {/* 탭 추가 인라인 인풋 or 버튼 */}
        {isAddingTab ? (
          <div className="todo-tab-add-box">
            <input
              ref={newTabInputRef}
              type="text"
              className="todo-tab-inline-input"
              placeholder="새 탭 이름"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              onBlur={handleSaveNewTab}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNewTab();
                if (e.key === 'Escape') setIsAddingTab(false);
              }}
              maxLength={20}
              aria-label="새 탭 이름 입력"
            />
            <button
              type="button"
              className="todo-tab-icon-btn"
              onClick={handleSaveNewTab}
              aria-label="탭 추가 완료"
            >
              <Check size={11} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="todo-tab-add-btn"
            onClick={() => setIsAddingTab(true)}
            data-tooltip="새 탭 추가"
            data-tooltip-pos="bottom"
            aria-label="새 탭 추가"
          >
            <Plus size={13} />
          </button>
        )}
      </div>
    </div>
  );
};
