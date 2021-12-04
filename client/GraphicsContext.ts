export enum GCEnum {
  Function      = 0x00000001,
  PlaneMask     = 0x00000002,
  Foreground    = 0x00000004,
  Background    = 0x00000008,
  LineWidth     = 0x00000010,
  LineStyle     = 0x00000020,
  CapStyle      = 0x00000040,
  JoinStyle     = 0x00000080,
  FillStyle     = 0x00000100,
  FillRule      = 0x00000200,
  Tile          = 0x00000400,
  Stipple       = 0x00000800,
  TileStippleXOrigin = 0x00001000,
  TileStippleYOrigin = 0x00002000,
  Font          = 0x00004000,
  SubwindowMode = 0x00008000,
  GraphicsExposures = 0x00010000,
  ClipXOrigin   = 0x00020000,
  ClipYOrigin   = 0x00040000,
  ClipMask      = 0x00080000,
  DashOffset    = 0x00100000,
  Dashes        = 0x00200000,
  ArcMode       = 0x00400000,
}

export default interface GraphicsContext {
  drawableId: number,
  values: { [component in GraphicsContextComponentName]?: number},
}

type GraphicsContextComponentName = keyof typeof GCEnum;
export type GraphicsContextCollection = { [graphicsContextId: number]: GraphicsContext };

export function extractComponentNamesFromGraphicsContextBitMask(number: number) {
  const componentNames = Object.keys(GCEnum).filter(key => !isNaN(Number(GCEnum[key]))) as GraphicsContextComponentName[];
  return componentNames.filter(component => {
    const mask = GCEnum[component];
    return (number & mask) == mask;
  });
}
