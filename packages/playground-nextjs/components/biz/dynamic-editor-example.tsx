import dynamic from 'next/dynamic'

// https://dev.to/vvo/how-to-solve-window-is-not-defined-errors-in-react-and-next-js-5f97
// use dynamic load to resolve compile error when running `next build`

export const DynamicEditorExample = dynamic(
  () => import('./editor-example').then((mod) => mod.EditorExample),
  {
    ssr: false
  }
)
