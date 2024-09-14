import * as fal from "@fal-ai/serverless-client";
import { useScoreStore } from "./ScoreStore";

fal.config({
	credentials:
		"a5411de0-36c9-4e9a-bd61-51da82c9a742:cbc4cf9924de5a5c864b1dbf2b1bf1f0",
});

export async function uploadAndFetchData360(
	setGeneratedEnvironment,
	setGenerationRequestEnvironment,
	promptText
) {
	console.log("generation requested 360");
	setGenerationRequestEnvironment(true);
	const preText = "equirectangular projection, 360 photo, panoramic lens, ";

	try {
		// Use both URLs in your request
		const result = await fal.subscribe("fal-ai/flux-general", {
			input: {
				loras: [
					{
						path: "https://civitai.com/api/download/models/763724?type=Model&format=SafeTensor",
					},
				],
				prompt: preText + promptText,
				image_size: {
					width: 1536,
					height: 768,
				},
				num_inference_steps: 28,
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
			setGeneratedEnvironment(imageUrl);
			console.log("Generated Image URL:", imageUrl);
		} else {
			console.error("No image URL found in the result");
		}
	} catch (error) {
		console.error("Error in uploadAndFetchData360:", error);
	} finally {
		setGenerationRequestEnvironment(false);
	}
}
