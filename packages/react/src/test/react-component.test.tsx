import { render, screen } from '@testing-library/react'
// import SQLEditor from '../sql-editor'
import '@testing-library/jest-dom'
// @ts-ignore
import React from 'react'

const Example = () => {
  return <input></input>
}

test('test with react-testing-library', () => {
  render(<Example />)
  expect(screen.getByRole('textbox')).toBeEnabled()
})
