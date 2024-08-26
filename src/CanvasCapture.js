import React from "react";

const CanvasCapture = ({ canvasRef }) => {
	const captureScene = () => {
		if (!canvasRef.current) return;

		// Get the canvas element
		const canvas = canvasRef.current;

		// Convert the canvas to a data URL, preserving transparency
		const dataUrl = canvas.toDataURL("image/png");

		// Create a link element and trigger the download
		const link = document.createElement("a");
		link.download = "scene-capture.png";
		link.href = dataUrl;
		link.click();
	};

	const buttonStyle = {
		position: "absolute",
		bottom: "10px",
		right: "10px",
		zIndex: 10,
	};

	return (
		<button style={buttonStyle} onClick={captureScene}>
			Capture Scene
		</button>
	);
};

export default CanvasCapture;
