import { createContext, useContext, useEffect, useState } from 'react'

const AppHeaderContentContext = createContext<React.ReactNode>(null)
const AppHeaderSetterContext = createContext<
  React.Dispatch<React.SetStateAction<React.ReactNode>> | null
>(null)

export function AppHeaderProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(null)

  return (
    <AppHeaderSetterContext value={setContent}>
      <AppHeaderContentContext value={content}>
        {children}
      </AppHeaderContentContext>
    </AppHeaderSetterContext>
  )
}

export function AppHeaderSlot({ children }: { children: React.ReactNode }) {
  const setContent = useContext(AppHeaderSetterContext)

  if (!setContent) {
    throw new Error('AppHeaderSlot must be used within AppHeaderProvider')
  }

  useEffect(() => {
    setContent(children)

    return () => setContent(null)
  }, [children, setContent])

  return null
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppHeaderContent() {
  return useContext(AppHeaderContentContext)
}
