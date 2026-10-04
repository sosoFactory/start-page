import React, { useState, useMemo } from 'react';
import { TodoItem, TodoTab, DEFAULT_TODO_TABS, DEFAULT_TODO_TAB_ID } from '../types/todo';
import { ListTodo, Sparkles } from 'lucide-react';
import { computeTabStats, filterTodosByTab, reorderTabTodos } from '../utils/todoHelper';
import { TodoTabBar } from './todo/TodoTabBar';
import { TodoInputForm } from './todo/TodoInputForm';
import { TodoItemRow } from './todo/TodoItemRow';

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
  // 드래그 앤 드롭 상태
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const currentTabId = activeTabId || DEFAULT_TODO_TAB_ID;

  // 1회 순회로 탭별 통계 계산 (O(1) 룩업을 위한 메모이제이션)
  const tabStatsMap = useMemo(() => computeTabStats(todos), [todos]);

  // 현재 활성 탭의 할 일 목록 필터링 (메모이제이션)
  const currentTabTodos = useMemo(
    () => filterTodosByTab(todos, currentTabId),
    [todos, currentTabId]
  );

  const currentStats = tabStatsMap[currentTabId] || { total: 0, completed: 0 };
  const currentTab = useMemo(
    () => tabs.find((t) => t.id === currentTabId),
    [tabs, currentTabId]
  );
  const otherTabs = useMemo(
    () => tabs.filter((t) => t.id !== currentTabId),
    [tabs, currentTabId]
  );

  const handleAdd = (text: string) => {
    onAddTodo(text, currentTabId);
  };

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

    const nextTodos = reorderTabTodos(todos, currentTabId, draggedIndex, targetIndex);
    onReorderTodos?.(nextTodos);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="saniti-card todo-card">
      {/* 카드 헤더 */}
      <div className="card-header">
        <div className="card-header-left">
          <ListTodo size={16} color="var(--color-brand)" />
          <h2 className="card-title">오늘의 할 일</h2>
          {currentStats.total > 0 && (
            <span className="todo-progress-badge">
              {currentStats.completed}/{currentStats.total} 완료
            </span>
          )}
        </div>

        {/* 완료 삭제 버튼 */}
        <button
          type="button"
          className="todo-clear-completed-btn"
          onClick={() => onClearCompleted(currentTabId)}
          disabled={currentStats.completed === 0}
          data-tooltip={
            currentStats.completed > 0
              ? `'${currentTab?.name || '현재 탭'}' 완료 항목 삭제`
              : undefined
          }
          data-tooltip-pos="bottom-left"
          aria-label="완료된 항목 모두 삭제"
        >
          완료 삭제
        </button>
      </div>

      {/* 다중 탭 바 (Tab Bar) */}
      <TodoTabBar
        tabs={tabs}
        activeTabId={currentTabId}
        tabStatsMap={tabStatsMap}
        onSelectTab={onSelectTab}
        onAddTab={onAddTab}
        onUpdateTab={onUpdateTab}
        onDeleteTab={onDeleteTab}
      />

      {/* 카드 본문 */}
      <div className="card-body todo-card-body">
        {/* 인라인 입력 폼 */}
        <TodoInputForm
          currentTabName={currentTab?.name || '현재 탭'}
          onAddTodo={handleAdd}
        />

        {/* 할 일 목록 영역 */}
        <div className="todo-list-container">
          {currentStats.total === 0 ? (
            <div className="todo-empty-state">
              <Sparkles size={24} className="todo-empty-icon" />
              <p className="todo-empty-title">
                '{currentTab?.name || '현재 탭'}'의 할 일이 모두 완료되었거나 없습니다.
              </p>
              <span className="todo-empty-desc">위 입력창에 해야 할 일을 등록해보세요.</span>
            </div>
          ) : (
            <ul className="todo-list">
              {currentTabTodos.map((todo, index) => (
                <TodoItemRow
                  key={todo.id}
                  todo={todo}
                  index={index}
                  otherTabs={otherTabs}
                  isDragging={draggedIndex === index}
                  isDragOver={dragOverIndex === index}
                  onToggleTodo={onToggleTodo}
                  onDeleteTodo={onDeleteTodo}
                  onUpdateTodo={onUpdateTodo}
                  onMoveTodoTab={onMoveTodoTab}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
