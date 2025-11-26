import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HighlighterIcon } from '@/components/tiptap-icons/highlighter-icon'
import { Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ColorHighlightPopoverProps {
  editor: Editor
  type: 'color' | 'highlight'
}

const colors = [
  { name: 'Default', value: '' },
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Green', value: '#10B981' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
]

export function ColorHighlightPopover({ editor, type }: ColorHighlightPopoverProps) {
  const Icon = type === 'color' ? Palette : HighlighterIcon
  const label = type === 'color' ? 'Text Color' : 'Highlight'

  const handleColorSelect = (color: string) => {
    if (type === 'color') {
      if (color) {
        editor.chain().focus().setColor(color).run()
      } else {
        editor.chain().focus().unsetColor().run()
      }
    } else {
      if (color) {
        editor.chain().focus().setHighlight({ color }).run()
      } else {
        editor.chain().focus().unsetHighlight().run()
      }
    }
  }

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Icon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <p className="text-sm font-medium">{label}</p>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color.value || 'default'}
                onClick={() => handleColorSelect(color.value)}
                className={cn(
                  'h-8 w-8 rounded border border-border',
                  !color.value && 'bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500'
                )}
                style={color.value ? { backgroundColor: color.value } : undefined}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
