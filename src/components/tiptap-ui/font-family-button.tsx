import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CaseSensitive } from 'lucide-react'
import { ChevronDownIcon } from '@/components/tiptap-icons'

const fontFamilies = [
  { label: 'Sans Serif', value: 'Inter, sans-serif' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Monospace', value: 'Courier New, monospace' },
]

export function FontFamilyButton() {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-style="ghost">
          <CaseSensitive className="h-4 w-4" />
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {fontFamilies.map((font) => (
          <DropdownMenuItem
            key={font.value}
            onClick={() => editor.chain().focus().setMark('textStyle', { fontFamily: font.value }).run()}
          >
            <span style={{ fontFamily: font.value }}>{font.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
