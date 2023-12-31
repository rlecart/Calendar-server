export const isEmpty = (obj: any) => {
  if ((!obj && typeof obj !== 'number') ||
    (typeof obj === 'object' && Object.keys(obj).length === 0))
    return (true);
  else
    return (false);
};

export const realerIsNaN = (value: number) => {
  if (typeof value !== 'number')
    return (true);
  else
    return (false);
};

export const generateId = () => {
  return (Math.random().toString(36).substring(2));
};

export const objLen = (obj: object) => {
  return (Object.keys(obj).length);
};