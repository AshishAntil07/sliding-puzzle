import { useContext, useEffect, useState } from "react";
import Button from "./button";
import { LS, Variant } from "../types";
import { VariantContext } from "../contexts";


export default function WinDialog({ display, moves, local: { current: ls }, onClose }: { display: boolean, local: React.RefObject<LS>, moves: React.RefObject<number>, onClose?: () => void }) {

  const variant = useContext(VariantContext);
  const [show, setShow] = useState(display);

  useEffect(() => {
    setShow(display);
  }, [display]);

  return (
    <>
      {
        show ?
          <div className='font-mono p-8 absolute h-4/5 w-4/5 top-1/2 left-1/2 text-white -translate-1/2 rounded-lg bg-blue-500'>
            <div className='flex justify-between items-center w-full'>
              <h1 className='text-5xl font-bold text-white/70'>Victory!</h1>
              <Button
                className='rounded-lg bg-blue-400 hover:bg-blue-300 transition-all'
                onClick={() => {
                  setShow(false);
                  onClose?.();
                }}
              >Close</Button>
            </div>
            <p className='mt-6'>Great job solving the puzzle! Let's review your stats together.</p>

            { moves.current === ls[variant === Variant.X8 ? 'x8' : 'x15'].record ? <strong className='mt-4'>New Record!</strong> : null }

            <div className='flex flex-col gap-2 mt-4'>
              <p className='text-lg'>Moves:&nbsp; {moves.current}</p>
              <p className='text-lg'>Record: {ls[variant === Variant.X8 ? 'x8' : 'x15'].record}</p>
            </div>
          </div>
          : null
      }
    </>
  )
}