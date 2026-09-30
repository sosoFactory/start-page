import React, { useState, useRef, useEffect } from 'react';
import { TodoItem } from '../types/todo';
import { Square, Plus, Trash2, CheckCircle2, ListTodo, Sparkles } from 'lucide-react';

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

        {completedCount > 0 && (
          <button
            type="button"
            className="todo-clear-completed-btn"
            onClick={onClearCompleted}
            data-tooltip="완료된 항목 모두 정리"
            data-tooltip-pos="bottom-left"
            aria-label="완료된 항목 모두 정리"
          >
            완료 정리
          </button>
        )}
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
                    {/* 체크박스 토글 버튼 */}
                    <button
                      type="button"
                      className="todo-check-btn"
                      onClick={() => onToggleTodo(todo.id)}
                      aria-label={todo.completed ? '미완료로 변경' : '완료로 변경'}
                    >
                      {todo.completed ? (
                        <CheckCircle2 size={16} className="todo-check-icon checked" />
                      ) : (
                        <Square size={16} className="todo-check-icon" />
                      )}
                    </button>

                    {/* 할 일 텍스트 또는 인라인 편집 인풋 */}
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
                      <span
                        className="todo-text"
                        onDoubleClick={() => handleStartEdit(todo)}
                        title="더블클릭하여 수정"
                      >
                        {todo.text}
                      </span>
                    )}

                    {/* 개별 항목 삭제 버튼 */}
                    <button
                      type="button"
                      className="todo-delete-btn"
                      onClick={() => onDeleteTodo(todo.id)}
                      data-tooltip="삭제"
                      data-tooltip-pos="bottom-left"
                      aria-label="삭제"
                    >
                      <Trash2 size={13} />
                    </button>
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
