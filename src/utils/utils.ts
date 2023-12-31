const isEmpty = (obj) => {
  if ((!obj && typeof obj !== 'number') ||
    (typeof obj === 'object' && Object.keys(obj).length === 0))
    return (true);
  else
    return (false);
};

const realerIsNaN = (value) => {
  if (typeof value !== 'number')
    return (true);
  else
    return (false);
};

const generateId = () => {
  return (Math.random().toString(36).substring(2));
};

const objLen = (obj) => {
  return (Object.keys(obj).length);
};

module.exports = {
  isEmpty,
  realerIsNaN,
  generateId,
  objLen,
};