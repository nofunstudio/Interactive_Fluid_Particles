import axios from "axios";

export function downloadGeneratedModel(blob, filename = "model.glb") {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export async function uploadAndFetchStabilityAI3D(
	setGeneratedModel,
	setGenerationRequestModel,
	imageUrl,
	texture_resolution,
	foreground_ratio
) {
	setGenerationRequestModel(true);
	console.log("Generating 3D model from Stability AI");

	const API_ENDPOINT = "https://api.stability.ai/v2beta/3d/stable-fast-3d";
	const API_KEY = "sk-44Q3pnfkrukBn7Z2OmO91eGA1aRtZUQfuAIiRl8Q432ldsrZ";

	try {
		// Fetch the image and create a File object
		const response = await fetch(imageUrl);
		const blob = await response.blob();
		const file = new File([blob], "image.jpg", { type: blob.type });

		const payload = {
			image: file,
			texture_resolution: texture_resolution,
			foreground_ratio: foreground_ratio.toString(),
		};

		const apiResponse = await axios.postForm(API_ENDPOINT, payload, {
			validateStatus: undefined,
			responseType: "arraybuffer",
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		});

		if (apiResponse.status === 200) {
			const modelBlob = new Blob([apiResponse.data], {
				type: "model/gltf-binary",
			});
			const modelUrl = URL.createObjectURL(modelBlob);
			setGeneratedModel(modelUrl);
			// const a = document.createElement("a");
			// a.href = modelUrl;
			// a.download = "model.glb";
			// document.body.appendChild(a);
			// a.click();
			// document.body.removeChild(a);
			// URL.revokeObjectURL(modelUrl);

			console.log("Generated Model URL:", modelUrl);
		} else {
			const errorMessage = new TextDecoder().decode(apiResponse.data);
			throw new Error(`${apiResponse.status}: ${errorMessage}`);
		}
	} catch (error) {
		console.error("Error generating 3D model:", error);
		setGeneratedModel(null);
	} finally {
		setGenerationRequestModel(false);
	}
}
