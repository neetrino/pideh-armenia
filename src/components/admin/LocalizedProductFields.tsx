'use client'

import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import type { LocaleFieldSet } from '@/lib/admin-content-locales'

type LocalizedProductFieldsProps = {
  fields: LocaleFieldSet
  onChange: (fields: LocaleFieldSet) => void
}

/** Name, description, ingredients for one locale tab. */
export function LocalizedProductFields({ fields, onChange }: LocalizedProductFieldsProps) {
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
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('fieldDescription')} *</label>
        <textarea
          value={fields.description}
          onChange={(e) => onChange({ ...fields, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('fieldIngredients')} *</label>
        <Input
          value={fields.ingredients}
          onChange={(e) => onChange({ ...fields, ingredients: e.target.value })}
        />
        <p className="text-sm text-gray-500 mt-1">{t('ingredientsHint')}</p>
      </div>
    </div>
  )
}
