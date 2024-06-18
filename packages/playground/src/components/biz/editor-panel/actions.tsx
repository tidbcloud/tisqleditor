import { Button } from '@/components/ui/button'
import { GitHubLogoIcon, PlayIcon } from '@radix-ui/react-icons'

export function EditorActions() {
  return (
    <div className="flex-none flex items-center gap-2 px-2 border-b">
      <Button size="sm">
        <PlayIcon className="mr-2 h-4 w-4" />
        Run
      </Button>
      <Button variant="ghost" size="icon">
        <a href="https://github.com/tidbcloud/tisqleditor" target="_blank">
          <GitHubLogoIcon className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}
