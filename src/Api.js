import * as fal from "@fal-ai/serverless-client";
import { useScoreStore } from "./ScoreStore";

fal.config({
	credentials:
		"a5411de0-36c9-4e9a-bd61-51da82c9a742:cbc4cf9924de5a5c864b1dbf2b1bf1f0",
});

export async function uploadAndFetchData(
	base64Data,
	setGeneratedImage,
	setGenerationRequest,
	promptText
) {
	// Create a Blob from the base64 data URI
	// setGenerationRequest(true);
	console.log("generation requested");
	const byteString = atob(base64Data.split(",")[1]);
	const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
	const buffer = new ArrayBuffer(byteString.length);
	const dataArray = new Uint8Array(buffer);
	for (let i = 0; i < byteString.length; i++) {
		dataArray[i] = byteString.charCodeAt(i);
	}
	const blob = new Blob([buffer], { type: mimeString });

	// Upload the file using the FAL AI client
	const file = new File([blob], "depth-map.png", { type: mimeString });
	const url = await fal.storage.upload(file);

	// Use the URL in your request
	const result = await fal.subscribe("fal-ai/sd15-depth-controlnet", {
		input: {
			prompt: promptText,
			control_image_url: url,
		},
		logs: true,
		onQueueUpdate: (update) => {
			if (update.status === "IN_PROGRESS") {
				update.logs.map((log) => log.message).forEach(console.log);
			}
		},
	});

	if (result.images && result.images.length > 0) {
		const imageUrl = result.images[0].url;
		setGeneratedImage(imageUrl);
		setGenerationRequest(false);

		// setGenerationRequest(false);
		console.log("Generated Image URL:", imageUrl);
	} else {
		console.error("No image URL found in the result");
	}
}
