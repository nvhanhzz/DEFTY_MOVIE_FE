export const standardization = (inp: string) => { // convert yyyy-MM-dd to dd/MM/yyyy
    const arr: string[] = inp.split("-");
    const y = arr[0], m = arr[1], d = arr[2];
    return `${d}/${m}/${y}`;
}