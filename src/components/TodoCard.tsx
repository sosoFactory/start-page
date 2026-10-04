import React, { useState, useRef, useEffect } from 'react';
import { TodoItem, TodoTab, DEFAULT_TODO_TABS, DEFAULT_TODO_TAB_ID } from '../types/todo';
import {
  Square,
  Plus,
  Trash2,
  CheckCircle2,
  ListTodo,
  Sparkles,
  Pencil,
  ArrowRightLeft,
  X,
  Check,
  GripVertical
} from 'lucide-react';

interface Props {
  todos: TodoItem[];
  tabs?: TodoTab[];
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
  onAddTab?: (name: string) => void;
  onUpdateTab?: (id: string, newName: string) => void;
  onDeleteTab?: (id: string) => void;
  onMoveTodoTab?: (todoId: string, targetTabId: string) => void;
  onReorderTodos?: (newTodos: TodoItem[]) => void;
  onAddTodo: (text: string, tabId?: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onClearCompleted: (tabId?: string) => void;
  onUpdateTodo?: (id: string, newText: string) => void;
}

export const TodoCard: React.FC<Props> = ({
  todos,
  tabs = DEFAULT_TODO_TABS,
  activeTabId = DEFAULT_TODO_TAB_ID,
  onSelectTab,
  onAddTab,
  onUpdateTab,
  onDeleteTab,
  onMoveTodoTab,
  onReorderTodos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onClearCompleted,
  onUpdateTodo
}) => {
  const [inputText, setInputText] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTodoText, setEditingTodoText] = useState('');
  
  // 탭 관리 상태
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState('');
  
  // 이동 드롭다운 상태
  const [moveMenuTodoId, setMoveMenuTodoId] = useState<string | null>(null);

  // 드래그 앤 드롭 상태
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const newTabInputRef = useRef<HTMLInputElement>(null);
  const editTabInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 현재 활성 탭에 속한 할 일 목록
  const currentTabId = activeTabId || DEFAULT_TODO_TAB_ID;
  const currentTabTodos = todos.filter(
    (t) => (t.tabId || DEFAULT_TODO_TAB_ID) === currentTabId
  );

  const currentCompletedCount = currentTabTodos.filter((t) => t.completed).length;
  const currentTotalCount = currentTabTodos.length;

  // 인라인 수정 포커스 제어
  useEffect(() => {
    if (editingTodoId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTodoId]);

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

  // 이동 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoveMenuTodoId(null);
      }
    };
    if (moveMenuTodoId) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [moveMenuTodoId]);

  // 할 일 추가
  const handleSubmitTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAddTodo(trimmed, currentTabId);
    setInputText('');
  };

  // 할 일 수정
  const handleStartEditTodo = (todo: TodoItem) => {
    setEditingTodoId(todo.id);
    setEditingTodoText(todo.text);
    setMoveMenuTodoId(null);
  };

  const handleSaveEditTodo = (id: string) => {
    const trimmed = editingTodoText.trim();
    if (trimmed && onUpdateTodo) {
      onUpdateTodo(id, trimmed);
    } else if (!trimmed) {
      onDeleteTodo(id);
    }
    setEditingTodoId(null);
  };

  const handleEditTodoKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEditTodo(id);
    } else if (e.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  // 탭 추가 제출
  const handleSaveNewTab = () => {
    const trimmed = newTabName.trim();
    if (trimmed && onAddTab) {
      onAddTab(trimmed);
    }
    setNewTabName('');
    setIsAddingTab(false);
  };

  // 탭 수정 제출
  const handleSaveEditTab = (id: string) => {
    const trimmed = editingTabName.trim();
    if (trimmed && onUpdateTab) {
      onUpdateTab(id, trimmed);
    }
    setEditingTabId(null);
  };

  // 탭 삭제
  const handleDeleteTabClick = (e: React.MouseEvent, tab: TodoTab) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    if (window.confirm(`'${tab.name}' 탭을 삭제하시겠습니까?\n소속된 할 일은 기본 탭으로 안전하게 이전됩니다.`)) {
      onDeleteTab?.(tab.id);
    }
  };

  // 다른 탭으로 할 일 이동
  const handleMoveToTab = (todoId: string, targetTabId: string) => {
    onMoveTodoTab?.(todoId, targetTabId);
    setMoveMenuTodoId(null);
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
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedTabTodos = [...currentTabTodos];
    const [draggedItem] = reorderedTabTodos.splice(draggedIndex, 1);
    reorderedTabTodos.splice(targetIndex, 0, draggedItem);

    // 전체 todos 배열에서 현재 탭의 할 일 순서를 reorderedTabTodos로 교체
    let tabIndex = 0;
    const nextTodos = todos.map((todo) => {
      const itemTabId = todo.tabId || DEFAULT_TODO_TAB_ID;
      if (itemTabId === currentTabId) {
        const replacement = reorderedTabTodos[tabIndex];
        tabIndex++;
        return replacement;
      }
      return todo;
    });

    onReorderTodos?.(nextTodos);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const currentTab = tabs.find((t) => t.id === currentTabId);

  return (
    <div className="saniti-card todo-card">
      {/* 카드 헤더 */}
      <div className="card-header">
        <div className="card-header-left">
          <ListTodo size={16} color="var(--color-brand)" />
          <h2 className="card-title">오늘의 할 일</h2>
          {currentTotalCount > 0 && (
            <span className="todo-progress-badge">
              {currentCompletedCount}/{currentTotalCount} 완료
            </span>
          )}
        </div>

        {/* 완료 삭제 버튼 */}
        <button
          type="button"
          className="todo-clear-completed-btn"
          onClick={() => onClearCompleted(currentTabId)}
          disabled={currentCompletedCount === 0}
          data-tooltip={currentCompletedCount > 0 ? `'${currentTab?.name || '현재 탭'}' 완료 항목 삭제` : undefined}
          data-tooltip-pos="bottom-left"
          aria-label="완료된 항목 모두 삭제"
        >
          완료 삭제
        </button>
      </div>

      {/* 다중 탭 바 (Tab Bar) */}
      <div className="todo-tabs-bar">
        <div className="todo-tabs-list">
          {tabs.map((tab) => {
            const isActive = tab.id === currentTabId;
            const isEditing = editingTabId === tab.id;
            const tabTodos = todos.filter((t) => (t.tabId || DEFAULT_TODO_TAB_ID) === tab.id);
            const tabTotal = tabTodos.length;
            const tabCompleted = tabTodos.filter((t) => t.completed).length;

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
                  />
                  <button
                    type="button"
                    className="todo-tab-icon-btn"
                    onClick={() => handleSaveEditTab(tab.id)}
                  >
                    <Check size={11} />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={tab.id}
                type="button"
                className={`todo-tab-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab?.(tab.id)}
                onDoubleClick={() => {
                  setEditingTabId(tab.id);
                  setEditingTabName(tab.name);
                }}
              >
                <span className="todo-tab-name">{tab.name}</span>
                <span className="todo-tab-badge">
                  {tabTotal > 0 ? `${tabCompleted}/${tabTotal}` : '0'}
                </span>

                {/* 탭 관리 버튼 (호버 시 노출) */}
                <span className="todo-tab-actions" onClick={(e) => e.stopPropagation()}>
                  <span
                    className="todo-tab-action-icon"
                    onClick={() => {
                      setEditingTabId(tab.id);
                      setEditingTabName(tab.name);
                    }}
                    data-tooltip="탭 이름 수정"
                    data-tooltip-pos="bottom"
                  >
                    <Pencil size={10} />
                  </span>
                  {tabs.length > 1 && (
                    <span
                      className="todo-tab-action-icon delete"
                      onClick={(e) => handleDeleteTabClick(e, tab)}
                      data-tooltip="탭 삭제"
                      data-tooltip-pos="bottom"
                    >
                      <X size={11} />
                    </span>
                  )}
                </span>
              </button>
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
              />
              <button type="button" className="todo-tab-icon-btn" onClick={handleSaveNewTab}>
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

      {/* 카드 본문 */}
      <div className="card-body todo-card-body">
        {/* 인라인 입력 폼 */}
        <form onSubmit={handleSubmitTodo} className="todo-input-form">
          <input
            ref={inputRef}
            type="text"
            className="todo-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`'${currentTab?.name || '현재 탭'}'에 할 일 추가... (Enter)`}
            maxLength={120}
          />
          <button
            type="submit"
            className="todo-add-btn"
            disabled={!inputText.trim()}
            data-tooltip="추가"
            data-tooltip-pos="bottom"
            aria-label="할 일 추가"
          >
            <Plus size={15} />
          </button>
        </form>

        {/* 할 일 목록 영역 */}
        <div className="todo-list-container">
          {currentTotalCount === 0 ? (
            <div className="todo-empty-state">
              <Sparkles size={24} className="todo-empty-icon" />
              <p className="todo-empty-title">
                '{currentTab?.name || '현재 탭'}'의 할 일이 모두 완료되었거나 없습니다.
              </p>
              <span className="todo-empty-desc">위 입력창에 해야 할 일을 등록해보세요.</span>
            </div>
          ) : (
            <ul className="todo-list">
              {currentTabTodos.map((todo, index) => {
                const isEditing = editingTodoId === todo.id;
                const isMoveOpen = moveMenuTodoId === todo.id;
                const otherTabs = tabs.filter((t) => t.id !== currentTabId);
                const isDragging = draggedIndex === index;
                const isDragOver = dragOverIndex === index;

                return (
                  <li
                    key={todo.id}
                    draggable={!isEditing}
                    onDragStart={(e) => !isEditing && handleDragStart(e, index)}
                    onDragOver={(e) => !isEditing && handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => !isEditing && handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`todo-item ${todo.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                  >
                    {/* 드래그 핸들 아이콘 */}
                    {!isEditing && (
                      <span className="todo-drag-handle" aria-hidden="true">
                        <GripVertical size={13} />
                      </span>
                    )}

                    {/* 인라인 수정 중일 때 */}
                    {isEditing ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        className="todo-edit-input"
                        value={editingTodoText}
                        onChange={(e) => setEditingTodoText(e.target.value)}
                        onBlur={() => handleSaveEditTodo(todo.id)}
                        onKeyDown={(e) => handleEditTodoKeyDown(e, todo.id)}
                        maxLength={120}
                      />
                    ) : (
                      /* 라벨 연동: 텍스트 클릭 시에도 체크박스 토글 */
                      <label
                        htmlFor={`todo-check-${todo.id}`}
                        className="todo-content-label"
                      >
                        <input
                          id={`todo-check-${todo.id}`}
                          type="checkbox"
                          className="todo-hidden-checkbox"
                          checked={todo.completed}
                          onChange={() => onToggleTodo(todo.id)}
                        />
                        <span className="todo-check-custom">
                          {todo.completed ? (
                            <CheckCircle2 size={16} className="todo-check-icon checked" />
                          ) : (
                            <Square size={16} className="todo-check-icon" />
                          )}
                        </span>
                        <span className="todo-text">{todo.text}</span>
                      </label>
                    )}

                    {/* 개별 항목 액션 버튼 (이동, 수정, 삭제) */}
                    <div className="todo-actions">
                      {/* 다른 탭으로 이동 버튼 */}
                      {otherTabs.length > 0 && !isEditing && (
                        <div className="todo-move-container" ref={isMoveOpen ? dropdownRef : undefined}>
                          <button
                            type="button"
                            className={`todo-action-btn ${isMoveOpen ? 'active' : ''}`}
                            onClick={() => setMoveMenuTodoId(isMoveOpen ? null : todo.id)}
                            data-tooltip="다른 탭으로 이동"
                            data-tooltip-pos="bottom-left"
                            aria-label="다른 탭으로 이동"
                          >
                            <ArrowRightLeft size={12} />
                          </button>

                          {/* 탭 이동 드롭다운 메뉴 */}
                          {isMoveOpen && (
                            <div className="todo-move-dropdown">
                              <div className="todo-move-dropdown-title">탭으로 이동</div>
                              {otherTabs.map((targetTab) => (
                                <button
                                  key={targetTab.id}
                                  type="button"
                                  className="todo-move-dropdown-item"
                                  onClick={() => handleMoveToTab(todo.id, targetTab.id)}
                                >
                                  <span>{targetTab.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {!isEditing && (
                        <button
                          type="button"
                          className="todo-action-btn"
                          onClick={() => handleStartEditTodo(todo)}
                          data-tooltip="수정"
                          data-tooltip-pos="bottom-left"
                          aria-label="수정"
                        >
                          <Pencil size={12} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="todo-action-btn delete"
                        onClick={() => onDeleteTodo(todo.id)}
                        data-tooltip="삭제"
                        data-tooltip-pos="bottom-left"
                        aria-label="삭제"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
