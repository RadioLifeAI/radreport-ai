import { Editor } from '@tiptap/react'

// Opções para templates: normalizar whitespace em HTML estruturado
const TEMPLATE_PARSE_OPTIONS = {
  preserveWhitespace: false as const,
}

// Opções para texto/ditado: preservar espaços exatamente como ditados
const TEXT_PARSE_OPTIONS = {
  preserveWhitespace: 'full' as const,
}

/**
 * Substitui todo o conteúdo do editor (usado para templates)
 */
export function applyTemplate(editor: Editor, html: string) {
  if (!editor) return
  
  editor.commands.setContent(html, {
    emitUpdate: true,
    parseOptions: TEMPLATE_PARSE_OPTIONS, // Normalizar whitespace em templates
  })
}

/**
 * Insere conteúdo na posição atual do cursor
 * @param shouldFocus - Se deve focar o editor (default: true)
 */
export function insertContent(editor: Editor, content: string, shouldFocus = true) {
  if (!editor) return
  
  if (shouldFocus) {
    editor.chain().focus().insertContent(content, {
      parseOptions: TEXT_PARSE_OPTIONS, // Preservar espaços em texto/ditado
    }).run()
  } else {
    editor.commands.insertContent(content, {
      parseOptions: TEXT_PARSE_OPTIONS, // Preservar espaços em texto/ditado
    })
  }
}

/**
 * Insere conteúdo em posição específica ou substitui range
 */
export function insertContentAt(
  editor: Editor, 
  position: number | { from: number; to: number }, 
  content: string
) {
  if (!editor) return
  
  editor.commands.insertContentAt(position, content, {
    updateSelection: true,
    parseOptions: TEXT_PARSE_OPTIONS, // Preservar espaços em texto/ditado
  })
}

/**
 * Substitui a seleção atual com novo conteúdo
 */
export function replaceSelection(editor: Editor, content: string) {
  if (!editor) return
  
  const { from, to } = editor.state.selection
  
  if (from === to) {
    // Sem seleção, apenas inserir
    insertContent(editor, content)
  } else {
    // Com seleção, substituir usando insertContentAt
    insertContentAt(editor, { from, to }, content)
  }
}

/**
 * Insere texto de voz com normalização de espaços
 */
export function voiceInsert(editor: Editor, text: string) {
  if (!editor) return
  
  const trimmedText = text.trim()
  if (!trimmedText) return
  
  // Adicionar espaço apenas se não termina com pontuação
  const needsSpace = !/[.!?,;:\s]$/.test(trimmedText)
  const content = trimmedText + (needsSpace ? ' ' : '')
  
  editor.chain().focus().insertContent(content).run()
}

/**
 * Insere conclusão estruturada (aceita HTML)
 */
export function insertConclusion(editor: Editor, html: string) {
  if (!editor) return
  
  editor.chain().focus().insertContent(html, {
    parseOptions: TEXT_PARSE_OPTIONS, // Preservar espaços em conclusões
  }).run()
}

/**
 * Insere sugestão de IA
 */
export function insertSuggestion(editor: Editor, text: string) {
  insertContent(editor, text, true)
}

// Aliases para compatibilidade
export const insertAtCursor = insertContent
export const expandCurrentSentence = insertContent
