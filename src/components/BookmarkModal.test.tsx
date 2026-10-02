import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkModal } from './BookmarkModal';

describe('BookmarkModal', () => {
  it('renders correctly for adding a new bookmark', () => {
    render(
      <BookmarkModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        existingTags={['개발', 'AI']}
      />
    );

    expect(screen.getByText('새 바로가기 추가')).toBeTruthy();
    expect(screen.getByPlaceholderText('예: naver.com, https://github.com')).toBeTruthy();
  });

  it('automatically suggests tags when typing URL', () => {
    render(
      <BookmarkModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        existingTags={['개발', 'AI']}
      />
    );

    const urlInput = screen.getByPlaceholderText('예: naver.com, https://github.com');
    fireEvent.change(urlInput, { target: { value: 'https://github.com' } });

    // '개발' tag should be auto-populated or suggested
    expect(screen.getByText('#개발')).toBeTruthy();
  });

  it('allows manual tag addition and removal', () => {
    const handleSave = vi.fn();
    render(
      <BookmarkModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={handleSave}
        existingTags={[]}
      />
    );

    const urlInput = screen.getByPlaceholderText('예: naver.com, https://github.com');
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    const tagInput = screen.getByPlaceholderText('태그 입력... (Enter 또는 쉼표)');
    fireEvent.change(tagInput, { target: { value: '테스트태그' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('#테스트태그')).toBeTruthy();

    const submitBtn = screen.getByRole('button', { name: '추가하기' });
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'example.com',
        url: 'https://example.com',
        tags: ['테스트태그']
      })
    );
  });

  it('normalizes tags automatically on input (e.g. git -> Git, ai -> AI)', () => {
    const handleSave = vi.fn();
    render(
      <BookmarkModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={handleSave}
        existingTags={[]}
      />
    );

    const urlInput = screen.getByPlaceholderText('예: naver.com, https://github.com');
    fireEvent.change(urlInput, { target: { value: 'https://github.com' } });

    const tagInput = screen.getByPlaceholderText(/태그/);
    fireEvent.change(tagInput, { target: { value: 'git' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('#Git')).toBeTruthy();

    fireEvent.change(tagInput, { target: { value: 'ai' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('#AI')).toBeTruthy();

    const submitBtn = screen.getByRole('button', { name: '추가하기' });
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: expect.arrayContaining(['Git', 'AI'])
      })
    );
  });
});
