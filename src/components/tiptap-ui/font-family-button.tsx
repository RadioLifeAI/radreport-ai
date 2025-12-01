import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { CaseSensitive } from 'lucide-react'
import { ChevronDownIcon } from '@/components/tiptap-icons'

const fontFamilies = [
  { label: 'Sans Serif', value: 'Inter, sans-serif' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Monospace', value: 'Courier New, monospace' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
]

export function FontFamilyButton() {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null

  const currentFont = editor.getAttributes('textStyle').fontFamily

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
            onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
            className={currentFont === font.value ? 'bg-accent' : ''}
          >
            <span style={{ fontFamily: font.value }}>{font.label}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().unsetFontFamily().run()}
        >
          <span className="text-muted-foreground">Remover fonte</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
