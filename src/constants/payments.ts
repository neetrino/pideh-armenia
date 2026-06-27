import type { PaymentMethod } from '@prisma/client'

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: 'Наличными',
  ARCA: 'Картой (ArCa)',
  IDRAM: 'Idram',
  AMERIABANK: 'Ameriabank',
}
