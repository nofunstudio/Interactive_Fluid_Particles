import { create } from "zustand";

export const useScoreStore = create((set) => ({
	promptText:
		"Metallic style, glossy HDR reflections, shiny chrome, Jeff Koons Balloon style sculpture, 8k, unreal engine 5, intricate detailed.",
	setPromptText: (promptText) => set({ promptText }),
	promptImage: null,
	setPromptImage: (promptImage) => set({ promptImage }),
	activeMenu: "Monkey",
	setActiveMenu: (activeMenu) => set({ activeMenu }),
	generationRequestModel: null,
	setGenerationRequestModel: (generationRequestModel) =>
		set({ generationRequestModel }),
	generatedModel: null,
	setGeneratedModel: (generatedModel) => set({ generatedModel }),
	generationRequest: null,
	setGenerationRequest: (generationRequest) => set({ generationRequest }),
	generatedImage: null,
	setGeneratedImage: (generatedImage) => set({ generatedImage }),
	depthMapFrame: null,
	setDepthMapFrame: (depthMapFrame) => set({ depthMapFrame }),
	maskProgress: 0.01,
	setMaskProgress: (maskProgress) => set({ maskProgress }),
	backgroundOpacity: 1,
	setBackgroundOpacity: (backgroundOpacity) => set({ backgroundOpacity }),
}));
