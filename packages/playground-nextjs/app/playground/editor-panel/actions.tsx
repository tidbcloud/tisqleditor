'use client'

import Link from 'next/link'
import { GithubIcon } from 'lucide-react'

import { ModeToggle } from '@/components/biz/theme-toggle'
import { Button } from '@/components/ui/button'

export function EditorActions() {
  return (
    <div className="flex-none flex items-center px-2 border-b">
      <Button variant="outline" size="sm" className="mr-2">
        <Link href="/examples">Examples</Link>
      </Button>
      <ModeToggle />
      <Button variant="ghost" size="icon">
        <a href="https://github.com/tidbcloud/tisqleditor" target="_blank">
          <GithubIcon className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}
