import { createFileRoute } from '@tanstack/react-router'
import { CardModels } from '@/features/card-models'

export const Route = createFileRoute('/_authenticated/cards/')({
  component: CardModels,
})
