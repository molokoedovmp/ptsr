"use client"

import { useState, useEffect, useRef } from "react"
import { useCreateBlockNote } from "@blocknote/react"
import { ru } from "@blocknote/core/locales"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

interface Props {
  initialContent?: string | null
  onChange?: (content: string) => void
  placeholder?: string
}

export default function BlockNoteEditor({ initialContent, onChange, placeholder }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  const initialBlocks = () => {
    if (!initialContent) return undefined
    try {
      return JSON.parse(initialContent)
    } catch {
      return undefined
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useCreateBlockNote({
    initialContent: initialBlocks(),
    dictionary: ru,
    uploadFile: async (file: File) => {
      return URL.createObjectURL(file)
    }
  })

  const handleChange = () => {
    if (!editor || !onChange) return
    try {
      const content = JSON.stringify((editor as any).document)
      onChange(content)
    } catch (error) {
      console.error('Error serializing content:', error)
    }
  }

  if (!isMounted) {
    return (
      <div className="flex h-96 items-center justify-center border border-slate-200 rounded-xl bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal"></div>
          <p className="text-slate-600 text-sm">Загрузка редактора...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={handleChange}
        className="min-h-[500px]"
        data-testid="blocknote-editor"
      />
    </div>
  )
}

