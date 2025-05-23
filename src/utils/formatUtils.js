/**
 * 숫자에 0을 채워서 문자열로 변환하는 함수
 */
export const zeroPad = (num, places) => {
  return String(num).padStart(places, '0');
};
