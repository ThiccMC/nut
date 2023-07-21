export function joinu8a(...arrays: Uint8Array[]) {
  let length = arrays.reduce((acc, arr) => acc + arr.length, 0);
  let mergedArray = new Uint8Array(length);
  let offset = 0;
  arrays.forEach((arr) => {
    mergedArray.set(arr, offset);
    offset += arr.length;
  });
  return mergedArray.buffer;
}

export function trimStartPad(d: string) {
  var i = 0;
  while (d[i] == "\u0000" && i < d.length) i++;
  return d.slice(i);
}
