import { describe, it, expect } from 'vitest';
import { computeTabStats, filterTodosByTab, reorderTabTodos } from './todoHelper';
import { TodoItem, DEFAULT_TODO_TAB_ID } from '../types/todo';

describe('todoHelper', () => {
  const sampleTodos: TodoItem[] = [
    { id: '1', text: '할 일 1', completed: false, createdAt: 1000, tabId: 'default' },
    { id: '2', text: '할 일 2', completed: true, createdAt: 2000, tabId: 'default' },
    { id: '3', text: '할 일 3', completed: true, createdAt: 3000, tabId: 'work' },
    { id: '4', text: '할 일 4', completed: false, createdAt: 4000, tabId: 'work' },
    { id: '5', text: '기본 미지정 할 일', completed: false, createdAt: 5000 } // tabId undefined
  ];

  describe('computeTabStats', () => {
    it('computes total and completed counts correctly for each tab in single pass', () => {
      const stats = computeTabStats(sampleTodos);

      // default tab: id 1, 2, 5 (총 3개 중 1개 완료)
      expect(stats[DEFAULT_TODO_TAB_ID]).toEqual({ total: 3, completed: 1 });
      // work tab: id 3, 4 (총 2개 중 1개 완료)
      expect(stats['work']).toEqual({ total: 2, completed: 1 });
    });

    it('returns empty object when todos list is empty', () => {
      expect(computeTabStats([])).toEqual({});
    });
  });

  describe('filterTodosByTab', () => {
    it('filters todos by tabId including undefined falling back to default', () => {
      const defaultItems = filterTodosByTab(sampleTodos, 'default');
      expect(defaultItems.map((t) => t.id)).toEqual(['1', '2', '5']);

      const workItems = filterTodosByTab(sampleTodos, 'work');
      expect(workItems.map((t) => t.id)).toEqual(['3', '4']);
    });
  });

  describe('reorderTabTodos', () => {
    it('reorders items within the current tab while maintaining other tabs positions', () => {
      // default 탭 내에서 index 0 ('1')을 index 1 ('2' 다음)로 이동
      const reordered = reorderTabTodos(sampleTodos, 'default', 0, 1);

      // default 탭 항목 순서: '2', '1', '5'
      const defaultItems = filterTodosByTab(reordered, 'default');
      expect(defaultItems.map((t) => t.id)).toEqual(['2', '1', '5']);

      // work 탭 항목은 그대로 유지되어야 함
      const workItems = filterTodosByTab(reordered, 'work');
      expect(workItems.map((t) => t.id)).toEqual(['3', '4']);
    });

    it('returns original array when source and target indices are the same or out of bounds', () => {
      expect(reorderTabTodos(sampleTodos, 'default', 0, 0)).toBe(sampleTodos);
      expect(reorderTabTodos(sampleTodos, 'default', -1, 1)).toBe(sampleTodos);
      expect(reorderTabTodos(sampleTodos, 'default', 0, 99)).toBe(sampleTodos);
    });
  });
});
