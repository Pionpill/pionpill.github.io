export const throttle = (func: Function, delay: number) => {
  let timeId: number;
  let lastExeTime = 0;
  return function (this: any, ...args: any[]) {
    const now = Date.now();
    const interTime = now - lastExeTime;
    if (interTime >= delay) {
      func.apply(this, args);
      lastExeTime = now;
    } else {
      clearTimeout(timeId);
      timeId = setTimeout(() => {
        func.apply(this, args);
        lastExeTime = Date.now();
      }, delay);
    }
  };
};
