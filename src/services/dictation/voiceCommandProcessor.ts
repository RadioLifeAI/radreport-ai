import { Editor } from '@tiptap/react'
import { applyCapitalization, shouldCapitalizeNext, normalizeSpacing } from '@/utils/textFormatter'
import { processMedicalText } from '@/utils/medicalTextProcessor'

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
  { pattern: 'abrir parênteses', replacement: '(' },
  { pattern: 'parênteses abre', replacement: '(' },
  { pattern: 'fecha parênteses', replacement: ')' },
  { pattern: 'fechar parênteses', replacement: ')' },
  { pattern: 'parênteses fecha', replacement: ')' },
  { pattern: 'hífen', replacement: '-' },
  { pattern: 'travessão', replacement: '—' },
  { pattern: 'a crase', replacement: 'à' },
  { pattern: 'crase', replacement: 'à' },
  { pattern: 'barra', replacement: '/' },
  { pattern: 'aspas', replacement: '"' },
  { pattern: 'interrogação', replacement: '?' },
  { pattern: 'exclamação', replacement: '!' },
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
  'apagar palavra',
  'apagar',
  'apagar linha',
  'apagar tudo',
  'desfazer',
  'desfaz',
  'refazer',
  'cancelar',
]

/**
 * Comandos de formatação
 */
const FORMATTING_COMMANDS = [
  'negrito',
  'itálico',
  'sublinhado',
  'remover formatação',
  'limpar formatação',
  'alinhar esquerda',
  'alinhar centro',
  'centralizar',
  'alinhar direita',
  'alinhar justificado',
  'justificar',
  'tudo maiúsculo',
  'maiúsculas',
  'caixa alta',
  'tudo minúsculo',
  'minúsculas',
  'caixa baixa',
  'lista',
  'lista numerada',
]

/**
 * Comandos de navegação
 */
const NAVIGATION_COMMANDS = [
  'próximo campo',
  'ir para início',
  'início',
  'ir para fim',
  'fim',
  'selecionar tudo',
  'procurar',
]

/**
 * Comandos especiais
 */
const SPECIAL_COMMANDS = [
  'inserir data',
  'data atual',
  'hoje',
  'inserir hora',
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
 * Deleta a linha atual no editor
 */
export function deleteCurrentLine(editor: Editor): void {
  editor.chain().focus().selectParentNode().deleteSelection().run()
}

/**
 * Navega para o próximo campo/marcador <>
 */
export function goToNextField(editor: Editor): boolean {
  const content = editor.state.doc.textContent
  const currentPos = editor.state.selection.from
  
  // Busca padrões de campo: <>, <texto>, [texto], ___
  const fieldPatterns = [/<[^>]*>/g, /\[[^\]]*\]/g, /_{3,}/g]
  
  for (const pattern of fieldPatterns) {
    let match
    pattern.lastIndex = 0
    while ((match = pattern.exec(content)) !== null) {
      if (match.index > currentPos) {
        // Encontrou próximo campo, seleciona-o
        editor.chain().focus().setTextSelection({
          from: match.index + 1,
          to: match.index + match[0].length + 1
        }).run()
        return true
      }
    }
  }
  return false
}

/**
 * Busca texto no documento
 */
export function searchText(editor: Editor, searchTerm: string): boolean {
  const content = editor.state.doc.textContent.toLowerCase()
  const index = content.indexOf(searchTerm.toLowerCase())
  
  if (index !== -1) {
    editor.chain().focus().setTextSelection({
      from: index + 1,
      to: index + searchTerm.length + 1
    }).run()
    return true
  }
  return false
}

/**
 * Transforma texto selecionado para maiúsculas
 */
export function transformToUppercase(editor: Editor): void {
  const { from, to } = editor.state.selection
  if (from === to) return
  
  const text = editor.state.doc.textBetween(from, to)
  editor.chain().focus().deleteSelection().insertContent(text.toUpperCase()).run()
}

/**
 * Transforma texto selecionado para minúsculas
 */
export function transformToLowercase(editor: Editor): void {
  const { from, to } = editor.state.selection
  if (from === to) return
  
  const text = editor.state.doc.textBetween(from, to)
  editor.chain().focus().deleteSelection().insertContent(text.toLowerCase()).run()
}

/**
 * Processa comandos de formatação
 */
export function processFormattingCommand(text: string, editor: Editor): boolean {
  const lower = text.toLowerCase().trim()
  
  // Negrito
  if (lower === 'negrito') {
    editor.chain().focus().toggleBold().run()
    return true
  }
  
  // Itálico
  if (lower === 'itálico') {
    editor.chain().focus().toggleItalic().run()
    return true
  }
  
  // Sublinhado
  if (lower === 'sublinhado') {
    editor.chain().focus().toggleUnderline().run()
    return true
  }
  
  // Remover formatação
  if (lower === 'remover formatação' || lower === 'limpar formatação') {
    editor.chain().focus().unsetAllMarks().run()
    return true
  }
  
  // Alinhamentos
  if (lower === 'alinhar esquerda') {
    editor.chain().focus().setTextAlign('left').run()
    return true
  }
  if (lower === 'alinhar centro' || lower === 'centralizar') {
    editor.chain().focus().setTextAlign('center').run()
    return true
  }
  if (lower === 'alinhar direita') {
    editor.chain().focus().setTextAlign('right').run()
    return true
  }
  if (lower === 'alinhar justificado' || lower === 'justificar') {
    editor.chain().focus().setTextAlign('justify').run()
    return true
  }
  
  // Maiúsculas/Minúsculas
  if (lower === 'tudo maiúsculo' || lower === 'maiúsculas' || lower === 'caixa alta') {
    transformToUppercase(editor)
    return true
  }
  if (lower === 'tudo minúsculo' || lower === 'minúsculas' || lower === 'caixa baixa') {
    transformToLowercase(editor)
    return true
  }
  
  // Listas
  if (lower === 'lista') {
    editor.chain().focus().toggleBulletList().run()
    return true
  }
  if (lower === 'lista numerada') {
    editor.chain().focus().toggleOrderedList().run()
    return true
  }
  
  return false
}

/**
 * Processa comandos de navegação
 */
export function processNavigationCommand(text: string, editor: Editor): boolean {
  const lower = text.toLowerCase().trim()
  
  if (lower === 'próximo campo') {
    goToNextField(editor)
    return true
  }
  
  if (lower === 'ir para início' || lower === 'início') {
    editor.chain().focus().setTextSelection(0).run()
    return true
  }
  
  if (lower === 'ir para fim' || lower === 'fim') {
    const endPos = editor.state.doc.content.size
    editor.chain().focus().setTextSelection(endPos).run()
    return true
  }
  
  if (lower === 'selecionar tudo') {
    editor.chain().focus().selectAll().run()
    return true
  }
  
  // Procurar texto (formato: "procurar [termo]")
  if (lower.startsWith('procurar ')) {
    const searchTerm = text.slice(9).trim()
    if (searchTerm) {
      searchText(editor, searchTerm)
    }
    return true
  }
  
  return false
}

/**
 * Processa comandos especiais
 */
export function processSpecialCommand(text: string, editor: Editor): boolean {
  const lower = text.toLowerCase().trim()
  
  // Inserir data
  if (lower === 'inserir data' || lower === 'data atual' || lower === 'hoje') {
    const today = new Date().toLocaleDateString('pt-BR')
    editor.chain().focus().insertContent(today + ' ').run()
    return true
  }
  
  // Inserir hora
  if (lower === 'inserir hora') {
    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    editor.chain().focus().insertContent(now + ' ').run()
    return true
  }
  
  return false
}

/**
 * Verifica se o texto é um comando puro (sem texto adicional)
 */
export function isPureCommand(text: string): boolean {
  const lower = text.toLowerCase().trim()
  
  const allCommands = [
    ...EDITING_COMMANDS,
    ...FORMATTING_COMMANDS,
    ...NAVIGATION_COMMANDS.filter(c => c !== 'procurar'),
    ...SPECIAL_COMMANDS,
  ]
  
  return allCommands.some(cmd => lower === cmd)
}

/**
 * Processa entrada de voz com Voice Command Engine + fallback
 * FASE 2: Integração com novo engine
 */
export async function processVoiceInputWithEngine(text: string, editor: Editor): Promise<boolean> {
  if (!text.trim()) return false

  try {
    // Tentar processar via Voice Command Engine primeiro
    const { getVoiceEngine } = await import('@/lib/voiceEngine')
    const engine = getVoiceEngine()
    
    if (engine.getState().isReady) {
      const result = await engine.processTranscript(text)
      if (result && result.score < 0.5) {
        // Comando encontrado com boa confiança
        console.log('🎯 Voice Engine executou:', result.command.name, `(score: ${result.score.toFixed(2)})`)
        return true
      }
    }
  } catch (err) {
    console.warn('⚠️ Voice Engine falhou, usando fallback:', err)
  }
  
  // Fallback: processamento tradicional
  processVoiceInput(text, editor)
  return false
}

/**
 * Processa entrada de voz com comandos estruturais e pontuação (fallback)
 */
export function processVoiceInput(text: string, editor: Editor): void {
  if (!text.trim()) return

  const lower = text.toLowerCase().trim()

  // 1. Comandos de edição (alta prioridade)
  if (lower.includes('apagar isso') || lower === 'apagar' || lower === 'apagar palavra') {
    deleteLastWord(editor)
    return
  }
  if (lower === 'apagar linha') {
    deleteCurrentLine(editor)
    return
  }
  if (lower === 'apagar tudo') {
    editor.chain().focus().clearContent().run()
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

  // 2. Comandos de formatação (se é comando puro)
  if (processFormattingCommand(lower, editor)) {
    return
  }

  // 3. Comandos de navegação
  if (processNavigationCommand(text, editor)) {
    return
  }

  // 4. Comandos especiais
  if (processSpecialCommand(lower, editor)) {
    return
  }

  // 5. Dividir por comandos estruturais (nova linha, parágrafo)
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
      // 6. Processar texto com pontuação
      let processedText = replacePunctuationCommands(segment.content)
      
      // Aplicar correções médicas
      processedText = processMedicalText(processedText)
      
      // Aplicar capitalização se necessário
      const currentPos = editor.state.selection.from
      const docText = editor.state.doc.textBetween(0, currentPos, ' ', ' ')
      if (shouldCapitalizeNext(docText, currentPos)) {
        processedText = applyCapitalization(processedText)
      }
      
      // Inserir texto com cor de ditado
      const insertPos = editor.state.selection.from
      const textWithSpace = processedText + ' '
      
      editor.chain()
        .focus()
        .insertContent(textWithSpace)
        .setTextSelection({ from: insertPos, to: insertPos + textWithSpace.length })
        .setColor('var(--highlight-dictation)')
        .setTextSelection(insertPos + textWithSpace.length)
        .run()
    }
  }
}

/**
 * Extrai comandos de voz do texto para processamento separado
 */
export function extractVoiceCommands(text: string): { text: string; commands: string[] } {
  const commands: string[] = []
  let processedText = text
  
  // Extrair comandos de formatação
  for (const cmd of FORMATTING_COMMANDS) {
    const regex = new RegExp(`\\b${cmd}\\b`, 'gi')
    if (regex.test(processedText)) {
      commands.push(cmd)
      processedText = processedText.replace(regex, '').trim()
    }
  }
  
  return { text: processedText, commands }
}
