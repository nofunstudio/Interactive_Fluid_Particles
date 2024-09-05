import React, { useState } from "react";
import { Runware } from "@runware/sdk-js";

// Initialize the SDK with the provided API key
const runware = new Runware({ apiKey: "KwdQ9DBeQ70AEEOuiLQi1bARttjhi6Ej" });

export function Runware2() {
	const [imageUrl, setImageUrl] = useState(
		"https://pics.craiyon.com/2023-11-13/NMgjhfgPSoeFzUSGif36AA.webp"
	);
	const [processedImageUrl, setProcessedImageUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const processImage = async () => {
		setIsLoading(true);
		setError("");
		setProcessedImageUrl("");
		try {
			const result = await runware.requestImages({
				taskType: "imageInference",
				positivePrompt: "painting on canvas,vibrant colors, bold brushstrokes",
				// seedImage: imageUrl,
				model: "runware:100@1", // You may need to adjust this model name
				height: 512,
				width: 512,
				strength: 0.55,
				numberResults: 1,
			});

			if (result && result.length > 0 && result[0].imageURL) {
				setProcessedImageUrl(result[0].imageURL);
			} else {
				throw new Error("No image URL in the response");
			}
		} catch (err) {
			setError("Error processing image. Please check the URL and try again.");
			console.error("Error processing image:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			style={{
				maxWidth: "400px",
				margin: "40px auto",
				padding: "20px",
				backgroundColor: "white",
				borderRadius: "8px",
				boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
			}}
		>
			<h1
				style={{
					fontSize: "24px",
					fontWeight: "bold",
					marginBottom: "16px",
					textAlign: "center",
				}}
			>
				Runware Abstract Art Generator
			</h1>
			<div style={{ marginBottom: "16px" }}>
				<input
					type="text"
					value={imageUrl}
					onChange={(e) => setImageUrl(e.target.value)}
					placeholder="Enter image URL"
					style={{
						width: "100%",
						padding: "8px 12px",
						border: "1px solid #ccc",
						borderRadius: "4px",
					}}
				/>
			</div>
			<button
				onClick={processImage}
				disabled={isLoading || !imageUrl}
				style={{
					width: "100%",
					backgroundColor: isLoading || !imageUrl ? "#ccc" : "#3490dc",
					color: "white",
					padding: "8px 0",
					borderRadius: "4px",
					border: "none",
					cursor: isLoading || !imageUrl ? "not-allowed" : "pointer",
				}}
			>
				{isLoading ? "Generating Abstract Art..." : "Generate Abstract Art"}
			</button>
			{error && <p style={{ marginTop: "16px", color: "red" }}>{error}</p>}
			{processedImageUrl && (
				<div style={{ marginTop: "16px" }}>
					<h2
						style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}
					>
						Generated Abstract Art:
					</h2>
					<img
						src={processedImageUrl}
						alt="Generated Abstract Art"
						style={{ width: "100%", borderRadius: "4px" }}
					/>
				</div>
			)}
			<div style={{ marginTop: "16px" }}>
				<h2
					style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}
				>
					Original Image:
				</h2>
				<img
					src={imageUrl}
					alt="Original"
					style={{ width: "100%", borderRadius: "4px" }}
				/>
			</div>
		</div>
	);
}
