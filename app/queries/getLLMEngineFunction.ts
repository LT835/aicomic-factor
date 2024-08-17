import { LLMEngine } from "@/app/types"
import { predict as predictWithHuggingFace } from "./predictWithHuggingFace"
import { predict as predictWithOpenAI } from "./predictWithOpenAI"
import { predict as predictWithAnthropic } from "./predictWithAnthropic"

export const defaultLLMEngineName = `${process.env.LLM_ENGINE || ""}` as LLMEngine

export function getLLMEngineFunction(llmEngineName: LLMEngine = defaultLLMEngineName) {
  const llmEngineFunction = 
    // llmEngineName === "ANTHROPIC" ? predictWithAnthropic :
    // llmEngineName === "OPENAI" ? predictWithOpenAI :
    predictWithHuggingFace
  
  return llmEngineFunction
}

export const defaultLLMEngineFunction = getLLMEngineFunction()