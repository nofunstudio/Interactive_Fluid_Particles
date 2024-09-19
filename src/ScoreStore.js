import { create } from "zustand";
import faceImg from "./images/pat.jpeg";

export const useScoreStore = create((set) => ({
	promptText:
		"Metallic style, glossy HDR reflections, shiny chrome, Jeff Koons Balloon style sculpture, 8k, unreal engine 5, intricate detailed.",
	setPromptText: (promptText) => set({ promptText }),
	promptImage: null,
	setPromptImage: (promptImage) => set({ promptImage }),
	activeMenu: "Monkey",
	setActiveMenu: (activeMenu) => set({ activeMenu }),
	generationRequestFace: null,
	setGenerationRequestFace: (generationRequestFace) =>
		set({ generationRequestFace }),
	generatedFace: null,
	setGeneratedFace: (generatedFace) => set({ generatedFace }),
	faceInputImage: null,
	setFaceInputImage: (faceInputImage) => set({ faceInputImage }),
	generationRequestEnvironment: null,
	setGenerationRequestEnvironment: (generationRequestEnvironment) =>
		set({ generationRequestEnvironment }),
	generationRequestModel: null,
	setGenerationRequestModel: (generationRequestModel) =>
		set({ generationRequestModel }),
	generatedModel: null,
	setGeneratedModel: (generatedModel) => set({ generatedModel }),
	generationRequest: null,
	setGenerationRequest: (generationRequest) => set({ generationRequest }),
	generatedImage: null,
	setGeneratedImage: (generatedImage) => set({ generatedImage }),
	generatedEnvironment: null,
	setGeneratedEnvironment: (generatedEnvironment) =>
		set({ generatedEnvironment }),
	depthMapFrame: null,
	setDepthMapFrame: (depthMapFrame) => set({ depthMapFrame }),
	maskProgress: 0.01,
	setMaskProgress: (maskProgress) => set({ maskProgress }),
	backgroundOpacity: 1,
	setBackgroundOpacity: (backgroundOpacity) => set({ backgroundOpacity }),
}));
