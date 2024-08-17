"use client"

import { Suspense, useEffect, useRef, useState, useTransition } from "react"

import { cn } from "@/lib/utils"
import { GeneratedPanel } from "@/app/types"

import { useStore } from "./store"

import { TopMenu } from "./interface/top-menu"
import { getStoryContinuation } from "./queries/getStoryContinuation"
import { useLLMVendorConfig } from "@/lib/useLLMVendorConfig"

export default function Main() {
  const [_isPending, startTransition] = useTransition()

  const llmVendorConfig = useLLMVendorConfig()
  const isGeneratingStory = useStore((s: { isGeneratingStory: any }) => s.isGeneratingStory)
  const setGeneratingStory = useStore((s: { setGeneratingStory: any }) => s.setGeneratingStory)
  const preset = useStore((s: { preset: any }) => s.preset)
  const prompt = useStore((s: { prompt: any }) => s.prompt)

  const previousNbPanels = useStore((s: { previousNbPanels: any }) => s.previousNbPanels)
  const currentNbPanels = useStore((s: { currentNbPanels: any }) => s.currentNbPanels)
  const maxNbPanels = useStore((s: { maxNbPanels: any }) => s.maxNbPanels)

  const setSpeeches = useStore((s: { setSpeeches: any }) => s.setSpeeches)

  const setCaptions = useStore((s: { setCaptions: any }) => s.setCaptions)
  const [waitABitMore, setWaitABitMore] = useState(false)

  const captions = useStore((s: { captions: any }) => s.captions)
  const speeches = useStore((s: { speeches: any }) => s.speeches)

  const ref = useRef({
    existingPanels: [] as GeneratedPanel[],
    newPanelsPrompts: [] as string[],
    newSpeeches: [] as string[],
    newCaptions: [] as string[],
    prompt: "",
    preset: "",
  })

  useEffect(() => {
    if (!prompt) { return }

    if (
      prompt === useStore.getState().currentClap?.meta.description
    ) {
      console.log(`loading a pre-generated comic, so skipping prompt regeneration..`)
      return
    }

    if (
      prompt !== ref.current.prompt ||
      preset?.label !== ref.current.preset) {
      ref.current = {
        existingPanels: [],
        newPanelsPrompts: [],
        newSpeeches: [],
        newCaptions: [],
        prompt,
        preset: preset?.label || "",
      }
    }

    startTransition(async () => {
      setWaitABitMore(false)
      setGeneratingStory(true)

      const [stylePrompt, userStoryPrompt] = prompt.split("||").map((x: string) => x.trim())

      let limitedStylePrompt = stylePrompt.trim().slice(0, 77).trim()
      if (limitedStylePrompt.length !== stylePrompt.length) {
        console.log("Sorry folks, the style prompt was cut to:", limitedStylePrompt)
      }

      const nbPanelsToGenerate = 2

      for (
        let currentPanel = previousNbPanels;
        currentPanel < currentNbPanels;
        currentPanel += nbPanelsToGenerate
      ) {
        try {
          const candidatePanels = await getStoryContinuation({
            preset,
            stylePrompt,
            userStoryPrompt,
            nbPanelsToGenerate,
            maxNbPanels,
            existingPanels: ref.current.existingPanels,
            llmVendorConfig,
          })

          ref.current.existingPanels.push(...candidatePanels)

          const startAt = currentPanel
          const endAt = currentPanel + nbPanelsToGenerate
          for (let p = startAt; p < endAt; p++) {
            ref.current.newCaptions.push(ref.current.existingPanels[p]?.caption.trim() || "...")
            ref.current.newSpeeches.push(ref.current.existingPanels[p]?.speech.trim() || "...")
          }

          setSpeeches(ref.current.newSpeeches)
          setCaptions(ref.current.newCaptions)
          setGeneratingStory(false)

        } catch (err) {
          console.log("main.tsx: LLM generation failed:", err)
          setGeneratingStory(false)
          break
        }

        if (currentPanel > (currentNbPanels / 2)) {
          console.log("main.tsx: we are halfway there, hold tight!")
        }
      }
    })
  }, [
    prompt,
    preset?.label,
    previousNbPanels,
    currentNbPanels,
    maxNbPanels
  ]) 

  return (
    <Suspense>
      <TopMenu />
      <div className={cn(
        `flex items-start w-screen h-screen pt-24 md:pt-[72px] overflow-y-scroll`,
        `transition-all duration-200 ease-in-out`,
        `pl-1 pr-8 md:pl-16 md:pr-16`,
        `print:pt-0 print:px-0 print:pl-0 print:pr-0 print:h-auto print:w-auto print:overflow-visible`,
      )}>
        <div
          className={cn(
            `flex flex-col w-full`,
            `items-center`
          )}>
          <div
            className={cn(
              `comic-page`,
              `grid grid-cols-1`,
              `gap-x-3 gap-y-4 md:gap-x-8 lg:gap-x-12 xl:gap-x-16`,
              `print:gap-x-3 print:gap-y-4 print:grid-cols-1`
            )}
          >
            {captions.map((caption: any, i: any) => (
              <div key={i} className="page-content">
                <p>{caption}</p>
                <p>{speeches[i] || "默认演讲内容"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cn(
        `print:hidden`,
        `z-20 fixed inset-0`,
        `flex flex-row items-center justify-center`,
        `transition-all duration-300 ease-in-out`,
        isGeneratingStory
          ? `bg-zinc-50/30 backdrop-blur-md`
          : `bg-zinc-50/0 backdrop-blur-none pointer-events-none`,
      )}>
        <div className={cn(
          `text-center text-xl text-stone-700 w-[70%]`,
          isGeneratingStory ? `` : `scale-0 opacity-0`,
          `transition-all duration-300 ease-in-out`,
        )}>
          {waitABitMore ? `Story is ready, but server is a bit busy!` : 'Generating a new story..'}<br />
          {waitABitMore ? `Please hold tight..` : ''}
        </div>
      </div>
    </Suspense>
  )
}