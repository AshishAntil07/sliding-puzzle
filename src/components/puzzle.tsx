/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react"
import { VariantContext } from "../contexts"
import { Boxes, Coordinate, LS, Variant } from "../types";
import WinDialog from "./winDialog";


export default function Puzzle() {

  const variant = useContext(VariantContext);

  const length = variant === Variant.X8 ? 8 : 15;

  const [win, setWin] = useState(false);
  const totalMoves = useRef(0);
  const ls: React.RefObject<LS> = useRef(JSON.parse(localStorage.getItem("sliding-puzzle") || '{"x15":{"record":"Infinity"},"x8":{"record":"Infinity"}}'));

  const distVals: number[] = Array.from({ length }, (_, i) => i + 1);
  const distCoordinates = Array.from({ length: Math.ceil(Math.sqrt(length)) }, (_, y) =>
    Array.from({ length: Math.ceil(Math.sqrt(length)) }, (_, x) => ({ x, y }))
  );
  
  const boxes = useRef({} as Boxes);
  
  const emptyBox = useRef({ ...distCoordinates[0][0] });
  
  useEffect(() => {
    emptyBox.current = { ...distCoordinates[0][0] };
  }, [distCoordinates]);

  useEffect(() => {
    const handleSwap = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        const coordinate = {
          x: emptyBox.current.x,
          y: emptyBox.current.y + 1
        };
        for(const value in boxes.current) {
          if(boxes.current[value].coordinate.x === coordinate.x && boxes.current[value].coordinate.y === coordinate.y) {
            boxes.current[value].swap();
            break;
          }
        }
      } else if (e.key === 'ArrowDown') {
        const coordinate = {
          x: emptyBox.current.x,
          y: emptyBox.current.y - 1
        };
        for(const value in boxes.current) {
          if(boxes.current[value].coordinate.x === coordinate.x && boxes.current[value].coordinate.y === coordinate.y) {
            boxes.current[value].swap();
            break;
          }
        }
      } else if (e.key === 'ArrowLeft') {
        const coordinate = {
          x: emptyBox.current.x + 1,
          y: emptyBox.current.y
        };
        for(const value in boxes.current) {
          if(boxes.current[value].coordinate.x === coordinate.x && boxes.current[value].coordinate.y === coordinate.y) {
            boxes.current[value].swap();
            break;
          }
        }
      } else if (e.key === 'ArrowRight') {
        const coordinate = {
          x: emptyBox.current.x - 1,
          y: emptyBox.current.y
        };
        for(const value in boxes.current) {
          if(boxes.current[value].coordinate.x === coordinate.x && boxes.current[value].coordinate.y === coordinate.y) {
            boxes.current[value].swap();
            break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleSwap);

    return () => {
      document.removeEventListener('keydown', handleSwap);
    }
  }, []);

  return (
    <div className='h-[80vh] aspect-square relative bg-blue-300 rounded-lg'>
      {
        !win ? Array.from({ length }).map((_, i) => {
          const distCoord = distCoordinates;
          const value = Number(distVals.splice(Math.floor(Math.random() * distVals.length), 1)[0]);

          const row = Math.floor(Math.random() * distCoord.length);
          const coordinate = distCoord[row].splice(
            Math.floor(Math.random() * distCoord[row].length), 1
          )[0];
          
          if (!distCoord[row].length) distCoord.splice(row, 1);
          
          return (
            <Box key={i} boxes={boxes} local={ls} setWin={setWin} moves={totalMoves} value={value} emptyBox={emptyBox} coordinate={{ x: coordinate.x, y: coordinate.y }} />
          )
        }) : null
      }

      <WinDialog display={win} moves={totalMoves} local={ls} onClose={() => {
        setWin(false);
      }} />
    </div>
  )
}

function Box({ value, coordinate, boxes, moves, local: { current: ls }, emptyBox, setWin }: { value: number, local: React.RefObject<LS>, moves: React.RefObject<number>, coordinate: Coordinate, boxes: React.RefObject<Boxes>, emptyBox: React.RefObject<Coordinate>, setWin: React.Dispatch<React.SetStateAction<boolean>> }) {
  const variant = useContext(VariantContext);
  const variantChanged = useRef(true);

  const divisions = variant === Variant.X8 ? 3 : 4;
  
  const [coord, setCoord] = useState(coordinate);
  const prevCoord = useRef(emptyBox.current);
  
  useEffect(() => {
    boxes.current[value] = { coordinate, swap() {
      variantChanged.current = false;
      setCoord({ ...emptyBox.current });
      prevCoord.current = { ...this.coordinate };
    }};

    return () => {
      delete boxes.current[value]
    }
  }, [value]);

  useEffect(() => {
    setCoord(coordinate);
  }, [coordinate]);

  useEffect(() => {
    variantChanged.current = true;
    moves.current = 0;
  }, [variant]);

  useEffect(() => {
    if(variantChanged.current) return;

    moves.current++;
    emptyBox.current = { ...prevCoord.current };
    if(boxes.current[value]) {
      boxes.current[value].coordinate = coord;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      checkWin(boxes.current) && (() => {
        setWin(true);
        if (ls[variant === Variant.X8 ? 'x8' : 'x15'].record > moves.current) {
          ls[variant === Variant.X8 ? 'x8' : 'x15'].record = moves.current;
          localStorage.setItem("sliding-puzzle", JSON.stringify(ls));
        }
      })();
    }
  }, [coord, value]);


  const onClick = () => {
    variantChanged.current = false;
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