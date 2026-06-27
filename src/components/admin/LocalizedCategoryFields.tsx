'use client'

import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import type { CategoryLocaleFieldSet } from '@/lib/admin-content-locales'

type LocalizedCategoryFieldsProps = {
  fields: CategoryLocaleFieldSet
  onChange: (fields: CategoryLocaleFieldSet) => void
}

/** Name and description for one category locale tab. */
export function LocalizedCategoryFields({ fields, onChange }: LocalizedCategoryFieldsProps) {
  const t = useTranslations('admin')

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('fieldName')} *</label>
        <Input
          value={fields.name}
          onChange={(e) => onChange({ ...fields, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('fieldDescription')}</label>
        <textarea
          value={fields.description}
          onChange={(e) => onChange({ ...fields, description: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          rows={3}
        />
      </div>
    </div>
  )
}
