import { useState, useEffect, useRef } from 'react';

/**
 * 로컬스토리지 및 크롬 확장 스토리지와 React 상태를 안전하게 동기화하는 커스텀 훅
 * @param key 스토리지 키
 * @param initialValue 초기 기본값
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item) {
          return JSON.parse(item) as T;
        }
      }
      return initialValue;
    } catch (error) {
      console.warn(`로컬스토리지 읽기 실패 ("${key}"):`, error);
      return initialValue;
    }
  });

  // 크롬 스토리지 비동기 하이드레이션(초기 로딩) 완료 여부 플래그
  const isHydratedRef = useRef<boolean>(
    typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local
  );

  // 1. chrome.storage.local 초기 데이터 조회 및 동기화 (최우선 복원)
  useEffect(() => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([key], (result: { [k: string]: any }) => {
          if (result && result[key] !== undefined) {
            // 크롬 스토리지에 데이터가 있으면 최신 데이터로 상태 및 localStorage 복원
            setStoredValue(result[key] as T);
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.setItem(key, JSON.stringify(result[key]));
            }
          } else {
            // 크롬 스토리지가 완전히 비어있을 경우에만 현재 초기값 저장
            chrome.storage.local.set({ [key]: storedValue });
          }
          isHydratedRef.current = true;
        });

        // 2. 크롬 툴바 팝업 등 외부에서 데이터가 추가/수정될 때 실시간 동기화 리스너
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
          if (areaName === 'local' && changes[key] && changes[key].newValue !== undefined) {
            setStoredValue(changes[key].newValue as T);
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.setItem(key, JSON.stringify(changes[key].newValue));
            }
          }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => {
          chrome.storage.onChanged.removeListener(handleStorageChange);
        };
      }
    } catch (err) {
      console.warn(`크롬 스토리지 연동 예외 ("${key}"):`, err);
      isHydratedRef.current = true;
    }
  }, [key]);

  // 3. 사용자의 명시적 상태 변경 시에만 localStorage 및 chrome.storage.local에 저장 (덮어쓰기 방어)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
      // 크롬 스토리지 로딩이 끝난 이후(isHydratedRef = true)에만 set 실행하여 덮어쓰기 방어
      if (
        isHydratedRef.current &&
        typeof chrome !== 'undefined' &&
        chrome.storage &&
        chrome.storage.local
      ) {
        chrome.storage.local.set({ [key]: storedValue });
      }
    } catch (error) {
      console.warn(`스토리지 저장 실패 ("${key}"):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
