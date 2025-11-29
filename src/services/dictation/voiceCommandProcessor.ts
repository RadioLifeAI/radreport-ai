import { Editor } from '@tiptap/react'
import { applyCapitalization, shouldCapitalizeNext, normalizeSpacing } from '@/utils/textFormatter'

/**
 * Comandos de pontuação (ordem de maior para menor para evitar conflitos)
 */
const PUNCTUATION_COMMANDS: Array<{ pattern: string; replacement: string }> = [
  { pattern: 'ponto de interrogação', replacement: '?' },
  { pattern: 'ponto de exclamação', replacement: '!' },
  { pattern: 'ponto e vírgula', replacement: ';' },
  { pattern: 'ponto parágrafo', replacement: '.\n\n' },
  { pattern: 'ponto final', replacement: '.' },
  { pattern: 'dois pontos', replacement: ':' },
  { pattern: 'vírgula', replacement: ',' },
  { pattern: 'ponto', replacement: '.' },
  { pattern: 'reticências', replacement: '...' },
  { pattern: 'abre parênteses', replacement: '(' },
  { pattern: 'fecha parênteses', replacement: ')' },
  { pattern: 'hífen', replacement: '-' },
  { pattern: 'travessão', replacement: '—' },
]

/**
 * Comandos estruturais (não devem ser processados como texto)
 */
const STRUCTURAL_COMMANDS = [
  'nova linha',
  'próxima linha',
  'linha',
  'novo parágrafo',
  'próximo parágrafo',
  'parágrafo',
]

/**
 * Comandos de edição
 */
const EDITING_COMMANDS = [
  'apagar isso',
  'desfazer',
  'desfaz',
  'refazer',
]

/**
 * Detecta se há comando estrutural no texto
 */
export function hasStructuralCommand(text: string): boolean {
  const lower = text.toLowerCase()
  return STRUCTURAL_COMMANDS.some(cmd => lower.includes(cmd))
}

/**
 * Divide texto por comandos estruturais
 */
export function splitByStructuralCommands(text: string): Array<{ type: 'text' | 'command'; content: string }> {
  const segments: Array<{ type: 'text' | 'command'; content: string }> = []
  let remaining = text
  let position = 0

  while (position < remaining.length) {
    let foundCommand = false

    for (const cmd of STRUCTURAL_COMMANDS) {
      const regex = new RegExp(`\\b${cmd}\\b`, 'i')
      const match = remaining.slice(position).match(regex)

      if (match && match.index !== undefined) {
        const matchPosition = position + match.index

        // Adicionar texto antes do comando
        if (matchPosition > position) {
          const textBefore = remaining.slice(position, matchPosition)
          if (textBefore.trim()) {
            segments.push({ type: 'text', content: textBefore.trim() })
          }
        }

        // Adicionar comando
        segments.push({ type: 'command', content: cmd })
        position = matchPosition + cmd.length
        foundCommand = true
        break
      }
    }

    if (!foundCommand) {
      // Adicionar resto do texto
      const textRest = remaining.slice(position)
      if (textRest.trim()) {
        segments.push({ type: 'text', content: textRest.trim() })
      }
      break
    }
  }

  return segments
}

/**
 * Substitui comandos de pontuação por símbolos
 */
export function replacePunctuationCommands(text: string): string {
  let result = text

  for (const { pattern, replacement } of PUNCTUATION_COMMANDS) {
    const regex = new RegExp(`\\b${pattern}\\b`, 'gi')
    regex.lastIndex = 0
    result = result.replace(regex, replacement)
  }

  return normalizeSpacing(result)
}

/**
 * Deleta última palavra no editor
 */
export function deleteLastWord(editor: Editor): void {
  const { state } = editor
  const { from } = state.selection
  const textBefore = state.doc.textBetween(0, from, ' ', ' ')
  
  const words = textBefore.trim().split(/\s+/)
  if (words.length === 0) return
  
  const lastWord = words[words.length - 1]
  const deleteFrom = from - lastWord.length
  
  editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run()
}

/**
 * Processa entrada de voz com comandos estruturais e pontuação
 */
export function processVoiceInput(text: string, editor: Editor): void {
  if (!text.trim()) return

  const lower = text.toLowerCase()

  // Comandos de edição
  if (lower.includes('apagar isso')) {
    deleteLastWord(editor)
    return
  }
  if (lower.includes('desfazer') || lower.includes('desfaz')) {
    editor.commands.undo()
    return
  }
  if (lower.includes('refazer')) {
    editor.commands.redo()
    return
  }

  // Dividir por comandos estruturais
  const segments = splitByStructuralCommands(text)
  
  for (const segment of segments) {
    if (segment.type === 'command') {
      // Executar comando estrutural
      const cmd = segment.content.toLowerCase()
      if (cmd === 'nova linha' || cmd === 'próxima linha' || cmd === 'linha') {
        editor.commands.setHardBreak()
      } else if (cmd === 'novo parágrafo' || cmd === 'próximo parágrafo' || cmd === 'parágrafo') {
        editor.chain().focus().insertContent('.</p><p>').run()
      }
    } else {
      // Processar texto com pontuação
      let processedText = replacePunctuationCommands(segment.content)
      
      // Aplicar capitalização se necessário
      const currentPos = editor.state.selection.from
      const docText = editor.state.doc.textBetween(0, currentPos, ' ', ' ')
      if (shouldCapitalizeNext(docText, currentPos)) {
        processedText = applyCapitalization(processedText)
      }
      
      // Inserir texto
      editor.commands.insertContent(processedText + ' ')
    }
  }
}
