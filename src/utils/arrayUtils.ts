const moveInArray = function<T> (array: T[], index: number, up: boolean): T[] {
  const start = array.slice(0, index);
  const end = array.slice(index, array.length);
  const element = end.shift();
  if (!element) {
    throw new Error('Array to short');
  }

  const mid: T[] = [];
  if (up) {
    const temporary = start.pop();
    mid.push(element);
    if (temporary) {
      mid.push(temporary);
    }
  } else {
    const temporary = end.shift();
    if (temporary) {
      mid.push(temporary);
    }

    mid.push(element);
  }

  return start.concat(mid).concat(end);
};

export {
  moveInArray,
};
