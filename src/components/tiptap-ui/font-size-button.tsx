import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Type } from 'lucide-react'
import { ChevronDownIcon } from '@/components/tiptap-icons'
import { cn } from '@/lib/utils'

const fontSizes = [
  { label: 'Small', value: '12px' },
  { label: 'Normal', value: '16px' },
  { label: 'Large', value: '20px' },
  { label: 'Extra Large', value: '24px' },
]

export function FontSizeButton() {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-style="ghost">
          <Type className="h-4 w-4" />
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {fontSizes.map((size) => (
          <DropdownMenuItem
            key={size.value}
            onClick={() => editor.chain().focus().setFontSize(size.value).run()}
          >
            <span style={{ fontSize: size.value }}>{size.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
