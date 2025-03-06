import { useContext } from "react"
import { Variant } from "../types"
import { VariantContext } from "../contexts"
import Button from "./button";



export default function Menu({ setVariant }: { setVariant: (variant: Variant) => void }) {
  const variant = useContext(VariantContext);

  return (
    <div className='flex flex-row flex-nowrap gap-4'>
      <Button onClick={() => setVariant(Variant.X8)} className={variant === Variant.X8 ? 'bg-blue-500' : 'bg-blue-300'}>8 Puzzle</Button>
      <Button onClick={() => setVariant(Variant.X15)} className={variant === Variant.X15 ? 'bg-blue-500' : 'bg-blue-300'}>15 Puzzle</Button>
    </div>
  )
}