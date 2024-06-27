import { useState } from 'react'

import { EnterFullScreenIcon, GitHubLogoIcon } from '@radix-ui/react-icons'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

import { DarkModeToggle } from '@/components/darkmode-toggle/toggle'
import { useTheme } from '@/components/darkmode-toggle/theme-provider'

import { EditorExample } from './editor-example'

function ExampleSelect({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select an extension" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Extensions</SelectLabel>
          <SelectItem value="ai-widget">AI Widget</SelectItem>
          <SelectItem value="save-helper">Save Helper</SelectItem>
          <SelectItem value="autocomplete">AutoComplete</SelectItem>
          <SelectItem value="cur-sql-gutter">CurSqlGutter</SelectItem>
          <SelectItem value="use-db-linter">UseDb Linter</SelectItem>
          <SelectItem value="full-width-char-linter">
            FullWidthChar Linter
          </SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function EditorExampleWithSelect({
  initExample
}: {
  initExample: string
}) {
  const [example, setExample] = useState(initExample)
  const { isDark } = useTheme()

  function onSelectValueChange(v: string) {
    setExample(v)

    // update url
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.set('example', v)
    window.history.replaceState({}, '', `${url.pathname}?${params.toString()}`)
  }

  return (
    <main className="flex min-h-screen place-items-center justify-center p-4">
      <div className="max-w-7xl min-w-[800px]">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
            TiSQLEditor
          </h1>

          <div className="mt-10 flex items-center">
            <ExampleSelect value={example} onChange={onSelectValueChange} />
            <Button variant="ghost" size="icon" className="ml-2">
              <a
                href={`/?example=${example}&theme=${isDark ? 'dark' : 'light'}`}
                target="_blank"
              >
                <EnterFullScreenIcon className="h-4 w-4" />
              </a>
            </Button>

            <div className="mr-auto"></div>

            <Button variant="outline" className="mr-2">
              <a href={`/?`} target="_blank">
                Playground
              </a>
            </Button>
            <DarkModeToggle />
            <Button variant="ghost" size="icon">
              <a
                href="https://github.com/tidbcloud/tisqleditor"
                target="_blank"
              >
                <GitHubLogoIcon className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-2 text-left border-2 h-[400px]">
            <EditorExample example={example} isDark={isDark} />
          </div>
        </div>
      </div>
    </main>
  )
}
