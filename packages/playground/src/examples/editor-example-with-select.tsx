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
      <SelectTrigger className="w-[180px]">
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

function ThemeSelect({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
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

function updateUrlParam(key: string, value: string) {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  params.set(key, value)
  window.history.replaceState({}, '', `${url.pathname}?${params.toString()}`)
}

export function EditorExampleWithSelect({
  defExample,
  defTheme
}: {
  defExample: string
  defTheme: string
}) {
  const [example, setExample] = useState(defExample)
  const [theme, setTheme] = useState(defTheme)

  function onExampleChange(v: string) {
    setExample(v)
    updateUrlParam('example', v)
  }

  function onThemeChange(v: string) {
    setTheme(v)
    updateUrlParam('theme', v)
  }

  return (
    <main className="flex min-h-screen place-items-center justify-center p-4">
      <div className="max-w-7xl min-w-[800px]">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
            TiSQLEditor
          </h1>

          <div className="mt-10 flex items-center gap-1">
            <ExampleSelect value={example} onChange={onExampleChange} />
            <ThemeSelect value={theme} onChange={onThemeChange} />
            <Button variant="ghost" size="icon">
              <a href={`/?example=${example}&theme=${theme}`} target="_blank">
                <EnterFullScreenIcon className="h-4 w-4" />
              </a>
            </Button>

            <div className="mr-auto"></div>

            <Button variant="outline">
              <a href={`/?`} target="_blank">
                Playground
              </a>
            </Button>
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
            <EditorExample example={example} theme={theme} />
          </div>
        </div>
      </div>
    </main>
  )
}
