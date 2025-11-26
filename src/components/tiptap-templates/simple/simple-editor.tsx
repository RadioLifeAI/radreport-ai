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
import { RadiologySpellChecker, FontSize } from "@/extensions"

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
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
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
    ],
    content: externalContent || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
      if (onCharacterCount) {
        const text = editor.state.doc.textContent
        onCharacterCount(text.length)
      }
    },
    onCreate: ({ editor }) => {
      if (onEditorReady) {
        onEditorReady(editor)
      }
    },
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

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
      </EditorContext.Provider>
    </div>
  )
}
