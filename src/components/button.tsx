import { MouseEventHandler } from "react";


export default function Button({ type, className, onClick, children }: { type?: "submit" | "button" | "reset", className?: string, onClick?: MouseEventHandler<HTMLButtonElement>, children?: React.ReactNode }) {
  return (
    <>
      <button onClick={onClick} type={type} className={`rounded-md p-2 cursor-pointer ` + (className || '')}>{children}</button>
    </>
  )
}