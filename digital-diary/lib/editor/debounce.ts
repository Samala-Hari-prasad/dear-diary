export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): {
  (...args: Parameters<T>): void;
  cancel(): void;
} {
  let timeoutId: any = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}
