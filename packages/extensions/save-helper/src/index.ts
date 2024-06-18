import { Extension, Prec } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'

type SaveHelperOptions = {
  delay?: number // in milliseconds, default 5000
  auto?: boolean
  hotkey?: boolean
  save: (view: EditorView) => void
}

const autoSave = (delay: number, save: (view: EditorView) => void) => {
  let timer: number | undefined
  return EditorView.updateListener.of((update) => {
    if (!update.docChanged) return
    // debounce
    timer && clearTimeout(timer)
    // https://stackoverflow.com/a/55550147
    // use `window.setTimeout` instead of `setTimeout` to dismiss the timer type error
    // TS2322: Type 'Timeout' is not assignable to type 'number'.
    timer = window.setTimeout(() => save(update.view), delay)
  })
}

const saveKeymap = (save: (view: EditorView) => void) => {
  return Prec.highest(
    keymap.of([
      {
        key: 'Mod-s',
        run: (view: EditorView) => {
          save(view)
          return true
        }
      }
    ])
  )
}

export const saveHelper = ({
  delay = 5000,
  auto = true,
  hotkey = true,
  save
}: SaveHelperOptions) => {
  const exts: Extension[] = []

  if (auto) {
    exts.push(autoSave(delay, save))
  }

  if (hotkey) {
    exts.push(saveKeymap(save))
  }

  return exts
}
