// Replace your existing function with the following:

export async function uploadAndFetchDataFaceFlux(
	faceInputImage,
	setGeneratedImage,
	setGenerationRequest,
	promptText
) {
	console.log("Generation requested for Face Flux");
	setGenerationRequest(true);

	try {
		const response = await fetch("/api/generate-image", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ faceInputImage, promptText }),
		});

		const data = await response.json();

		if (response.ok) {
			setGeneratedImage(data.imageUrl);
			console.log("Generated Image URL:", data.imageUrl);
		} else {
			console.error("Error from server:", data.error);
		}
	} catch (error) {
		console.error("Error in uploadAndFetchDataFaceFlux:", error);
	} finally {
		setGenerationRequest(false);
	}
}
