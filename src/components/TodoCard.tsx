import React, { useState, useRef, useEffect } from 'react';
import { TodoItem } from '../types/todo';
import { Square, Plus, Trash2, CheckCircle2, ListTodo, Sparkles, Pencil } from 'lucide-react';

interface Props {
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onClearCompleted: () => void;
  onUpdateTodo?: (id: string, newText: string) => void;
}

export const TodoCard: React.FC<Props> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onClearCompleted,
  onUpdateTodo
}) => {
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAddTodo(trimmed);
    setInputText('');
  };

  const handleStartEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editingText.trim();
    if (trimmed && onUpdateTodo) {
      onUpdateTodo(id, trimmed);
    } else if (!trimmed) {
      onDeleteTodo(id);
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="saniti-card todo-card">
      {/* 카드 헤더 */}
      <div className="card-header">
        <div className="card-header-left">
          <ListTodo size={16} color="var(--color-brand)" />
          <h2 className="card-title">오늘의 할 일</h2>
          {totalCount > 0 && (
            <span className="todo-progress-badge">
              {completedCount}/{totalCount} 완료
            </span>
          )}
        </div>

        {/* 완료 정리 버튼 상시 노출 (완료 항목 없을 시 disabled) */}
        <button
          type="button"
          className="todo-clear-completed-btn"
          onClick={onClearCompleted}
          disabled={completedCount === 0}
          data-tooltip={completedCount > 0 ? '완료된 항목 모두 정리' : undefined}
          data-tooltip-pos="bottom-left"
          aria-label="완료된 항목 모두 정리"
        >
          완료 정리
        </button>
      </div>

      {/* 카드 본문 */}
      <div className="card-body todo-card-body">
        {/* 인라인 입력 폼 */}
        <form onSubmit={handleSubmit} className="todo-input-form">
          <input
            ref={inputRef}
            type="text"
            className="todo-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="새로운 할 일 입력... (Enter로 추가)"
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
          {totalCount === 0 ? (
            <div className="todo-empty-state">
              <Sparkles size={26} className="todo-empty-icon" />
              <p className="todo-empty-title">오늘의 할 일이 모두 완료되었거나 없습니다.</p>
              <span className="todo-empty-desc">위 입력창에 해야 할 일을 등록해보세요.</span>
            </div>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => {
                const isEditing = editingId === todo.id;

                return (
                  <li
                    key={todo.id}
                    className={`todo-item ${todo.completed ? 'completed' : ''}`}
                  >
                    {/* 인라인 수정 중일 때 */}
                    {isEditing ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        className="todo-edit-input"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={() => handleSaveEdit(todo.id)}
                        onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
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

                    {/* 개별 항목 액션 버튼 (수정 & 삭제) */}
                    <div className="todo-actions">
                      {!isEditing && (
                        <button
                          type="button"
                          className="todo-action-btn"
                          onClick={() => handleStartEdit(todo)}
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
