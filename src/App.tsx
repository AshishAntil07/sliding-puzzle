import { useState } from "react"
import { VariantContext } from "./contexts"
import { Variant } from "./types"
import Menu from "./components/menu";
import Puzzle from "./components/puzzle";

function App() {

  const [variant, setVariant] = useState(Variant.X8);

  return (
    <VariantContext.Provider value={variant}>
      <Menu setVariant={setVariant} />
      <Puzzle />
    </VariantContext.Provider>
  )
}

export default App
