import { useEditor, exportToBlob } from "tldraw";
import { useEffect } from "react";
import { uploadAndFetchDataFluxDraw } from "./ApiFluxDraw";
import { useScoreStore } from "./ScoreStore";

export function TlDrawListener() {
	const editor = useEditor();
	const { setGeneratedImage, setGenerationRequest, promptText, isGenerating } =
		useScoreStore();
	useEffect(() => {
		const container = editor.getContainer();
		const focusOnPointerDown = () => editor.focus();
		container.addEventListener("pointerdown", focusOnPointerDown);

		// Cleanup event listeners on unmount
		return () => {
			container.removeEventListener("pointerdown", focusOnPointerDown);
		};
	}, [editor]);

	const handlePointerUp = () => {
		const exportVisibleCanvas = async () => {
			// Get the viewport bounds
			const viewportBounds = editor.getViewportPageBounds();
			console.log(viewportBounds, "viewportPageBounds");
			console.log(editor.getViewportScreenBounds(), "viewportScreenBounds");
			console.log(editor.getZoomLevel(), "zoomLevel");
			const zoomLevel = editor.getZoomLevel();

			const blob = await exportToBlob({
				editor,
				// Do not specify `ids` to include all shapes
				format: "png",
				opts: {
					background: true,
					bounds: viewportBounds,
					clip: true, // Clip shapes to the bounds
					cropped: true, // Prevent cropping to shapes' bounding box
					scale: zoomLevel,
				},
			});
			uploadAndFetchDataFluxDraw(
				blob,
				setGeneratedImage,
				setGenerationRequest,
				promptText
			);

			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = "visible-canvas-area.png";
			link.click();
		};

		// Call the async function
		exportVisibleCanvas();
	};

	useEffect(() => {
		handlePointerUp();
	}, [isGenerating]);

	return null;
}
