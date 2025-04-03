/**
 * Creates a blank canvas of the given color and dimensions
 * @param width width of the image
 * @param height height of the image
 * @param color color of the image
 * @returns A blank canvas of the given color
 */
const createImage = (width: number, height: number, color = "white") => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
};

export default createImage;
