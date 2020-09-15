// convert string of CSS units -- 4in, 200mm, etc. -- to pixels
export const unitsToPixels = (string) => {
  string = string || '';
  // unit constants
  const ppi = 96;
  const units = {
    ch: 8,
    ex: 7.15625,
    em: 16,
    rem: 16,
    in: ppi,
    cm: ppi / 2.54,
    mm: ppi / 25.4,
    pt: ppi / 72,
    pc: ppi / 6,
    px: 1
  };
  // get number
  let value = parseFloat(string) || 0;
  // get unit
  const unit = string.replace(value, '').trim();
  // multiply value by unit constant
  value *= units[unit] || 1;
  return value;
};

// load URI as image object, as an async-await-able function
const urlToImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

// convert svg source code to image object
export const sourceToImage = async (source) => {
  const blob = new Blob([source || ''], { type: 'image/svg+xml' });
  const image = (await urlToImage(URL.createObjectURL(blob))) || null;
  URL.revokeObjectURL(image.src);
  return image;
};

// convert svg source code to dom element
export const sourceToSvg = (source) => {
  const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  const error = doc.querySelector('parsererror');
  if (error)
    throw new Error(error.textContent);
  if (svg)
    return svg;
  throw new Error('unknown error');
};
