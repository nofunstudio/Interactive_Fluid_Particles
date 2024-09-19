import * as fal from "@fal-ai/serverless-client";
import { useScoreStore } from "./ScoreStore";

fal.config({
	credentials:
		"a5411de0-36c9-4e9a-bd61-51da82c9a742:cbc4cf9924de5a5c864b1dbf2b1bf1f0",
});

const invertBase64Image = (base64Image) => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;

			for (let i = 0; i < data.length; i += 4) {
				data[i] = 255 - data[i]; // red
				data[i + 1] = 255 - data[i + 1]; // green
				data[i + 2] = 255 - data[i + 2]; // blue
				// Alpha channel (data[i + 3]) is left unchanged
			}

			ctx.putImageData(imageData, 0, 0);
			resolve(canvas.toDataURL());
		};
		img.src = base64Image;
	});
};

export async function uploadAndFetchDataFluxDepth(
	base64Data,
	base64Data2,
	setGeneratedImage,
	setGenerationRequest,
	promptText
) {
	console.log("generation requested");
	setGenerationRequest(true);

	const convertData = (imageData) => {
		const byteString = atob(imageData.split(",")[1]);
		const mimeString = imageData.split(",")[0].split(":")[1].split(";")[0];
		const buffer = new ArrayBuffer(byteString.length);
		const dataArray = new Uint8Array(buffer);
		for (let i = 0; i < byteString.length; i++) {
			dataArray[i] = byteString.charCodeAt(i);
		}
		return new Blob([buffer], { type: mimeString });
	};

	try {
		// Invert the colors of base64Data2
		const invertedBase64Data2 = await invertBase64Image(base64Data2);

		// Convert and upload both files
		const blob1 = convertData(base64Data);
		// const blob2 = convertData(base64Data2);
		const blob2 = convertData(invertedBase64Data2);

		const file1 = new File([blob1], "image.png", { type: blob1.type });
		const file2 = new File([blob2], "depth-map.png", { type: blob2.type });

		const [url1, url2] = await Promise.all([
			fal.storage.upload(file1),
			fal.storage.upload(file2),
		]);

		// Use both URLs in your request
		const result = await fal.subscribe("fal-ai/flux-general/image-to-image", {
			input: {
				prompt: promptText,
				num_inference_steps: 28,
				controlnets: [
					{
						path: "https://huggingface.co/Shakker-Labs/FLUX.1-dev-ControlNet-Depth/resolve/main/diffusion_pytorch_model.safetensors?download=true",
						control_image_url: url2,
						config_url:
							"https://huggingface.co/Shakker-Labs/FLUX.1-dev-ControlNet-Depth/resolve/main/config.json",
						conditioning_scale: 0.5,
					},
				],
				controlnet_unions: [],
				guidance_scale: 3.5,
				num_images: 1,
				enable_safety_checker: false,
				image_url: url1,
				strength: 0.85,
				image_size: {
					width: 1024,
					height: 1024,
				},
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
