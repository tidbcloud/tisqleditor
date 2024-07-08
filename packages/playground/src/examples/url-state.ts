import { useUrlState } from '@/hooks/use-url-state'
import { useCallback } from 'react'

type ExampleUrlState = Partial<
  Record<'example' | 'with_select' | 'theme', string>
>

export function useExampleUrlState() {
  const [queryParams, setQueryParams] = useUrlState<ExampleUrlState>()

  // example
  const example = queryParams.example
  const setExample = useCallback((v: string) => {
    setQueryParams({ example: v })
  }, [])

  // theme
  const theme = queryParams.theme || 'oneDark'
  const setTheme = useCallback((v: string) => {
    setQueryParams({ theme: v })
  }, [])

  // with_select
  const withSelect = !!queryParams.with_select

  return { example, setExample, theme, setTheme, withSelect }
}
