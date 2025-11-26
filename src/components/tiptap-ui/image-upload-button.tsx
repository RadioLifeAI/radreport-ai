import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { ImagePlus } from 'lucide-react'

export interface ImageUploadButtonProps {}

export function ImageUploadButton({}: ImageUploadButtonProps = {}) {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      if (src) {
        editor.chain().focus().setImage({ src }).run()
      }
    }
    reader.readAsDataURL(file)

    // Reset input
    event.target.value = ''
  }

  return (
    <>
      <Button
        data-style="ghost"
        onClick={handleClick}
      >
        <ImagePlus className="h-4 w-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}
