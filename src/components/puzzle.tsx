import { useContext, useEffect, useRef, useState } from "react"
import { VariantContext } from "../contexts"
import { Boxes, Coordinate, Variant } from "../types";


export default function Puzzle() {

  const variant = useContext(VariantContext);

  const length = variant === Variant.X8 ? 8 : 15;

  const distVals: number[] = Array.from({ length }, (_, i) => i + 1);
  const distCoordinates = Array.from({ length: Math.ceil(Math.sqrt(length)) }, (_, y) =>
    Array.from({ length: Math.ceil(Math.sqrt(length)) }, (_, x) => ({ x, y }))
  );
  
  const boxes = useRef({} as Boxes);
  
  const emptyBox = useRef({ ...distCoordinates[0][0] });
  
  useEffect(() => {
    emptyBox.current = { ...distCoordinates[0][0] };
  }, [distCoordinates]);

  return (
    <div className='h-[80vh] mt-8 mx-auto aspect-square relative bg-blue-300 rounded-lg'>
      {
        Array.from({ length }).map((_, i) => {
          const distCoord = distCoordinates;
          const value = Number(distVals.splice(Math.floor(Math.random() * distVals.length), 1)[0]);

          const row = Math.floor(Math.random() * distCoord.length);
          const coordinate = distCoord[row].splice(
            Math.floor(Math.random() * distCoord[row].length), 1
          )[0];

          if (!distCoord[row].length) distCoord.splice(row, 1);

          return (
            <Box key={i} boxes={boxes} value={value} emptyBox={emptyBox} coordinate={{ x: coordinate.x, y: coordinate.y }} />
          )
        })
      }
    </div>
  )
}

function Box({ value, coordinate, boxes, emptyBox }: { value: number, coordinate: Coordinate, boxes: React.RefObject<Boxes>, emptyBox: React.RefObject<Coordinate> }) {
  const variant = useContext(VariantContext);

  const divisions = variant === Variant.X8 ? 3 : 4;

  const [coord, setCoord] = useState(coordinate);
  const prevCoord = useRef(emptyBox.current);

  useEffect(() => {
    boxes.current[value] = {
      coordinate,
      swap() {

      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCoord(coordinate);
  }, [coordinate]);

  useEffect(() => {
    emptyBox.current = { ...prevCoord.current };
    if(boxes.current[value]) {
      boxes.current[value].coordinate = coord;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      checkWin(boxes.current) && alert('You win!');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord, value]);


  const onClick = () => {
    const emptyCoordinate = emptyBox.current;

    if (coord.x === emptyCoordinate.x && Math.abs(coord.y - emptyCoordinate.y) === 1) {
      setCoord(state => {
        const newState = {
          ...emptyCoordinate
        };
        prevCoord.current = { ...state };
        return newState
      });
    } else if (coord.y === emptyCoordinate.y && Math.abs(coord.x - emptyCoordinate.x) === 1) {
      setCoord(state => {
        const newState = {
          ...emptyCoordinate
        };
        prevCoord.current = { ...state };
        return newState
      });
    }
  };

  return (
    <div onClick={onClick} className='bg-blue-500 absolute transition-all  rounded-lg text-white/70 font-mono text-5xl grid place-items-center' style={{
      width: `calc(${100 / divisions}% - ${5 * divisions}px)`,
      height: `calc(${100 / divisions}% - ${5 * divisions}px)`,
      top: `calc(${100 / divisions * coord.y}% + ${30 + 5 * coord.y}px)`,
      left: `calc(${100 / divisions * coord.x}% + ${30 + 5 * coord.x}px)`
    }}>{value}</div>
  )
}

function checkWin(boxes: Boxes) {
  const divs = Math.ceil(Math.sqrt(Object.keys(boxes).length));
  return Object.entries(boxes).every(([key, { coordinate }]) => {
    return Number(key) === coordinate.x + coordinate.y * divs + 1;
  });
}