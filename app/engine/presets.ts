import { FontName } from "@/lib/fonts"
import { pick } from "@/lib/pick"

export type ComicFamily =
  | "american"
  | "romance"
  | "sci-fi"
  | "modern"
  | "fantasy"

export type ComicColor =
  | "color"
  | "grayscale"
  | "monochrome"

export interface Preset {
  id: string
  label: string
  family: ComicFamily
  color: ComicColor
  font: FontName
  llmPrompt: string
  imagePrompt: (prompt: string) => string[]
  negativePrompt: (prompt: string) => string[]
}

// ATTENTION!! negative prompts are not supported by the VideoChain API yet

export const presets: Record<string, Preset> = {
  american_comic_50: {
    id: "american_comic_50",
    label: "American (1950)",
    family: "american",
    color: "color",
    font: "arial",
    llmPrompt: "american comic",
    imagePrompt: (prompt: string) => [
      "1950",
      "50s",
      `vintage american color comic`,
      prompt,
      "detailed drawing"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "action",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  // urban_style: {
  //   id: "urban_style",
  //   label: "Urban",
  //   family: "modern",
  //   color: "color",
  //   font: "arial",
  //   llmPrompt: "urban setting, street scenes, city life",
  //   imagePrompt: (prompt: string) => [
  //     "urban environment",
  //     "street art style",
  //     "modern cityscape",
  //     prompt,
  //     "detailed drawing"
  //   ],
  //   negativePrompt: () => [
  //     "rural",
  //     "vintage",
  //     "fantasy",
  //     "grayscale",
  //     "monochrome",
  //     "photo",
  //     "painting",
  //     "3D render"
  //   ],
  // },
  // fairy_tale: {
  //   id: "fairy_tale",
  //   label: "Fairy Tale",
  //   family: "fantasy",  // 选择合适的 family 类型
  //   color: "color",
  //   font: "arial",  // 使用一种更有童话气息的字体
  //   llmPrompt: "fairy tale, magical, enchanted",
  //   imagePrompt: (prompt: string) => [
  //     "enchanted forest",
  //     "whimsical characters",
  //     "dreamy atmosphere",
  //     "magical creatures",
  //     prompt,
  //     "detailed drawing"
  //   ],
  //   negativePrompt: () => [
  //     "urban",
  //     "modern",
  //     "grayscale",
  //     "monochrome",
  //     "photo",
  //     "3D render"
  //   ],
  // }
  eastern_fantasy: {
    id: "eastern_fantasy",
    label: "Eastern Fantasy",
    family: "fantasy",
    color: "color",
    font: "arial",
    llmPrompt: "eastern fantasy, mystical landscapes, ancient martial arts",
    imagePrompt: (prompt: string) => [
      "ancient eastern landscapes",
      "mystical aura",
      "swords and sorcery",
      prompt,
      "detailed drawing"
    ],
    negativePrompt: () => [
      "urban",
      "modern",
      "grayscale",
      "photo",
      "painting",
      "3D render"
    ],
  },
  western_fantasy: {
    id: "western_fantasy",
    label: "Western Fantasy",
    family: "fantasy",
    color: "color",
    font: "arial",
    llmPrompt: "western fantasy, enchanted forests, knights and magic",
    imagePrompt: (prompt: string) => [
      "medieval castles",
      "enchanted forests",
      "knights and dragons",
      prompt,
      "detailed drawing"
    ],
    negativePrompt: () => [
      "urban",
      "modern",
      "grayscale",
      "photo",
      "painting",
      "3D render"
    ],
  },
  science_fiction: {
    id: "science_fiction",
    label: "Science Fiction",
    family: "sci-fi",
    color: "color",
    font: "arial",
    llmPrompt: "futuristic, science fiction, advanced technology",
    imagePrompt: (prompt: string) => [
      "futuristic cityscape",
      "spaceships",
      "advanced technology",
      prompt,
      "detailed drawing"
    ],
    negativePrompt: () => [
      "fantasy",
      "medieval",
      "grayscale",
      "photo",
      "painting",
      "3D render"
    ],
  },
  urban_superpower: {
    id: "urban_superpower",
    label: "Urban Superpower",
    family: "modern",
    color: "color",
    font: "arial",
    llmPrompt: "urban setting, superheroes, modern city",
    imagePrompt: (prompt: string) => [
      "superheroes in the city",
      "urban environment",
      "dynamic action scenes",
      prompt,
      "detailed drawing"
    ],
    negativePrompt: () => [
      "rural",
      "vintage",
      "fantasy",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  urban_romance: {
    id: "urban_romance",
    label: "Urban Romance",
    family: "romance",
    color: "color",
    font: "arial",
    llmPrompt: "modern city, romantic scenes, urban love stories",
    imagePrompt: (prompt: string) => [
      "romantic cityscapes",
      "couples in love",
      "urban setting",
      prompt,
      "detailed drawing"
    ],
    negativePrompt: () => [
      "fantasy",
      "superhero",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  school_romance: {
    id: "school_romance",
    label: "School Romance",
    family: "romance",
    color: "color",
    font: "arial",
    llmPrompt: "high school, young love, campus setting",
    imagePrompt: (prompt: string) => [
      "school environment",
      "young couples",
      "romantic school scenes",
      prompt,
      "detailed drawing"
    ],
    negativePrompt: () => [
      "fantasy",
      "superhero",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  }         
}

export type PresetName = keyof typeof presets

export const defaultPreset: PresetName = "american_comic_50"

export const nonRandomPresets = Object.keys(presets).filter(p => p !== "random")

export const getPreset = (preset?: PresetName): Preset => presets[preset || defaultPreset] || presets[defaultPreset]

export const getRandomPreset = (): Preset => {
  const presetName = pick(Object.keys(presets).filter(preset => preset !== "random")) as PresetName
  return getPreset(presetName)
}
