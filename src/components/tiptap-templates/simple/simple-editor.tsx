"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import HardBreak from "@tiptap/extension-hard-break"
import Gapcursor from "@tiptap/extension-gapcursor"
import { TextStyle } from "@tiptap/extension-text-style"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import CharacterCount from "@tiptap/extension-character-count"
import { Color } from "@tiptap/extension-color"
import FontFamily from "@tiptap/extension-font-family"
import Dropcursor from "@tiptap/extension-dropcursor"
import Focus from "@tiptap/extension-focus"
import { RadiologySpellChecker, FontSize, InformativeTable } from "@/extensions"
import { setUserDictionaryWords } from "@/extensions/RadiologySpellChecker"
import { useUserDictionaryContext } from "@/contexts/UserDictionaryContext"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node Styles ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/components/tiptap-node/table-node/table-node.scss"

// --- Tiptap UI ---
import { 
  HeadingDropdownMenu,
  ImageUploadButton,
  ListDropdownMenu,
  BlockquoteButton,
  CodeBlockButton,
  ColorHighlightPopover,
  LinkPopover,
  MarkButton,
  TextAlignButton,
  UndoRedoButton,
  SpellcheckSuggestionsPopover,
  FontSizeButton,
  FontFamilyButton
} from "@/components/tiptap-ui"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

const MainToolbarContent = ({
  isMobile,
}: {
  isMobile: boolean
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu />
        <ListDropdownMenu />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <FontFamilyButton />
        <FontSizeButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton markType="bold" />
        <MarkButton markType="italic" />
        <MarkButton markType="strike" />
        <MarkButton markType="code" />
        <MarkButton markType="underline" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ColorHighlightPopover type="color" />
        <ColorHighlightPopover type="highlight" />
        <LinkPopover />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton alignment="left" />
        <TextAlignButton alignment="center" />
        <TextAlignButton alignment="right" />
        <TextAlignButton alignment="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

export interface SimpleEditorProps {
  content?: string
  onChange?: (content: string) => void
  onEditorReady?: (editor: any) => void
  onCharacterCount?: (count: number) => void
  placeholder?: string
  className?: string
}

export function SimpleEditor({ 
  content: externalContent, 
  onChange,
  onEditorReady,
  onCharacterCount,
  placeholder = "Start typing...",
  className
}: SimpleEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const toolbarRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
      shouldRerenderOnTransaction: false, // 🆕 FASE 7: Otimização - evitar re-renders
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          spellcheck: "false",
          "aria-label": "Main content area, start typing to enter text.",
          class: "simple-editor",
        },
      },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Link.configure({ 
        autolink: true, 
        openOnClick: false, 
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      HardBreak.configure({ keepMarks: true }),
      Gapcursor,
      Placeholder.configure({ placeholder }),
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      FontFamily.configure({ types: ['textStyle'] }),
      FontSize,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Superscript,
      Subscript,
      RadiologySpellChecker,
      InformativeTable,  // ANTES de Table para garantir precedência
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'radiology-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      CharacterCount.configure({
        mode: 'textSize',
      }),
      Dropcursor.configure({
        color: '#0ea5e9',
        width: 2,
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
    ],
    content: externalContent || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
      if (onCharacterCount) {
        onCharacterCount(editor.storage.characterCount.characters())
      }
    },
    onCreate: ({ editor }) => {
      if (onEditorReady) {
        onEditorReady(editor)
      }
      // Reportar contagem inicial
      if (onCharacterCount) {
        onCharacterCount(editor.storage.characterCount.characters())
      }
    },
  })

  // Ref para controlar atualizações e evitar loops
  const isUpdatingFromExternal = useRef(false)

  // Função helper para normalizar HTML e evitar falsos positivos
  const normalizeHTML = (html: string): string => {
    return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()
  }

  // Sincronizar conteúdo externo com o editor
  useEffect(() => {
    if (editor && externalContent !== undefined) {
      // Evitar loop de atualização
      if (isUpdatingFromExternal.current) return
      
      const currentContent = editor.getHTML()
      
      // Comparação normalizada para evitar falsos positivos
      if (normalizeHTML(currentContent) !== normalizeHTML(externalContent)) {
        isUpdatingFromExternal.current = true
        
        // Salvar posição do cursor
        const { from } = editor.state.selection
        
        editor.commands.setContent(externalContent, { 
          emitUpdate: false,
          parseOptions: {
            preserveWhitespace: 'full',
          },
        })
        
        // Tentar restaurar posição do cursor
        const maxPos = editor.state.doc.content.size
        const safePos = Math.min(from, maxPos)
        editor.commands.setTextSelection(safePos)
        
        // Atualizar contagem após sincronização externa
        if (onCharacterCount) {
          onCharacterCount(editor.storage.characterCount.characters())
        }
        
        // Resetar flag após atualização
        isUpdatingFromExternal.current = false
      }
    }
  }, [editor, externalContent, onCharacterCount])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  // Sync user dictionary words with spellchecker
  const { words: userDictionaryWords } = useUserDictionaryContext()
  
  useEffect(() => {
    setUserDictionaryWords(userDictionaryWords)
    // Force re-check spell if editor exists
    if (editor) {
      const html = editor.getHTML()
      editor.commands.setContent(html)
    }
  }, [userDictionaryWords, editor])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          <MainToolbarContent isMobile={isMobile} />
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
        
        {editor && <SpellcheckSuggestionsPopover editor={editor} />}
      </EditorContext.Provider>
    </div>
  )
}
