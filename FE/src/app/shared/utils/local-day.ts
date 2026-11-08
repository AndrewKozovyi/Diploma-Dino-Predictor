export const startOfLocalDay = (date: string, days = 0): Date => {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day + days);
};
