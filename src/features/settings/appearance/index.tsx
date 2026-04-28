import { useState, useEffect } from 'react'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

const LOCAL_STORAGE_KEY_STICKY_TABS = 'shadcn-admin-sticky-tabs-enabled'

export function SettingsAppearance() {
  const [isFixed, setIsFixed] = useState(true)
  const [isStickyTabsEnabled, setIsStickyTabsEnabled] = useState<boolean>(
    () => {
      if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY_STICKY_TABS)
        return storedValue === null ? true : storedValue === 'true' // Se não houver valor, assume true. Caso contrário, converte para booleano.
      }
      return true // Valor padrão para SSR ou se localStorage não estiver disponível
    }
  )

  // Persiste a alteração no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_STICKY_TABS,
      isStickyTabsEnabled.toString()
    )
  }, [isStickyTabsEnabled])

  return (
    <ContentSection
      title='Appearance'
      desc='Customize the appearance of the app. Automatically switch between day
          and night themes.'
      contentClassName='lg:max-w-none'
      fixed={isFixed}
    >
      <AppearanceForm
        onFixedHeaderChange={setIsFixed}
        onFixedTabsChange={setIsStickyTabsEnabled}
        defaultFixedHeader={isFixed}
        defaultFixedTabs={isStickyTabsEnabled}
      />
    </ContentSection>
  )
}
