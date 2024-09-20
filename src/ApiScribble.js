import { useScoreStore } from "./ScoreStore";

export async function uploadAndFetchDataScribble(
	scribbleInputImageFile,
	setGeneratedImage,
	setGenerationRequest,
	promptText
) {
	console.log("generation requested for face flux");
	setGenerationRequest(true);

	try {
		const scribbleInputImageBase64 = await convertFileToBase64(
			scribbleInputImageFile
		);

		// Create the request payload
		const payload = {
			scribbleInputImage: scribbleInputImageBase64,
			promptText: promptText,
		};

		const response = await fetch(
			"https://replicate-api-pink.vercel.app/api/scribble.ts",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`HTTP error! status: ${response.status}, message: ${errorText}`
			);
		}

		const startResult = await response.json();

		if (startResult && startResult.predictionId) {
			const predictionId = startResult.predictionId;
			console.log("Received predictionId:", predictionId);

			// Poll the prediction status until it's completed
			await pollPredictionStatus(
				predictionId,
				setGeneratedImage,
				setGenerationRequest
			);
		} else {
			console.error("No predictionId found in the response:", startResult);
		}
	} catch (error) {
		console.error("Error in uploadAndFetchDataFaceFlux:", error);
	} finally {
		setGenerationRequest(false);
	}
}

// Function to poll the prediction status
async function pollPredictionStatus(
	predictionId,
	setGeneratedImage,
	setGenerationRequest
) {
	try {
		let isCompleted = false;

		while (!isCompleted) {
			// Wait for 3 seconds before each poll
			await new Promise((resolve) => setTimeout(resolve, 3000));

			const statusResponse = await fetch(
				"https://replicate-api-pink.vercel.app/api/checkStatus",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ predictionId }),
				}
			);

			const statusResult = await statusResponse.json();

			if (statusResult.status === "succeeded") {
				isCompleted = true;
				const output = statusResult.output;

				if (output && output.length > 0) {
					// Assuming output is an array of image URLs
					const imageUrl = output[0];
					setGeneratedImage(imageUrl);
					console.log("Generated Image URL:", imageUrl);
				} else {
					console.error(
						"No output found in the prediction result:",
						statusResult
					);
				}
			} else if (statusResult.status === "failed") {
				isCompleted = true;
				console.error("Prediction failed:", statusResult);
			} else {
				console.log("Prediction status:", statusResult.status);
			}
		}
	} catch (error) {
		console.error("Error while polling prediction status:", error);
	} finally {
		setGenerationRequest(false);
	}
}

// Utility function to convert file to base64 string
function convertFileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}
