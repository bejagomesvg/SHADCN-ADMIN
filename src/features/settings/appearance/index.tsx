import { useState, useEffect } from 'react'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

const LOCAL_STORAGE_KEY_STICKY_TABS = 'shadcn-admin-sticky-tabs-enabled'
const LOCAL_STORAGE_KEY_FIXED_HEADER = 'shadcn-admin-fixed-header'

export function SettingsAppearance() {
  const [isFixed, setIsFixed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FIXED_HEADER)
      return saved === null ? true : saved === 'true'
    }
    return true
  })

  const [isStickyTabsEnabled, setIsStickyTabsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STICKY_TABS)
      return saved === null ? true : saved === 'true'
    }
    return true
  })

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_FIXED_HEADER, isFixed.toString())
  }, [isFixed])

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
