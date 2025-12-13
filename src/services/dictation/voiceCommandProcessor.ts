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
  { pattern: 'barra normal', replacement: '/' },
  { pattern: 'abre aspas', replacement: '"' },
  { pattern: 'fecha aspas', replacement: '"' },
]

/**
 * Comandos estruturais - SEGUROS (2+ palavras)
 */
const STRUCTURAL_COMMANDS = [
  'nova linha',
  'próxima linha',
  'quebra de linha',
  'novo parágrafo',
  'próximo parágrafo',
  'pular parágrafo',
]

/**
 * Comandos de edição - SEGUROS (2+ palavras)
 */
const EDITING_COMMANDS = [
  'apagar isso',
  'apagar palavra',
  'apagar linha',
  'apagar tudo',
  'desfazer',
  'desfaz',
  'refazer',
  'cancelar ditado',
]

/**
 * Comandos de formatação - SEGUROS (exigir 2+ palavras)
 */
const FORMATTING_COMMANDS = [
  'texto negrito',
  'texto itálico',
  'texto sublinhado',
  'remover formatação',
  'limpar formatação',
  'alinhar à esquerda',
  'alinhar esquerda',
  'alinhar centro',
  'centralizar texto',
  'alinhar à direita',
  'alinhar direita',
  'texto justificado',
  'justificar texto',
  'tudo maiúsculo',
  'letras maiúsculas',
  'caixa alta',
  'tudo minúsculo',
  'letras minúsculas',
  'caixa baixa',
  'criar lista',
  'lista numerada',
]

/**
 * Comandos de navegação - SEGUROS (exigir 2+ palavras)
 */
const NAVIGATION_COMMANDS = [
  'próximo campo',
  'campo anterior',
  'ir para início',
  'ir para fim',
  'ir para conclusão',
  'ir para impressão',
  'ir para técnica',
  'ir para relatório',
  'selecionar tudo',
]

/**
 * Comandos especiais
 */
const SPECIAL_COMMANDS = [
  'inserir data',
  'data atual',
  'data de hoje',
  'inserir hora',
  'hora atual',
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
 * Processa comandos de formatação - exigir frases completas
 */
export function processFormattingCommand(text: string, editor: Editor): boolean {
  const lower = text.toLowerCase().trim()
  
  // Negrito
  if (lower === 'texto negrito' || lower === 'formatação negrito' || lower === 'aplicar negrito') {
    editor.chain().focus().toggleBold().run()
    return true
  }
  
  // Itálico
  if (lower === 'texto itálico' || lower === 'formatação itálico' || lower === 'aplicar itálico') {
    editor.chain().focus().toggleItalic().run()
    return true
  }
  
  // Sublinhado
  if (lower === 'texto sublinhado' || lower === 'sublinhar texto' || lower === 'aplicar sublinhado') {
    editor.chain().focus().toggleUnderline().run()
    return true
  }
  
  // Remover formatação
  if (lower === 'remover formatação' || lower === 'limpar formatação') {
    editor.chain().focus().unsetAllMarks().run()
    return true
  }
  
  // Alinhamentos - exigir frases completas
  if (lower === 'alinhar à esquerda' || lower === 'alinhar esquerda' || lower === 'texto à esquerda') {
    editor.chain().focus().setTextAlign('left').run()
    return true
  }
  if (lower === 'alinhar centro' || lower === 'centralizar texto' || lower === 'texto centralizado') {
    editor.chain().focus().setTextAlign('center').run()
    return true
  }
  if (lower === 'alinhar à direita' || lower === 'alinhar direita' || lower === 'texto à direita') {
    editor.chain().focus().setTextAlign('right').run()
    return true
  }
  if (lower === 'texto justificado' || lower === 'justificar texto' || lower === 'alinhar justificado') {
    editor.chain().focus().setTextAlign('justify').run()
    return true
  }
  
  // Maiúsculas/Minúsculas
  if (lower === 'tudo maiúsculo' || lower === 'letras maiúsculas' || lower === 'caixa alta') {
    transformToUppercase(editor)
    return true
  }
  if (lower === 'tudo minúsculo' || lower === 'letras minúsculas' || lower === 'caixa baixa') {
    transformToLowercase(editor)
    return true
  }
  
  // Listas
  if (lower === 'criar lista' || lower === 'lista com marcadores' || lower === 'inserir lista') {
    editor.chain().focus().toggleBulletList().run()
    return true
  }
  if (lower === 'lista numerada' || lower === 'lista ordenada' || lower === 'criar lista numerada') {
    editor.chain().focus().toggleOrderedList().run()
    return true
  }
  
  return false
}

/**
 * Processa comandos de navegação - exigir frases completas
 */
/**
 * Navega para uma seção do documento pelo nome do heading
 */
export function goToSectionByName(editor: Editor, sectionName: string): boolean {
  const doc = editor.state.doc;
  const normalizedName = sectionName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  let targetPos = -1;
  
  // Iterar sobre todos os nós do documento usando ProseMirror
  doc.descendants((node, pos) => {
    // Verificar se é um heading (h1-h6)
    if (node.type.name === 'heading' && targetPos === -1) {
      const text = node.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      // Verificar se o heading contém o nome da seção
      if (text.includes(normalizedName)) {
        // Posicionar APÓS o heading (início do conteúdo da seção)
        targetPos = pos + node.nodeSize;
        return false; // Parar iteração
      }
    }
    return true; // Continuar iteração
  });
  
  if (targetPos > 0) {
    editor.chain().focus().setTextSelection(targetPos).run();
    return true;
  }
  return false;
}

/**
 * Processa comandos de navegação - exigir frases completas
 */
export function processNavigationCommand(text: string, editor: Editor): boolean {
  const lower = text.toLowerCase().trim()
  
  if (lower === 'próximo campo' || lower === 'campo seguinte') {
    goToNextField(editor)
    return true
  }
  
  if (lower === 'campo anterior' || lower === 'voltar campo') {
    // TODO: Implementar navegação reversa
    return true
  }
  
  if (lower === 'ir para início' || lower === 'ir para o início' || lower === 'início do documento') {
    editor.chain().focus().setTextSelection(0).run()
    return true
  }
  
  if (lower === 'ir para fim' || lower === 'ir para o fim' || lower === 'fim do documento' || lower === 'ir para final') {
    const endPos = editor.state.doc.content.size
    editor.chain().focus().setTextSelection(endPos).run()
    return true
  }
  
  if (lower === 'selecionar tudo') {
    editor.chain().focus().selectAll().run()
    return true
  }
  
  // === Navegação para Seções ===
  if (lower === 'ir para impressão' || lower === 'ir para conclusão' || lower === 'seção impressão' || lower === 'seção conclusão') {
    goToSectionByName(editor, 'impressao')
    return true
  }
  
  if (lower === 'ir para técnica' || lower === 'seção técnica') {
    goToSectionByName(editor, 'tecnica')
    return true
  }
  
  if (lower === 'ir para relatório' || lower === 'ir para achados' || lower === 'seção relatório' || lower === 'seção achados') {
    // Tentar RELATÓRIO primeiro, depois ACHADOS
    if (!goToSectionByName(editor, 'relatorio')) {
      goToSectionByName(editor, 'achados')
    }
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
  if (lower === 'inserir data' || lower === 'data atual' || lower === 'data de hoje') {
    const today = new Date().toLocaleDateString('pt-BR')
    editor.chain().focus().insertContent(today + ' ').run()
    return true
  }
  
  // Inserir hora
  if (lower === 'inserir hora' || lower === 'hora atual') {
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
    ...NAVIGATION_COMMANDS,
    ...SPECIAL_COMMANDS,
  ]
  
  return allCommands.some(cmd => lower === cmd)
}

/**
 * Processa entrada de voz com Voice Command Engine + validação de segurança
 * FASE 2+4: Integração com engine + proteção anti-colisão
 */
export async function processVoiceInputWithEngine(text: string, editor: Editor): Promise<boolean> {
  if (!text.trim()) return false

  try {
    // Importar módulos de segurança
    const { getVoiceEngine } = await import('@/lib/voiceEngine')
    const { getRecommendedAction } = await import('@/modules/voice-command-engine/safetyGuard')
    const { detectIntent } = await import('@/modules/voice-command-engine')
    
    const engine = getVoiceEngine()
    
    if (engine.getState().isReady) {
      // CRÍTICO: Detectar intent ANTES de processar
      // Se é TEMPLATE ou FRASE, a engine delega via callbacks
      // NÃO devemos inserir o texto do comando como fallback!
      const intent = detectIntent(text)
      
      if (intent.type === 'TEMPLATE' || intent.type === 'FRASE') {
        console.log(`📨 Delegando ${intent.type} para callback - NÃO inserir texto do comando`)
        await engine.processTranscript(text) // Chama callbacks registrados
        return true // ⬅️ IMPORTANTE: retorna TRUE para evitar fallback que inseriria o texto
      }
      
      // Para SYSTEM/TEXT, comportamento normal com validação de segurança
      const result = await engine.processTranscript(text)
      
      // Usar sistema de segurança para decidir ação
      const action = getRecommendedAction(result, text)
      
      if (action === 'execute' && result) {
        console.log(`✅ Comando seguro: "${result.command.name}" (score: ${result.score.toFixed(2)})`)
        return true
      } else if (action === 'insert_text') {
        console.log(`📝 Inserindo como texto: "${text.substring(0, 50)}..."`)
        // Fallback para processamento de texto
        processVoiceInput(text, editor)
        return false
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

  // 1. Comandos de edição (alta prioridade) - exigir frases completas
  if (lower === 'apagar isso' || lower === 'apagar palavra') {
    deleteLastWord(editor)
    return
  }
  if (lower === 'apagar linha') {
    deleteCurrentLine(editor)
    return
  }
  if (lower === 'apagar tudo' || lower === 'limpar tudo') {
    editor.chain().focus().clearContent().run()
    return
  }
  if (lower === 'desfazer' || lower === 'desfaz') {
    editor.commands.undo()
    return
  }
  if (lower === 'refazer') {
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
      if (cmd === 'nova linha' || cmd === 'próxima linha' || cmd === 'quebra de linha') {
        editor.commands.setHardBreak()
      } else if (cmd === 'novo parágrafo' || cmd === 'próximo parágrafo' || cmd === 'pular parágrafo') {
        editor.commands.splitBlock()
      }
    } else {
      // Inserir texto com pontuação processada
      let processedText = segment.content
      
      // Aplicar substituição de pontuação
      processedText = replacePunctuationCommands(processedText)
      
      // Processar texto médico
      processedText = processMedicalText(processedText)
      
      // Aplicar capitalização
      const docContent = editor.state.doc.textContent
      if (docContent.length === 0 || /[.!?]\s*$/.test(docContent)) {
        processedText = applyCapitalization(processedText)
      }
      
      // Inserir no editor
      if (processedText.trim()) {
        editor.chain().focus().insertContent(processedText + ' ').run()
      }
    }
  }
}
