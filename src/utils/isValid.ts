import { Boxes, Variant } from "../types";


export default function isValid(boxes: Boxes, variant: Variant) {
  if (variant === Variant.X8) {
    const matrix: (number | null)[][] = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));

    for (const value in boxes) {
      const box = boxes[value];
      matrix[box.coordinate.y][box.coordinate.x] = Number(value);
    }

    let inversions = 0;
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === null) return;
        for (let j = x + 1; j < 3; j++) {
          if (matrix[y][j] === null) continue;
          if (matrix[y][j]! < value) inversions++;
        }
      });
    });

    return inversions % 2 === 0;
  }

  const matrix: (number | null)[][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));

  for (const value in boxes) {
    const box = boxes[value];
    matrix[box.coordinate.y][box.coordinate.x] = Number(value);
  }

  let inversions = 0;
  let emptyBoxRow: number | null = null;
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === null) {
        emptyBoxRow = y;

        return;
      };
      for (let j = x + 1; j < 4; j++) {
        if (matrix[y][j] === null) continue;
        if (matrix[y][j]! < value) inversions++;
      }
    });
  });

  return (inversions + 4 - emptyBoxRow!) % 2 === 1;
}