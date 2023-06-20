export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getLogarithmicRandomNumber = (
  min: number,
  max: number
): number => {
  const rand = Math.random();
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const logRand = logMin + (logMax - logMin) * rand;
  return Math.round(Math.exp(logRand));
};
