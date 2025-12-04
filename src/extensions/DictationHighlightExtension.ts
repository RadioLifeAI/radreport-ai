import { Mark } from '@tiptap/core'

export type HighlightSource = 'dictation' | 'ai-corrector' | 'ai-suggestion' | 'whisper'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dictationHighlight: {
      /**
       * Set a dictation highlight mark
       */
      setDictationHighlight: (attributes?: { source?: HighlightSource; timestamp?: number }) => ReturnType
      /**
       * Toggle a dictation highlight mark
       */
      toggleDictationHighlight: (attributes?: { source?: HighlightSource; timestamp?: number }) => ReturnType
      /**
       * Unset a dictation highlight mark
       */
      unsetDictationHighlight: () => ReturnType
      /**
       * Clear all dictation highlights in document
       */
      clearAllDictationHighlights: () => ReturnType
    }
  }
}

export const DictationHighlight = Mark.create({
  name: 'dictationHighlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      source: {
        default: 'dictation',
        parseHTML: element => element.getAttribute('data-source') || 'dictation',
        renderHTML: attributes => ({
          'data-source': attributes.source,
        }),
      },
      timestamp: {
        default: null,
        parseHTML: element => {
          const ts = element.getAttribute('data-timestamp')
          return ts ? parseInt(ts, 10) : null
        },
        renderHTML: attributes => {
          if (!attributes.timestamp) return {}
          return {
            'data-timestamp': attributes.timestamp.toString(),
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'mark[data-source]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const source = HTMLAttributes['data-source'] || 'dictation'
    return [
      'mark',
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        class: `dictation-highlight dictation-highlight-${source}`,
      },
      0,
    ]
  },

  addCommands() {
    return {
      setDictationHighlight:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            source: attributes?.source || 'dictation',
            timestamp: attributes?.timestamp || Date.now(),
          })
        },
      toggleDictationHighlight:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, {
            source: attributes?.source || 'dictation',
            timestamp: attributes?.timestamp || Date.now(),
          })
        },
      unsetDictationHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      clearAllDictationHighlights:
        () =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            const { doc } = tr
            doc.descendants((node, pos) => {
              if (node.isText) {
                const marks = node.marks.filter(mark => mark.type.name === this.name)
                marks.forEach(mark => {
                  tr.removeMark(pos, pos + node.nodeSize, mark.type)
                })
              }
            })
          }
          return true
        },
    }
  },
})

export default DictationHighlight
