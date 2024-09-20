import { useEditor, exportToBlob } from "tldraw";
import { useEffect } from "react";
import { uploadAndFetchDataFluxDraw } from "./ApiFluxDraw";
import { uploadAndFetchDataScribble } from "./ApiScribble";
import { useScoreStore } from "./ScoreStore";

export function TlDrawListener() {
	const editor = useEditor();
	const { setGeneratedImage, setGenerationRequest, promptText, isGenerating } =
		useScoreStore();

	useEffect(() => {
		editor.setCurrentTool("draw");
		const container = editor.getContainer();
		const focusOnPointerDown = () => editor.focus();
		container.addEventListener("pointerdown", focusOnPointerDown);

		// Cleanup event listeners on unmount
		return () => {
			container.removeEventListener("pointerdown", focusOnPointerDown);
		};
	}, [editor]);

	useEffect(() => {
		const viewportBounds = editor.getViewportPageBounds();
		const zoomLevel = editor.getZoomLevel();
		const shapeIds = editor.getCurrentPageShapeIds();
		if (!editor || shapeIds.size === 0) return;
		exportToBlob({
			editor,
			format: "png",
			opts: {
				background: true,
				bounds: viewportBounds,
				clip: true,
				cropped: true,
				scale: zoomLevel,
			},
		})
			.then((blob) => {
				uploadAndFetchDataScribble(
					blob,
					setGeneratedImage,
					setGenerationRequest,
					promptText
				);
				const link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				link.download = "visible-canvas-area.png";
				link.click();
			})
			.catch((err) => {
				// Handle any errors
				console.error("Error exporting blob", err);
			});
	}, [isGenerating]);

	return null;
}
