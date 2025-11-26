import * as React from 'react'
import { EditorContext, type Editor } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, List, ListOrdered, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ListDropdownMenuProps {
  types?: ('bulletList' | 'orderedList' | 'taskList')[]
  portal?: boolean
}

const listConfig = {
  bulletList: {
    icon: List,
    label: 'Bullet List',
    command: (editor: any) => editor.chain().focus().toggleBulletList().run(),
  },
  orderedList: {
    icon: ListOrdered,
    label: 'Ordered List',
    command: (editor: any) => editor.chain().focus().toggleOrderedList().run(),
  },
  taskList: {
    icon: ListChecks,
    label: 'Task List',
    command: (editor: any) => editor.chain().focus().toggleTaskList().run(),
  },
}

export function ListDropdownMenu({ types = ['bulletList', 'orderedList', 'taskList'], portal = false }: ListDropdownMenuProps) {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null

  const getCurrentList = () => {
    for (const type of types) {
      if (editor.isActive(type)) {
        return listConfig[type]
      }
    }
    return { icon: List, label: 'List' }
  }

  const current = getCurrentList()
  const Icon = current.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-style="ghost" data-active={types.some(type => editor.isActive(type))}>
          <Icon className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {types.map((type) => {
          const config = listConfig[type]
          const ItemIcon = config.icon
          return (
            <DropdownMenuItem
              key={type}
              onClick={() => config.command(editor)}
              className={cn(editor.isActive(type) && 'bg-accent')}
            >
              <ItemIcon className="h-4 w-4 mr-2" />
              {config.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
