import React, { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  currentTabName: string;
  onAddTodo: (text: string) => void;
}

export const TodoInputForm: React.FC<Props> = ({ currentTabName, onAddTodo }) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAddTodo(trimmed);
    setInputText('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        ref={inputRef}
        type="text"
        className="todo-input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={`'${currentTabName || '현재 탭'}'에 할 일 추가... (Enter)`}
        maxLength={120}
        aria-label="할 일 입력"
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
  );
};
