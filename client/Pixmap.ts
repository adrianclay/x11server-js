export default interface Pixmap {
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
}

export type PixmapCollection = { [pixmapId: number]: Pixmap };
