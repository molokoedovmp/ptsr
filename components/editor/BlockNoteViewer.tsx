"use client"

import { useState, useEffect } from "react"
import { useCreateBlockNote } from "@blocknote/react"
import { ru } from "@blocknote/core/locales"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

interface Props {
  content: string | null
}

export default function BlockNoteViewer({ content }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  const parseContent = (content: string | null) => {
    if (!content) return undefined
    try {
      return JSON.parse(content)
    } catch {
      return undefined
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useCreateBlockNote({
    initialContent: parseContent(content),
    dictionary: ru,
    editable: false,
  })

  // Обновляем содержимое редактора при изменении content
  useEffect(() => {
    if (editor && content) {
      const blocks = parseContent(content)
      if (blocks) {
        editor.replaceBlocks(editor.document, blocks)
      }
    }
  }, [content, editor])

  if (!isMounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal"></div>
      </div>
    )
  }

  return (
    <div className="prose prose-lg max-w-none">
      <BlockNoteView
        editor={editor}
        theme="light"
        editable={false}
        data-testid="blocknote-viewer"
      />
    </div>
  )
}

