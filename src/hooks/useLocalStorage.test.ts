import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage 훅 단위 테스트 (TDD Seam)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('저장된 값이 없을 때 기본값을 정상 반환해야 한다', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial_value'));
    expect(result.current[0]).toBe('initial_value');
  });

  it('값을 업데이트하면 상태와 localStorage가 모두 동기화되어야 한다', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial_value'));

    act(() => {
      result.current[1]('updated_value');
    });

    expect(result.current[0]).toBe('updated_value');
    expect(JSON.parse(localStorage.getItem('test_key') || '""')).toBe('updated_value');
  });

  it('객체 형태의 데이터도 올바르게 직렬화/역직렬화되어야 한다', () => {
    const defaultObj = { name: '일산', count: 10 };
    const { result } = renderHook(() => useLocalStorage('test_obj', defaultObj));

    act(() => {
      result.current[1]({ name: '강남', count: 20 });
    });

    expect(result.current[0]).toEqual({ name: '강남', count: 20 });
    expect(JSON.parse(localStorage.getItem('test_obj') || '{}')).toEqual({ name: '강남', count: 20 });
  });

  it('기존 저장된 객체에 새로운 설정 키가 누락되어 있을 때 initialValue 기본값을 자동 병합 및 주입해야 한다', () => {
    // 기존 스토리지에는 theme 속성이 없는 구버전 설정이 저장되어 있음
    localStorage.setItem('saniti_settings_test', JSON.stringify({ openInNewTab: true, showClock: false }));

    const defaultSettings = {
      theme: 'system',
      openInNewTab: false,
      showClock: true,
      clockFormat: '24h'
    };

    const { result } = renderHook(() => useLocalStorage('saniti_settings_test', defaultSettings));

    // initialValue의 기본값(theme: 'system', clockFormat: '24h')과 저장된 값(openInNewTab: true, showClock: false)이 자동 병합되어야 함
    expect(result.current[0]).toEqual({
      theme: 'system',
      openInNewTab: true,
      showClock: false,
      clockFormat: '24h'
    });
  });
});
