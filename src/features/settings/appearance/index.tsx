import { useState } from 'react'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  const [isFixed, setIsFixed] = useState(true)

  return (
    <ContentSection
      title='Appearance'
      desc='Customize the appearance of the app. Automatically switch between day
          and night themes.'
      contentClassName='lg:max-w-none'
      fixed={isFixed}
    >
      <AppearanceForm onFixedHeaderChange={setIsFixed} />
    </ContentSection>
  )
}
