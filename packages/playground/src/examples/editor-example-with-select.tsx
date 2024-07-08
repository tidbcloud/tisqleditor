import { useEffect } from 'react'

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
import { useTheme } from '@/components/darkmode-toggle/theme-provider'

import { EditorExample } from './editor-example'
import { useExampleUrlState } from './url-state'

function ExampleSelect() {
  const { example, setExample } = useExampleUrlState()

  return (
    <Select value={example} onValueChange={setExample}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an extension" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Extensions</SelectLabel>
          <SelectItem value="ai-widget">AI Widget</SelectItem>
          <SelectItem value="sql-autocomplete">SQL AutoComplete</SelectItem>
          <SelectItem value="cur-sql-gutter">CurSqlGutter</SelectItem>
          <SelectItem value="use-db-linter">UseDb Linter</SelectItem>
          <SelectItem value="full-width-char-linter">
            FullWidthChar Linter
          </SelectItem>
          <SelectItem value="save-helper">Save Helper</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function ThemeSelect() {
  const { theme, setTheme } = useExampleUrlState()

  return (
    <Select value={theme} onValueChange={setTheme}>
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

export function EditorExampleWithSelect() {
  const { example, theme: editorTheme } = useExampleUrlState()

  const { setTheme: setAppTheme } = useTheme()

  useEffect(() => {
    setAppTheme(
      editorTheme === 'oneDark' || editorTheme === 'dark' ? 'dark' : 'light'
    )
  }, [editorTheme])

  return (
    <main className="flex min-h-screen place-items-center justify-center p-4">
      <div className="max-w-7xl min-w-[800px]">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
            TiSQLEditor
          </h1>

          <div className="mt-10 flex items-center gap-1">
            <ExampleSelect />
            <ThemeSelect />
            <Button variant="ghost" size="icon">
              <a
                href={`/?example=${example}&theme=${editorTheme}`}
                target="_blank"
              >
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
            <EditorExample example={example} theme={editorTheme} />
          </div>
        </div>
      </div>
    </main>
  )
}
