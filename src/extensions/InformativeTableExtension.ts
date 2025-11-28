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
  
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          'data-informative-table': '',
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
      
      // Container da tabela com estilos preservados (sem header redundante)
      const tableContainer = document.createElement('div')
      tableContainer.className = 'informative-table-content rounded-lg p-4 shadow-sm'
      tableContainer.innerHTML = node.attrs.htmlContent
      
      dom.appendChild(tableContainer)
      
      return {
        dom,
        contentDOM: null, // Não permite edição de conteúdo
      }
    }
  },
})
