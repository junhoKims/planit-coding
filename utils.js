/**
 * LocalStorage Key와 데이터 모델(객체)를 받아 스토리지에 존재하는 값을 파싱하여 리턴
 * 
 * 스토리지에 값이 없다면 model 배열 리턴
 */
export function loadDataFromStorage(storageKey, model) {
  try {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      return JSON.parse(savedData);
    } else {
      const data = [...model];
      saveDataToStorage(storageKey, data);
      return data;
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    return [...model];
  }
}

/**
 * 데이터를 받아 로컬스토리지에 저장하는 유틸 함수
 */
export function saveDataToStorage(storageKey, data) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error("데이터 저장 실패:", error);
  }
}

/**
 * UUID 생성 유틸 함수
 */
export function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
