import { useContext } from "react"
import { Variant } from "../types"
import { VariantContext } from "../contexts"
import Button from "./button";



export default function Menu({ setVariant }: { setVariant: (variant: Variant) => void }) {
  const variant = useContext(VariantContext);

  return (
    <div className='flex flex-col flex-nowrap gap-6'>
      <Button
        onClick={() => setVariant(Variant.X8)}
        className={"bg-blue-300 h-12 w-12 p-0 pt-1.5 pl-1.5 flex flex-col flex-nowrap justify-between transition-all " + (variant === Variant.X8 ? 'brightness-100 scale-105' : 'brightness-90')}
      >
        {
          Array.from({ length: 3 }).map((_, y) => {
            return (
              <div key={y} className='flex flex-row flex-nowrap items-center justify-between'>
                {
                  Array.from({ length: 3 }).map((_, x) => {
                    return (
                      <div key={x} className='w-2 h-2 rounded-xs origin-top-left scale-150 bg-blue-500' />
                    )
                  })
                }
              </div>
            )
          })
        }
      </Button>

      <Button
        onClick={() => setVariant(Variant.X15)}
        className={"bg-blue-300 h-12 w-12 p-0 pt-1 pl-1 flex flex-col flex-nowrap justify-between transition-all " + (variant === Variant.X15 ? 'brightness-100 scale-105' : 'brightness-90')}
      >
        {
          Array.from({ length: 4 }).map((_, y) => {
            return (
              <div key={y} className='flex flex-row flex-nowrap items-center justify-between'>
                {
                  Array.from({ length: 4 }).map((_, x) => {
                    return (
                      <div key={x} className='w-1.5 h-1.5 rounded-[1px] origin-top-left scale-150 bg-blue-500' />
                    )
                  })
                }
              </div>
            )
          })
        }
      </Button>
    </div>
  )
}