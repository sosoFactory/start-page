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

    const input = screen.getByPlaceholderText(/할 일/);
    fireEvent.change(input, { target: { value: '새로운 작업' } });
    fireEvent.submit(input);

    expect(handleAdd).toHaveBeenCalledWith('새로운 작업', 'default');
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

    expect(handleClear).toHaveBeenCalledWith('default');
  });

  it('supports multiple tabs, tab switching, and moving todos between tabs', () => {
    const customTabs = [
      { id: 'default', name: '기본', createdAt: 0 },
      { id: 'work', name: '업무', createdAt: 1000 }
    ];

    const tabTodos: TodoItem[] = [
      { id: '1', text: '기본 할 일', completed: false, createdAt: 1000, tabId: 'default' },
      { id: '2', text: '업무 할 일', completed: false, createdAt: 2000, tabId: 'work' }
    ];

    const handleSelectTab = vi.fn();
    const handleMoveTodoTab = vi.fn();

    const { rerender } = render(
      <TodoCard
        todos={tabTodos}
        tabs={customTabs}
        activeTabId="default"
        onSelectTab={handleSelectTab}
        onMoveTodoTab={handleMoveTodoTab}
        onAddTodo={vi.fn()}
        onToggleTodo={vi.fn()}
        onDeleteTodo={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    );

    // 기본 탭에는 '기본 할 일'만 보여야 함
    expect(screen.getByText('기본 할 일')).toBeTruthy();
    expect(screen.queryByText('업무 할 일')).toBeNull();

    // '업무' 탭 버튼 클릭 시 onSelectTab 호출
    const workTabBtn = screen.getByRole('button', { name: /업무/ });
    fireEvent.click(workTabBtn);
    expect(handleSelectTab).toHaveBeenCalledWith('work');

    // 활성 탭이 'work'로 변경되었을 때 리렌더링
    rerender(
      <TodoCard
        todos={tabTodos}
        tabs={customTabs}
        activeTabId="work"
        onSelectTab={handleSelectTab}
        onMoveTodoTab={handleMoveTodoTab}
        onAddTodo={vi.fn()}
        onToggleTodo={vi.fn()}
        onDeleteTodo={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    );

    expect(screen.getByText('업무 할 일')).toBeTruthy();
    expect(screen.queryByText('기본 할 일')).toBeNull();

    // 다른 탭으로 이동 버튼 클릭 및 탭 이동 테스트
    const moveBtn = screen.getByRole('button', { name: '다른 탭으로 이동' });
    fireEvent.click(moveBtn);

    const moveTargetBtn = screen.getByRole('button', { name: '기본' });
    fireEvent.click(moveTargetBtn);

    expect(handleMoveTodoTab).toHaveBeenCalledWith('2', 'default');
  });

  it('supports adding a new tab', () => {
    const handleAddTab = vi.fn();
    render(
      <TodoCard
        todos={mockTodos}
        onAddTab={handleAddTab}
        onAddTodo={vi.fn()}
        onToggleTodo={vi.fn()}
        onDeleteTodo={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    );

    const addTabBtn = screen.getByRole('button', { name: '새 탭 추가' });
    fireEvent.click(addTabBtn);

    const tabInput = screen.getByPlaceholderText('새 탭 이름');
    fireEvent.change(tabInput, { target: { value: '프로젝트' } });
    fireEvent.keyDown(tabInput, { key: 'Enter', code: 'Enter' });

    expect(handleAddTab).toHaveBeenCalledWith('프로젝트');
  });
});
