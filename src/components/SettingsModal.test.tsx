import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from './SettingsModal';
import { DEFAULT_SETTINGS, DashboardSettings } from '../types/settings';
import { PRESET_LINKS } from '../data/presetLinks';

describe('SettingsModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    links: PRESET_LINKS,
    onImportLinks: vi.fn(),
    onResetLinks: vi.fn(),
    settings: DEFAULT_SETTINGS,
    onUpdateSettings: vi.fn()
  };

  it('renders general settings and theme options', () => {
    render(<SettingsModal {...defaultProps} />);

    expect(screen.getByText('대시보드 설정')).toBeTruthy();
    expect(screen.getByText('테마 모드')).toBeTruthy();
    expect(screen.getByText('시스템')).toBeTruthy();
    expect(screen.getByText('라이트')).toBeTruthy();
    expect(screen.getByText('다크')).toBeTruthy();
  });

  it('calls onUpdateSettings when clicking dark theme option', () => {
    const handleUpdate = vi.fn();
    render(<SettingsModal {...defaultProps} onUpdateSettings={handleUpdate} />);

    const darkBtn = screen.getByText('다크');
    fireEvent.click(darkBtn);

    expect(handleUpdate).toHaveBeenCalledWith({
      ...DEFAULT_SETTINGS,
      theme: 'dark'
    });
  });

  it('calls onUpdateSettings when clicking light theme option', () => {
    const handleUpdate = vi.fn();
    const darkSettings: DashboardSettings = { ...DEFAULT_SETTINGS, theme: 'dark' };
    render(<SettingsModal {...defaultProps} settings={darkSettings} onUpdateSettings={handleUpdate} />);

    const lightBtn = screen.getByText('라이트');
    fireEvent.click(lightBtn);

    expect(handleUpdate).toHaveBeenCalledWith({
      ...darkSettings,
      theme: 'light'
    });
  });
});
