import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinksHub } from './LinksHub';
import { BookmarkLink } from '../data/presetLinks';

describe('LinksHub Component', () => {
  const mockLinks: BookmarkLink[] = [
    { id: '1', title: 'GitHub', url: 'https://github.com', tags: ['개발', 'Git'] },
    { id: '2', title: 'YouTube', url: 'https://youtube.com', tags: ['미디어'] },
    { id: '3', title: 'Naver', url: 'https://naver.com', tags: ['포털'] }
  ];

  it('renders tag cloud bar with all unique tags and counts', () => {
    render(
      <LinksHub
        links={mockLinks}
        onAddLink={vi.fn()}
        onUpdateLink={vi.fn()}
        onDeleteLink={vi.fn()}
        onReorderLinks={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /전체/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /#개발/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /#Git/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /#미디어/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /#포털/ })).toBeTruthy();
  });

  it('filters links when clicking a tag pill in the tag cloud', () => {
    render(
      <LinksHub
        links={mockLinks}
        onAddLink={vi.fn()}
        onUpdateLink={vi.fn()}
        onDeleteLink={vi.fn()}
        onReorderLinks={vi.fn()}
      />
    );

    const devTagBtn = screen.getByRole('button', { name: /#개발/ });
    fireEvent.click(devTagBtn);

    // GitHub should be visible, YouTube and Naver should be filtered out
    expect(screen.getByText('GitHub')).toBeTruthy();
    expect(screen.queryByText('YouTube')).toBeNull();
    expect(screen.queryByText('Naver')).toBeNull();

    // Clicking '전체' resets the filter
    const allTagBtn = screen.getByRole('button', { name: /전체/ });
    fireEvent.click(allTagBtn);

    expect(screen.getByText('GitHub')).toBeTruthy();
    expect(screen.getByText('YouTube')).toBeTruthy();
    expect(screen.getByText('Naver')).toBeTruthy();
  });

  it('shows more toggle button when tags exceed limit and expands on click', () => {
    // Generate 20 distinct tags
    const manyTags = Array.from({ length: 20 }, (_, i) => `태그${i + 1}`);
    const linksWithManyTags: BookmarkLink[] = [
      { id: '1', title: 'Test', url: 'https://test.com', tags: manyTags }
    ];

    render(
      <LinksHub
        links={linksWithManyTags}
        onAddLink={vi.fn()}
        onUpdateLink={vi.fn()}
        onDeleteLink={vi.fn()}
        onReorderLinks={vi.fn()}
      />
    );

    const moreBtn = screen.getByRole('button', { name: /더보기/ });
    expect(moreBtn).toBeTruthy();

    fireEvent.click(moreBtn);

    const collapseBtn = screen.getByRole('button', { name: /접기/ });
    expect(collapseBtn).toBeTruthy();
  });
});
