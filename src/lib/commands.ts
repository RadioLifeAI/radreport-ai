import { MACROS } from './templates'

export type CommandResult = { 
  type: 'insert' | 'navigate' | 'style' | 'generate' | 'check' | 'template' | 
        'new-paragraph' | 'delete-word' | 'delete-line' | 'select-all' | 'insert-text' |
        'toggle-bullet-list' | 'toggle-ordered-list' | 'toggle-blockquote' | 'toggle-code-block' |
        'set-heading' | 'hard-break' | 'increase-indent' | 'decrease-indent' |
        'insert-link' | 'remove-link' | 'table-insert-row' | 'table-insert-column' |
        'table-delete-row' | 'table-delete-column' | 'table-merge-cells' |
        'newline' | 'clear_all' | 'undo' | 'redo' | 'newline' | 'new_paragraph' |
        'toggle_bold' | 'toggle_italic' | 'toggle_underline' | 'align_center' |
        'align_left' | 'align_right' | 'align_justify' | 'insert_section' |
        'apply_template' | 'insert_phrase' | 'ai_suggest' | 'ai_complete' |
        'ai_conclusion' | 'new_report' | 'save_report' | 'copy_report' |
        'print_report' | 'stop_listening' | 'start_listening';
  payload?: any 
}

export function parseCommand(input: string): CommandResult | null {
  const s = input.trim().toLowerCase()
  if (s.startsWith('inserir macro') || s.startsWith('macro ')) {
    const key = s.replace('inserir', '').replace('macro', '').trim()
    const macro = MACROS.find((m: any) => m.chave.toLowerCase().includes(key))
    if (macro) return { type: 'insert', payload: macro.texto }
  }
  if (s.startsWith('ir para')) {
    const section = s.replace('ir para', '').trim()
    return { type: 'navigate', payload: section }
  }
  if (s.startsWith('estilo')) {
    const style = s.replace('estilo', '').trim()
    return { type: 'style', payload: style }
  }
  if (s.includes('gerar conclusão')) return { type: 'generate', payload: 'conclusao' }
  if (s.includes('verificar consistência')) return { type: 'check' }
  return null
}