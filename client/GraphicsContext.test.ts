import {GCEnum, extractComponentNamesFromGraphicsContextBitMask} from "./GraphicsContext";

describe(extractComponentNamesFromGraphicsContextBitMask, () => {
  test('Extracts a Function component', () => {
    expect(extractComponentNamesFromGraphicsContextBitMask(GCEnum.Function)).toEqual(['Function']);
  });

  test('Extracts a PlaneMask component', () => {
    expect(extractComponentNamesFromGraphicsContextBitMask(GCEnum.PlaneMask)).toEqual(['PlaneMask']);
  });

  test('Extracts a Foreground component', () => {
    expect(extractComponentNamesFromGraphicsContextBitMask(GCEnum.Foreground)).toEqual(['Foreground']);
  })

  test('Extacts two components from one bitMask', () => {
    expect(extractComponentNamesFromGraphicsContextBitMask(GCEnum.Function | GCEnum.PlaneMask)).toEqual(['Function', 'PlaneMask']);
  });
});

