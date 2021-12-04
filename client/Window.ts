export default interface Window {
  parentWindowId: number,
  visualId: number,
  x: number,
  y: number,
  width: number,
  height: number,
  borderWidth: number,
  windowAttributes: { [component in WindowAttributeComponentName]?: number},
}

export type WindowCollection = { [windowId: number]: Window };

export enum WindowAttributeEnum {
  BackgroundPixmap   = 0x00000001,
  BackgroundPixel    = 0x00000002,
  BorderPixmap       = 0x00000004,
  BorderPixel        = 0x00000008,
  BitGravity         = 0x00000010,
  WinGravity         = 0x00000020,
  BackingStore       = 0x00000040,
  BackingPlanes      = 0x00000080,
  BackingPixel       = 0x00000100,
  OverrideRedirect   = 0x00000200,
  SaveUnder          = 0x00000400,
  EventMask          = 0x00000800,
  DoNotPropagateMask = 0x00001000,
  ColorMap           = 0x00002000,
  Cursor             = 0x00004000,
}
type WindowAttributeComponentName = keyof typeof WindowAttributeEnum;

export function extractComponentNamesFromWindowAttributeBitMask(number: number) {
  const componentNames = Object.keys(WindowAttributeEnum).filter(key => !isNaN(Number(WindowAttributeEnum[key]))) as WindowAttributeComponentName[];
  return componentNames.filter(component => {
    const mask = WindowAttributeEnum[component];
    return (number & mask) == mask;
  });
}
