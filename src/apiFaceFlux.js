export async function uploadAndFetchDataFaceFlux(
	faceInputImage,
	setGeneratedImage,
	setGenerationRequest,
	promptText
) {
	console.log("Generation requested for face flux");
	setGenerationRequest(true);

	try {
		const response = await fetch("/api/generate-image", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				faceInputImage,
				promptText,
			}),
		});

		const data = await response.json();

		if (response.ok) {
			setGeneratedImage(data.imageUrl);
			console.log("Generated Image URL:", data.imageUrl);
		} else {
			console.error("Error from serverless function:", data.error);
		}
	} catch (error) {
		console.error("Error in uploadAndFetchDataFaceFlux:", error);
	} finally {
		setGenerationRequest(false);
	}
}
