import { EditorView } from '@codemirror/view'

export const promptInputTheme = EditorView.baseTheme({
  '.cm-ai-prompt-input-root': {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '800px',
    padding: '8px',
    borderRadius: '8px',
    margin: '8px 16px -10px 0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',

    '& form': {
      display: 'flex',
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: '24px',
      '& .cm-ai-prompt-input-icon': {
        zIndex: 1,
        position: 'absolute',
        top: '10px',
        width: '16px',
        height: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      '& .cm-ai-prompt-input-icon-left': {
        left: '12px',
        top: '9px'
      },
      '& .cm-ai-prompt-input-icon-right': {
        right: '36px',
        top: '8px',
        padding: '2px',
        width: '20px',
        height: '20px',
        border: 0,
        borderRadius: '4px',
        background: 'none',
        cursor: 'pointer'
      },
      '& .cm-ai-prompt-input-icon-close': {
        padding: '2px',
        width: '20px',
        height: '20px',
        border: 0,
        borderRadius: '4px',
        background: 'none',
        cursor: 'pointer',
        right: '0',
        top: '8px'
      },
      '& input': {
        flex: '1 1 auto',
        borderRadius: '8px',
        padding: '8px 36px'
      },
      '& input:focus': {
        outline: 'none',
        border: '1px solid var(--light-sky-7, #0CA6F2)'
      },
      '& input::selection': {
        background: '#b3d6ff !important'
      }
    },
    '& .cm-ai-prompt-input-tips': {
      display: 'flex',
      alignItems: 'center',
      height: '28px', // same as input to avoid layout shift
      fontSize: '12px',
      color: 'var(--light-gray-6, #737373)'
    },
    '& .cm-ai-prompt-input-actions': {
      display: 'none',
      flexDirection: 'row',
      gap: '8px',
      '& button': {
        borderRadius: '8px',
        height: '28px',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer'
      }
    }
  },
  '.shake': {
    animation: 'shakeX 1000ms 1'
  },
  '@keyframes shakeX': {
    '10%': { transform: 'translate3d(-10px, 0, 0)' },
    '20%': { transform: 'translate3d(10px, 0, 0)' },
    '30%': { transform: 'translate3d(-10px, 0, 0)' },
    '40%': { transform: 'translate3d(10px, 0, 0)' },
    '50%': { transform: 'translate3d(-10px, 0, 0)' },
    '60%': { transform: 'translate3d(10px, 0, 0)' },
    '70%': { transform: 'translate3d(-10px, 0, 0)' },
    '80%': { transform: 'translate3d(10px, 0, 0)' },
    '90%': { transform: 'translate3d(-10px, 0, 0)' }
  },
  '&light .cm-ai-prompt-input-root': {
    border: '1px solid #E6E6E6',
    backgroundColor: 'white'
  },
  '&dark .cm-ai-prompt-input-root': {
    border: '1px solid #333',
    backgroundColor: '#1a1a1a'
  },
  '&light .cm-ai-prompt-input-root form .cm-ai-prompt-input-icon-right:hover': {
    background: '#E6E6E6'
  },
  '&dark .cm-ai-prompt-input-root form .cm-ai-prompt-input-icon-right': {
    color: '#fff'
  },
  '&dark .cm-ai-prompt-input-root form .cm-ai-prompt-input-icon-close': {
    color: '#fff'
  },
  '&dark .cm-ai-prompt-input-root form .cm-ai-prompt-input-icon-right:hover': {
    background: '#1A1A1A'
  },
  '&light .cm-ai-prompt-input-root form .cm-ai-prompt-input-icon-close:hover': {
    background: '#E6E6E6'
  },
  '&dark .cm-ai-prompt-input-root form .cm-ai-prompt-input-icon-close:hover': {
    background: '#000'
  },
  '&light .cm-ai-prompt-input-root form input': {
    border: '1px solid #E6E6E6',
    caretColor: '#0CA6F2'
  },
  '&dark .cm-ai-prompt-input-root form input': {
    border: '1px solid #1a1a1a',
    caretColor: '#0CA6F2',
    background: '#25262b',
    color: '#e8e8e8'
  },
  '&light .cm-ai-prompt-input-root .cm-ai-prompt-input-actions button': {
    border: '1px solid #E6E6E6',
    background: '#F9F9F9'
  },
  '&dark .cm-ai-prompt-input-root .cm-ai-prompt-input-actions button': {
    border: '1px solid #1a1a1a',
    background: '#292929',
    color: '#fff'
  },
  '&light .cm-ai-prompt-input-root .cm-ai-prompt-input-actions button:hover': {
    color: '#0CA6F2',
    border: '1px solid #B6E4FB',
    background: '#F3FAFE'
  },
  '&dark .cm-ai-prompt-input-root .cm-ai-prompt-input-actions button:hover': {
    color: '#0CA6F2',
    border: '1px solid #085F9D',
    background: '#292929'
  }
})
