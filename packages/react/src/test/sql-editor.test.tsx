// @ts-ignore
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { SQLEditor } from '..'

const Editor = () => {
  return <SQLEditor editorId="111" doc="select * from test;" />
}

test('test with react-testing-library', () => {
  render(<Editor />)
  expect(screen.getByText('select')).toBeEnabled()
  expect(screen.getByText('from')).toBeEnabled()
})
