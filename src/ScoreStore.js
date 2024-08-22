import { create } from "zustand";

export const useScoreStore = create((set) => ({
	generationRequest: null,
	setGenerationRequest: (generationRequest) => set({ generationRequest }),
	generatedImage: null,
	setGeneratedImage: (generatedImage) => set({ generatedImage }),
}));
