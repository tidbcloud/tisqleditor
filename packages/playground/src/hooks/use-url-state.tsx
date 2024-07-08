import { createContext, useContext, useMemo, useState } from 'react'

type UrlStateCtxValue = {
  urlSearch: string
  setUrlSearch: (v: string) => void
}

const UrlStateContext = createContext<UrlStateCtxValue | null>(null)

const useUrlStateContext = () => {
  const context = useContext(UrlStateContext)

  if (!context) {
    throw new Error('useUrlStateContext must be used within a provider')
  }

  return context
}

type UrlStateProviderOptions = {
  getUrlParams: () => string
  updateUrlParams: (p: string) => void
}

const defaultOptions: UrlStateProviderOptions = {
  getUrlParams() {
    const url = new URL(window.location.href)
    return url.search
  },
  updateUrlParams(p) {
    const url = new URL(window.location.href)
    window.history.replaceState({}, '', `${url.pathname}?${p}`)
  }
}

export function UrlStateProvider(props: {
  children: React.ReactNode
  options?: UrlStateProviderOptions
}) {
  const opt = props.options || defaultOptions
  const [urlSearch, _setUrlSearch] = useState(opt.getUrlParams())

  const ctxValue = useMemo(
    () => ({
      urlSearch,
      setUrlSearch: (v: string) => {
        opt.updateUrlParams(v)
        _setUrlSearch(v)
      }
    }),
    [urlSearch]
  )

  return (
    <UrlStateContext.Provider value={ctxValue}>
      {props.children}
    </UrlStateContext.Provider>
  )
}

//----------------------

type UrlState = Record<string, string | undefined>
type UrlStateObj<T extends UrlState = UrlState> = Partial<{
  [key in keyof T]: string
}>

export function useUrlState<T extends UrlState = UrlState>(): [
  UrlStateObj<T>,
  (s: UrlStateObj<T>) => void
] {
  const { urlSearch, setUrlSearch } = useUrlStateContext()

  const searchParams = new URLSearchParams(urlSearch)
  const paramsObj: any = {}
  searchParams.forEach((v, k) => {
    paramsObj[k] = v
  })
  const queryParams = paramsObj as UrlStateObj<T>

  function setQueryParams(s: UrlStateObj<T>) {
    const searchParams = new URLSearchParams(urlSearch)
    Object.keys(s).forEach((k) => {
      if (s[k]) {
        searchParams.set(k, s[k])
      } else {
        searchParams.delete(k)
      }
    })
    setUrlSearch(searchParams.toString())
  }

  return [queryParams, setQueryParams] as const
}
