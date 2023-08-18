export function isNumber(n: number | string | undefined) {
  return typeof n == "number" && !isNaN(n) && isFinite(n);
}
