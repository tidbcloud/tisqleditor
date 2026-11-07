import { GitHubLogoIcon } from '@radix-ui/react-icons'

import { DarkModeToggle } from '@/components/darkmode-toggle/toggle'
import { Button } from '@/components/ui/button'

export function EditorActions() {
  return (
    <div className="flex-none flex items-center px-2 border-b">
      <Button variant="outline" size="sm" className="mr-2">
        <a href={`/?example=all&with_select`} target="_blank">
          Examples
        </a>
      </Button>
      <DarkModeToggle />
      <Button variant="ghost" size="icon">
        <a href="https://github.com/tidbcloud/tisqleditor" target="_blank">
          <GitHubLogoIcon className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}
