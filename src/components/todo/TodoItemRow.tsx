import React, { useState, useRef, useEffect } from 'react';
import { TodoItem, TodoTab } from '../../types/todo';
import {
  Square,
  Trash2,
  CheckCircle2,
  Pencil,
  ArrowRightLeft,
  GripVertical
} from 'lucide-react';

interface Props {
  todo: TodoItem;
  index: number;
  otherTabs: TodoTab[];
  isDragging: boolean;
  isDragOver: boolean;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo?: (id: string, newText: string) => void;
  onMoveTodoTab?: (todoId: string, targetTabId: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

export const TodoItemRow: React.FC<Props> = ({
  todo,
  index,
  otherTabs,
  isDragging,
  isDragOver,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
  onMoveTodoTab,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);
  const moveMenuRef = useRef<HTMLDivElement>(null);

  // 인라인 수정 모드 진입 시 포커스 및 텍스트 선택
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  // 이동 드롭다운 외부 클릭 감지
  useEffect(() => {
    if (!isMoveOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (moveMenuRef.current && !moveMenuRef.current.contains(e.target as Node)) {
        setIsMoveOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMoveOpen]);

  const handleStartEdit = () => {
    setEditText(todo.text);
    setIsEditing(true);
    setIsMoveOpen(false);
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text && onUpdateTodo) {
      onUpdateTodo(todo.id, trimmed);
    } else {
      // 빈 입력이거나 변경이 없는 경우 실수 삭제를 방지하고 원래 텍스트로 복구
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleMoveToTargetTab = (targetTabId: string) => {
    onMoveTodoTab?.(todo.id, targetTabId);
    setIsMoveOpen(false);
  };

  return (
    <li
      draggable={!isEditing}
      onDragStart={(e) => !isEditing && onDragStart(e, index)}
      onDragOver={(e) => !isEditing && onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => !isEditing && onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
    >
      {/* 드래그 핸들 아이콘 */}
      {!isEditing && (
        <span className="todo-drag-handle" aria-hidden="true">
          <GripVertical size={13} />
        </span>
      )}

      {/* 인라인 수정 모드 */}
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          className="todo-edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleEditKeyDown}
          maxLength={120}
          aria-label="할 일 내용 수정"
        />
      ) : (
        /* 라벨 연동: 텍스트 클릭 시에도 체크박스 토글 */
        <label htmlFor={`todo-check-${todo.id}`} className="todo-content-label">
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
          <div className="todo-move-container" ref={isMoveOpen ? moveMenuRef : undefined}>
            <button
              type="button"
              className={`todo-action-btn ${isMoveOpen ? 'active' : ''}`}
              onClick={() => setIsMoveOpen((prev) => !prev)}
              data-tooltip="다른 탭으로 이동"
              data-tooltip-pos="bottom-left"
              aria-label="다른 탭으로 이동"
            >
              <ArrowRightLeft size={12} />
            </button>

            {/* 탭 이동 드롭다운 메뉴 */}
            {isMoveOpen && (
              <div className="todo-move-dropdown" aria-label="이동할 탭 선택">
                <div className="todo-move-dropdown-title">탭으로 이동</div>
                {otherTabs.map((targetTab) => (
                  <button
                    key={targetTab.id}
                    type="button"
                    className="todo-move-dropdown-item"
                    onClick={() => handleMoveToTargetTab(targetTab.id)}
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
            onClick={handleStartEdit}
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
};
