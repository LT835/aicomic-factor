import { RenderedScene } from "@/app/types"

export const getInitialRenderedScene = (): RenderedScene => ({
  renderId: "",
  status: "pending",
  assetUrl: "", 
  alt: "",
  error: "",
  maskUrl: "",
  segments: []
})