import * as fal from "@fal-ai/serverless-client";
import { useScoreStore } from "./ScoreStore";

fal.config({
	credentials:
		"a5411de0-36c9-4e9a-bd61-51da82c9a742:cbc4cf9924de5a5c864b1dbf2b1bf1f0",
});

export async function uploadAndFetchDataFluxDraw(
	base64Data,
	setGeneratedImage,
	setGenerationRequest,
	promptText
) {
	console.log("generation requested");
	setGenerationRequest(true);

	try {
		// Invert the colors of base64Data2

		// Convert and upload both files

		const [url1] = await Promise.all([fal.storage.upload(base64Data)]);

		// Use both URLs in your request
		const result = await fal.subscribe("fal-ai/flux-general", {
			input: {
				prompt: "SuchWoolfelt" + promptText,
				num_inference_steps: 28,
				controlnets: [
					{
						path: "https://huggingface.co/InstantX/FLUX.1-dev-Controlnet-Canny/resolve/main/diffusion_pytorch_model.safetensors?download=true",
						config_url:
							"https://huggingface.co/InstantX/FLUX.1-dev-Controlnet-Canny/resolve/main/config.json?download=true",
						control_image_url: url1,
						conditioning_scale: 0.5,
					},
				],
				controlnet_unions: [],
				guidance_scale: 0.5,
				num_images: 1,
				enable_safety_checker: false,
				strength: 0.75,
				image_size: {
					width: 1024,
					height: 1024,
				},
				loras: [
					{
						path: "https://civitai.com/api/download/models/856337?type=Model&format=SafeTensor",
						scale: ".8",
					},
				],
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
			console.log("Generated Image URL:", imageUrl);
		} else {
			console.error("No image URL found in the result");
		}
	} catch (error) {
		console.error("Error in uploadAndFetchDataFlux:", error);
	} finally {
		setGenerationRequest(false);
	}
}
