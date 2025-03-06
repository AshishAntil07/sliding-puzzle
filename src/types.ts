export enum Variant {
  "X8",
  "X15"
}

export type Coordinate = {
  x: number,
  y: number
}

export type Boxes = {
  [key: string]: {
    coordinate: Coordinate;
    swap: () => void
  }
}