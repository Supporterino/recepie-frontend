function moveInArray<T>(array: T[], index: number, up: boolean): T[] {
    const start = array.slice(0, index);
    const end = array.slice(index, array.length);
    const element = end.shift()!;
    const mid: T[] = [];
    if (up) {
        const temp = start.pop();
        mid.push(element);
        if (temp) mid.push(temp);
    } else {
        const temp = end.shift();
        if (temp) mid.push(temp);
        mid.push(element);
    }
    return start.concat(mid).concat(end);
}

export { moveInArray };
