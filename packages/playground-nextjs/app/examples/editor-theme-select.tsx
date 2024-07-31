'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function EditorThemeSelect() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const theme = searchParams.get('theme') ?? 'oneDark'

  function handleChange(v: string) {
    const params = new URLSearchParams(searchParams)
    params.set('theme', v)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={theme} onValueChange={handleChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Themes</SelectLabel>
          <SelectItem value="bbedit">bbedit</SelectItem>
          <SelectItem value="oneDark">oneDark</SelectItem>
          <SelectItem value="default">default</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
