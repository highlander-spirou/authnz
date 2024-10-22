import { createContext, useContext, useState } from "react"

interface GlobalContextInterface {
  mfaToken: string | null
  setMfaToken: React.Dispatch<React.SetStateAction<string | null>>
}

const GlobalContext = createContext<GlobalContextInterface | null>(null)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [mfaToken, setMfaToken] = useState<string | null>(null)

  return (
    <GlobalContext.Provider
      value={{
        mfaToken,
        setMfaToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)!
  if (!context) {
    throw new Error("useGlobalContext has to be used within GlobalProvider")
  }
  return context
}
