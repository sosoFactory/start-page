import { TodoItem, DEFAULT_TODO_TAB_ID } from '../types/todo';

export interface TabStats {
  total: number;
  completed: number;
}

/**
 * 전체 할 일 목록을 단 1회 순회하여 탭별 통계(전체 개수, 완료 개수)를 계산합니다.
 * @param todos 전체 할 일 목록
 * @returns 탭 ID를 키로 하는 통계 맵
 */
export const computeTabStats = (todos: TodoItem[]): Record<string, TabStats> => {
  const stats: Record<string, TabStats> = {};

  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const tabId = item.tabId || DEFAULT_TODO_TAB_ID;

    if (!stats[tabId]) {
      stats[tabId] = { total: 0, completed: 0 };
    }

    stats[tabId].total++;
    if (item.completed) {
      stats[tabId].completed++;
    }
  }

  return stats;
};

/**
 * 특정 탭에 속한 할 일 목록만 필터링합니다.
 * @param todos 전체 할 일 목록
 * @param tabId 탭 ID
 * @returns 해당 탭에 속한 할 일 배열
 */
export const filterTodosByTab = (todos: TodoItem[], tabId: string): TodoItem[] => {
  const targetId = tabId || DEFAULT_TODO_TAB_ID;
  return todos.filter((t) => (t.tabId || DEFAULT_TODO_TAB_ID) === targetId);
};

/**
 * 특정 탭 내에서 드래그 앤 드롭으로 순서가 변경되었을 때,
 * 전체 todos 목록에서 해당 탭 항목들의 순서를 안전하게 교체 재배치합니다.
 * @param todos 전체 할 일 목록
 * @param currentTabId 현재 활성 탭 ID
 * @param sourceIndex 이동 시작 인덱스 (현재 탭 기준)
 * @param targetIndex 이동 대상 인덱스 (현재 탭 기준)
 * @returns 순서가 재배치된 새로운 TodoItem 배열
 */
export const reorderTabTodos = (
  todos: TodoItem[],
  currentTabId: string,
  sourceIndex: number,
  targetIndex: number
): TodoItem[] => {
  if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) {
    return todos;
  }

  const targetId = currentTabId || DEFAULT_TODO_TAB_ID;
  const currentTabItems = filterTodosByTab(todos, targetId);

  if (sourceIndex >= currentTabItems.length || targetIndex >= currentTabItems.length) {
    return todos;
  }

  // 탭 내 순서 변경
  const reorderedTabItems = [...currentTabItems];
  const [draggedItem] = reorderedTabItems.splice(sourceIndex, 1);
  reorderedTabItems.splice(targetIndex, 0, draggedItem);

  // 전체 배열에서 현재 탭 항목의 슬롯을 reorderedTabItems 순서대로 순차 교체
  let tabSlotIndex = 0;
  return todos.map((item) => {
    const itemTabId = item.tabId || DEFAULT_TODO_TAB_ID;
    if (itemTabId === targetId) {
      const replacement = reorderedTabItems[tabSlotIndex];
      tabSlotIndex++;
      return replacement;
    }
    return item;
  });
};
