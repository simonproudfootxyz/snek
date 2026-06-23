const MODULUS = 2 ** 31 - 1;
const MULTIPLIER = 48271;

export function normalizeSeed(seed: number): number {
  const value = Math.floor(seed) % MODULUS;
  return value <= 0 ? value + MODULUS - 1 : value;
}

export function nextSeed(seed: number): number {
  return (normalizeSeed(seed) * MULTIPLIER) % MODULUS;
}

export function randomInt(seed: number, maxExclusive: number): [number, number] {
  if (maxExclusive <= 0) {
    return [0, seed];
  }

  const newSeed = nextSeed(seed);
  const value = newSeed % maxExclusive;
  return [value, newSeed];
}
