import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { List, ListOrdered } from 'lucide-react'

export interface ListButtonProps {
  editor: Editor
  listType: 'bulletList' | 'orderedList'
}

export function ListButton({ editor, listType }: ListButtonProps) {
  const Icon = listType === 'bulletList' ? List : ListOrdered
  const label = listType === 'bulletList' ? 'Bullet List' : 'Ordered List'

  const isActive = editor.isActive(listType)
  const canToggle = editor.can().chain().focus()[
    listType === 'bulletList' ? 'toggleBulletList' : 'toggleOrderedList'
  ]().run()

  const handleClick = () => {
    if (listType === 'bulletList') {
      editor.chain().focus().toggleBulletList().run()
    } else {
      editor.chain().focus().toggleOrderedList().run()
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={!canToggle}
          className={cn(
            'h-8 w-8',
            isActive && 'bg-accent text-accent-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
