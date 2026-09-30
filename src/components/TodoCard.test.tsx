import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoCard } from './TodoCard';
import { TodoItem } from '../types/todo';

describe('TodoCard', () => {
  const mockTodos: TodoItem[] = [
    { id: '1', text: '테스트 할 일 1', completed: false, createdAt: 1000 },
    { id: '2', text: '테스트 할 일 2', completed: true, createdAt: 2000 }
  ];

  it('renders todos and progress badge properly', () => {
    render(
      <TodoCard
        todos={mockTodos}
        onAddTodo={vi.fn()}
        onToggleTodo={vi.fn()}
        onDeleteTodo={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    );

    expect(screen.getByText('오늘의 할 일')).toBeTruthy();
    expect(screen.getByText('1/2 완료')).toBeTruthy();
    expect(screen.getByText('테스트 할 일 1')).toBeTruthy();
    expect(screen.getByText('테스트 할 일 2')).toBeTruthy();
    const clearBtn = screen.getByRole('button', { name: '완료된 항목 모두 정리' });
    expect(clearBtn).toBeTruthy();
    expect((clearBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it('disables clear completed button when no todos are completed', () => {
    const activeTodos: TodoItem[] = [
      { id: '1', text: '할 일 1', completed: false, createdAt: 1000 }
    ];

    render(
      <TodoCard
        todos={activeTodos}
        onAddTodo={vi.fn()}
        onToggleTodo={vi.fn()}
        onDeleteTodo={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    );

    const clearBtn = screen.getByRole('button', { name: '완료된 항목 모두 정리' }) as HTMLButtonElement;
    expect(clearBtn.disabled).toBe(true);
  });

  it('calls onAddTodo when submitting new todo text', () => {
    const handleAdd = vi.fn();
    render(
      <TodoCard
        todos={mockTodos}
        onAddTodo={handleAdd}
        onToggleTodo={vi.fn()}
        onDeleteTodo={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('새로운 할 일 입력... (Enter로 추가)');
    fireEvent.change(input, { target: { value: '새로운 작업' } });
    fireEvent.submit(input);

    expect(handleAdd).toHaveBeenCalledWith('새로운 작업');
  });

  it('calls onToggleTodo when clicking the label or checkbox', () => {
    const handleToggle = vi.fn();
    render(
      <TodoCard
        todos={mockTodos}
        onAddTodo={vi.fn()}
        onToggleTodo={handleToggle}
        onDeleteTodo={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    );

    const textLabel = screen.getByText('테스트 할 일 1');
    fireEvent.click(textLabel);

    expect(handleToggle).toHaveBeenCalledWith('1');
  });

  it('supports inline editing of todo text', () => {
    const handleUpdate = vi.fn();
    render(
      <TodoCard
        todos={mockTodos}
        onAddTodo={vi.fn()}
        onToggleTodo={vi.fn()}
        onDeleteTodo={vi.fn()}
        onClearCompleted={vi.fn()}
        onUpdateTodo={handleUpdate}
      />
    );

    const editBtns = screen.getAllByRole('button', { name: '수정' });
    fireEvent.click(editBtns[0]);

    const editInput = screen.getByDisplayValue('테스트 할 일 1');
    fireEvent.change(editInput, { target: { value: '수정된 할 일 내용' } });
    fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' });

    expect(handleUpdate).toHaveBeenCalledWith('1', '수정된 할 일 내용');
  });

  it('calls onDeleteTodo when clicking delete button', () => {
    const handleDelete = vi.fn();
    render(
      <TodoCard
        todos={mockTodos}
        onAddTodo={vi.fn()}
        onToggleTodo={vi.fn()}
        onDeleteTodo={handleDelete}
        onClearCompleted={vi.fn()}
      />
    );

    const deleteBtns = screen.getAllByRole('button', { name: '삭제' });
    fireEvent.click(deleteBtns[0]);

    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  it('calls onClearCompleted when clicking clear completed button', () => {
    const handleClear = vi.fn();
    render(
      <TodoCard
        todos={mockTodos}
        onAddTodo={vi.fn()}
        onToggleTodo={vi.fn()}
        onDeleteTodo={vi.fn()}
        onClearCompleted={handleClear}
      />
    );

    const clearBtn = screen.getByRole('button', { name: '완료된 항목 모두 정리' });
    fireEvent.click(clearBtn);

    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when there are no todos', () => {
    render(
      <TodoCard
        todos={[]}
        onAddTodo={vi.fn()}
        onToggleTodo={vi.fn()}
        onDeleteTodo={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    );

    expect(screen.getByText('오늘의 할 일이 모두 완료되었거나 없습니다.')).toBeTruthy();
  });
});
