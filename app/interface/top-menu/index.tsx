"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLocalStorage } from "usehooks-ts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useStore } from "@/app/store"
import { PresetName, defaultPreset } from "@/app/engine/presets"
import { useIsBusy } from "@/lib/useIsBusy"
import { getLocalStorageShowSpeeches } from "@/lib/getLocalStorageShowSpeeches"

export function TopMenu() {
  const searchParams = useSearchParams()

  const requestedPreset = (searchParams?.get('preset') as PresetName) || defaultPreset
  const requestedStylePrompt = (searchParams?.get('stylePrompt') as string) || ""
  const requestedStoryPrompt = (searchParams?.get('storyPrompt') as string) || ""

  const preset = useStore(s => s.preset)
  const prompt = useStore(s => s.prompt)
  const setShowSpeeches = useStore(s => s.setShowSpeeches)
  const setShowCaptions = useStore(s => s.setShowCaptions)
  const generate = useStore(s => s.generate)
  const isBusy = useIsBusy()

  const [lastDraftPromptA, setLastDraftPromptA] = useLocalStorage<string>(
    "AI_COMIC_FACTORY_LAST_DRAFT_PROMPT_A",
    requestedStylePrompt
  )
  const [lastDraftPromptB, setLastDraftPromptB] = useLocalStorage<string>(
    "AI_COMIC_FACTORY_LAST_DRAFT_PROMPT_B",
    requestedStoryPrompt
  )

  const [draftPromptA, setDraftPromptA] = useState(lastDraftPromptA)
  const [draftPromptB, setDraftPromptB] = useState(lastDraftPromptB)
  const draftPrompt = `${draftPromptA}||${draftPromptB}`

  const [draftPreset, setDraftPreset] = useState<PresetName>(requestedPreset)

  useEffect(() => {
    setShowSpeeches(getLocalStorageShowSpeeches(true))
    setShowCaptions(true)  // 默认显示字幕
  }, [setShowSpeeches, setShowCaptions])

  useEffect(() => { 
    if (lastDraftPromptA !== draftPromptA) { 
      setLastDraftPromptA(draftPromptA) 
    } 
  }, [draftPromptA, lastDraftPromptA, setLastDraftPromptA])
  
  useEffect(() => { 
    if (lastDraftPromptB !== draftPromptB) { 
      setLastDraftPromptB(draftPromptB) 
    } 
  }, [draftPromptB, lastDraftPromptB, setLastDraftPromptB])

  const handleSubmit = () => {
    const promptChanged = draftPrompt.trim() !== prompt.trim()
    const presetChanged = draftPreset !== preset.id
    if (!isBusy && (promptChanged || presetChanged)) {
      generate(draftPrompt,draftPreset)
    }
  }

  const changeModel = (style:string) => {
    setDraftPreset(style);
    handleSubmit()
  }
  // useEffect(() => {
  //   const layoutChanged = draftLayout !== layout
  //   if (layoutChanged && !isBusy) {
  //     setLayout(draftLayout)
  //   }
  // }, [layout, draftLayout, isBusy, setLayout])

  return (
    <div className="print:hidden z-10 fixed top-0 left-0 right-0 flex flex-col md:flex-row w-full justify-between items-center backdrop-blur-xl transition-all duration-200 ease-in-out px-2 py-2 border-b-1 border-gray-50 dark:border-gray-50 bg-gradient-to-r from-[#102c4c] to-[#1a426f] dark:bg-gradient-to-r dark:from-[#102c4c] dark:to-[#1a426f] space-y-2 md:space-y-0 md:space-x-3 lg:space-x-6">
      <div className="transition-all duration-200 ease-in-out flex flex-grow flex-col space-y-2 md:space-y-0 md:flex-row items-center md:space-x-3 w-full md:w-auto">
        <div className="flex flex-row flex-grow w-full">
          <div className="flex flex-row flex-grow w-full">
            <Input
              id="top-menu-input-story-prompt"
              placeholder="1. Story (eg. detective dog)"
              className="w-1/2 rounded-r-none bg-gray-100 text-gray-700 dark:bg-gray-100 dark:text-gray-700 border-r-stone-100"
              onChange={(e) => {
                setDraftPromptB(e.target.value)
              }}
              onKeyDown={({ key }) => {
                if (key === 'Enter') {
                  handleSubmit()
                }
              }}
              value={draftPromptB}
            />
            <Input
              id="top-menu-input-style-prompt"
              placeholder="2. Style (eg 'rain, shiba')"
              className="w-1/2 bg-gray-100 text-gray-700 dark:bg-gray-100 dark:text-gray-700 border-l-gray-300 rounded-l-none rounded-r-none"
              onChange={(e) => {
                setDraftPromptA(e.target.value)
              }}
              onKeyDown={({ key }) => {
                if (key === 'Enter') {
                  handleSubmit()
                }
              }}
              value={draftPromptA}
            />
          </div>
          <div onClick={()=>{changeModel('eastern_fantasy')}} className="bg-slate-400 mx-2">西方玄幻</div>
          <div onClick={()=>{changeModel('western_fantasy')}} className="bg-slate-400 mx-2">东方玄幻</div>
          <div onClick={()=>{changeModel('science_fiction')}} className="bg-slate-400 mx-2">科学故事</div>
          <div onClick={()=>{changeModel('urban_superpower')}} className="bg-slate-400 mx-2">都市超级英雄</div>
          <div onClick={()=>{changeModel('urban_romance')}} className="bg-slate-400 mx-2">都市浪漫</div>
          <div onClick={()=>{changeModel('school_romance')}} className="bg-slate-400 mx-2">校园浪漫</div>
          <Button
            className="rounded-l-none cursor-pointer transition-all duration-200 ease-in-out text-xl bg-[rgb(59,134,247)] hover:bg-[rgb(69,144,255)] disabled:bg-[rgb(59,134,247)]"
            onClick={() => {
              changeModel('american_comic_50')
            }}
            disabled={!draftPrompt?.trim().length || isBusy}
          >
            Go
          </Button>
        </div>
      </div>
    </div>
  )
}
