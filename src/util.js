export const unitsToPixels = (string) => {
  string = string || '';
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
  let value = parseFloat(string) || 0;
  const unit = string.replace(value, '').trim();
  value *= units[unit] || 1;
  return value;
};

const urlToImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

export const sourceToImage = async (source) => {
  try {
    const blob = new Blob([source || ''], { type: 'image/svg+xml' });
    const image = (await urlToImage(URL.createObjectURL(blob))) || null;
    URL.revokeObjectURL(image.src);
    return image;
  } catch (error) {
    return null;
  }
};

export const sourceToSvg = (source) =>
  new DOMParser()
    .parseFromString(source, 'image/svg+xml')
    ?.querySelector('svg') || null;
