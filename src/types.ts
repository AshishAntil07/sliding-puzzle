export enum Variant {
  "X8",
  "X15"
}

export interface Coordinate {
  x: number,
  y: number
}

export interface Boxes {
  [key: string]: {
    coordinate: Coordinate;
    swap: () => void
  }
}

export type LS = {
  x8: {
    record: number
  },
  x15: {
    record: number
  }
}