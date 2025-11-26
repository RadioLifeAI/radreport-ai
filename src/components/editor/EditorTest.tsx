import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { useState } from 'react'

export default function EditorTest() {
  const [content, setContent] = useState('')

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            TipTap Simple Editor - Template Oficial
          </h1>
          <p className="text-muted-foreground">
            Editor oficial com todos os recursos nativos do TipTap UI Components
          </p>
        </div>

        <div className="glass-card p-6">
          <SimpleEditor
            content={content}
            onChange={setContent}
            placeholder="Digite o laudo médico aqui..."
          />
        </div>

        {content && (
          <div className="glass-card p-6 space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Preview do HTML gerado:
            </h2>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{content}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
