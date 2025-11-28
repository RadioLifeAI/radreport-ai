import { Node, mergeAttributes } from '@tiptap/core'

export interface InformativeTableOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    informativeTable: {
      /**
       * Insert an informative (non-editable) table
       */
      insertInformativeTable: (attrs: {
        tableId: string
        tableName: string
        htmlContent: string
      }) => ReturnType
    }
  }
}

export const InformativeTable = Node.create<InformativeTableOptions>({
  name: 'informativeTable',
  
  group: 'block',
  
  atom: true,
  selectable: true,    // Permite selecionar o bloco para deletar
  draggable: false,    // Não permite arrastar
  isolating: true,     // Isola do resto do documento, previne edição interna
  
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  
  addAttributes() {
    return {
      tableId: {
        default: null,
        parseHTML: element => element.getAttribute('data-table-id'),
        renderHTML: attributes => ({
          'data-table-id': attributes.tableId,
        }),
      },
      tableName: {
        default: null,
        parseHTML: element => element.getAttribute('data-table-name'),
        renderHTML: attributes => ({
          'data-table-name': attributes.tableName,
        }),
      },
      htmlContent: {
        default: '',
        parseHTML: element => {
          // Tentar decodificar Base64 primeiro
          const encoded = element.getAttribute('data-html-content')
          if (encoded) {
            try {
              return decodeURIComponent(atob(encoded))
            } catch {
              // Fallback para formato antigo (não Base64)
              return encoded
            }
          }
          // Fallback para formato legado (dentro do container)
          const container = element.querySelector('.informative-table-content')
          return container?.innerHTML || ''
        },
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-informative-table]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes, node }) {
    // Codificar HTML em Base64 para evitar problemas com aspas duplas
    const encodedContent = btoa(encodeURIComponent(node.attrs.htmlContent || ''))
    
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          'data-informative-table': '',
          'data-html-content': encodedContent,
          'contenteditable': 'false',
          class: 'informative-table-block',
        }
      ),
    ]
  },
  
  addCommands() {
    return {
      insertInformativeTable:
        attrs =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          })
        },
    }
  },
  
  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div')
      dom.className = 'informative-table-block border-2 border-dashed border-cyan-500/30 rounded-lg p-4 my-4 bg-white'
      dom.setAttribute('contenteditable', 'false')
      dom.setAttribute('data-informative-table', '')
      dom.setAttribute('data-table-id', node.attrs.tableId)
      dom.setAttribute('data-table-name', node.attrs.tableName)
      
      // Header com nome da tabela e ícone
      const header = document.createElement('div')
      header.className = 'flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 font-medium mb-3 pb-2 border-b border-cyan-500/20'
      header.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Tabela de Referência: ${node.attrs.tableName}</span>
      `
      
      // Container da tabela com estilos preservados
      const tableContainer = document.createElement('div')
      tableContainer.className = 'informative-table-content rounded-lg p-4 shadow-sm'
      tableContainer.innerHTML = node.attrs.htmlContent
      
      dom.appendChild(header)
      dom.appendChild(tableContainer)
      
      return {
        dom,
        contentDOM: null, // Não permite edição de conteúdo
      }
    }
  },
})
