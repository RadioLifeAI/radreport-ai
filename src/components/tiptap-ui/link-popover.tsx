import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LinkIcon } from '@/components/tiptap-icons/link-icon'
import { Link2Off } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LinkPopoverProps {}

export function LinkPopover({}: LinkPopoverProps = {}) {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null
  const [url, setUrl] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const isActive = editor.isActive('link')

  React.useEffect(() => {
    if (open && isActive) {
      const { href } = editor.getAttributes('link')
      setUrl(href || '')
    } else if (!open) {
      setUrl('')
    }
  }, [open, isActive, editor])

  const handleSetLink = () => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }
    setOpen(false)
  }

  const handleUnsetLink = () => {
    editor.chain().focus().unsetLink().run()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8',
                isActive && 'bg-accent text-accent-foreground'
              )}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Link</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">URL</label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSetLink()
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSetLink}
              disabled={!url}
              className="flex-1"
            >
              {isActive ? 'Update' : 'Set'} Link
            </Button>
            {isActive && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleUnsetLink}
              >
                <Link2Off className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
