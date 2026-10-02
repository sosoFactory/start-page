export interface TodoTab {
  id: string;
  name: string;
  createdAt: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  tabId?: string;
}

export const DEFAULT_TODO_TAB_ID = 'default';

export const DEFAULT_TODO_TABS: TodoTab[] = [
  {
    id: DEFAULT_TODO_TAB_ID,
    name: '기본',
    createdAt: 0
  }
];
