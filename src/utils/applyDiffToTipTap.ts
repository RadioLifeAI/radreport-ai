import { Editor } from '@tiptap/react'
import { TextDiff } from './diffUtils'

/**
 * Aplica diffs no editor TipTap preservando formatação
 * Diffs devem estar ordenados da última posição para primeira
 */
export function applyDiffToEditor(editor: Editor, diffs: TextDiff[]): boolean {
  if (!editor || diffs.length === 0) return false

  console.log('🔧 Applying', diffs.length, 'diffs to editor')

  try {
    // Aplicar cada diff usando comandos TipTap
    for (const diff of diffs) {
      switch (diff.type) {
        case 'replace':
          applyReplaceDiff(editor, diff)
          break
        case 'insert':
          applyInsertDiff(editor, diff)
          break
        case 'delete':
          applyDeleteDiff(editor, diff)
          break
      }
    }

    console.log('✅ All diffs applied successfully')
    return true
  } catch (error) {
    console.error('❌ Error applying diffs:', error)
    return false
  }
}

/**
 * Aplica diff de substituição preservando marks (bold, italic, etc.)
 */
function applyReplaceDiff(editor: Editor, diff: TextDiff): void {
  const { from, to, replacement } = diff

  // Extrair marks existentes na posição
  const marks = getMarksAtPosition(editor, from)

  // Deletar texto original
  editor.commands.deleteRange({ from, to })

  // Inserir texto corrigido com mesmas marks
  if (marks.length > 0) {
    // Criar chain com marks
    let chain = editor.chain().focus()
    marks.forEach(mark => {
      chain = chain.setMark(mark.type.name, mark.attrs)
    })
    chain.insertContentAt(from, replacement).run()
    
    // Remover marks após inserção
    marks.forEach(mark => {
      editor.commands.unsetMark(mark.type.name)
    })
  } else {
    editor.commands.insertContentAt(from, replacement)
  }

  console.log('🔄 Replace:', diff.original, '→', replacement)
}

/**
 * Aplica diff de inserção
 */
function applyInsertDiff(editor: Editor, diff: TextDiff): void {
  const { from, replacement } = diff

  editor.commands.insertContentAt(from, replacement)
  console.log('➕ Insert:', replacement, 'at', from)
}

/**
 * Aplica diff de deleção
 */
function applyDeleteDiff(editor: Editor, diff: TextDiff): void {
  const { from, to } = diff

  editor.commands.deleteRange({ from, to })
  console.log('➖ Delete:', diff.original, 'from', from, 'to', to)
}

/**
 * Extrai marks (formatação) de uma posição específica
 */
function getMarksAtPosition(editor: Editor, pos: number): readonly any[] {
  const { state } = editor
  const { doc } = state

  // Encontrar node e offset na posição
  const $pos = doc.resolve(pos)
  
  // Retornar marks ativos na posição
  return $pos.marks()
}

/**
 * Encontra posição de texto no documento
 * Útil para mapear posições string → posições TipTap
 */
export function findTextPosition(editor: Editor, searchText: string): number | null {
  const { state } = editor
  const { doc } = state

  let textContent = ''
  let positions: number[] = []
  let currentPos = 0

  // Construir mapa de posições
  doc.descendants((node, pos) => {
    if (node.isText) {
      textContent += node.text || ''
      positions.push(pos)
    }
    return true
  })

  // Buscar texto
  const index = textContent.indexOf(searchText)
  if (index === -1) return null

  // Mapear índice string → posição TipTap
  return positions[index] || null
}

/**
 * Valida integridade do editor após aplicação de diffs
 */
export function validateDiffApplication(editor: Editor): boolean {
  try {
    const { state } = editor
    const { doc } = state

    // Verificações básicas
    if (!doc) return false
    if (doc.content.size === 0) return false

    // Verificar se estrutura está válida
    let valid = true
    doc.descendants((node) => {
      if (!node.type) {
        valid = false
        return false
      }
      return true
    })

    return valid
  } catch (error) {
    console.error('❌ Validation error:', error)
    return false
  }
}
