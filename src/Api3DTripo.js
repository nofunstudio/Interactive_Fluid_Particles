import * as fal from "@fal-ai/serverless-client";
import { useScoreStore } from "./ScoreStore";
import image from "./images/myman.png";

fal.config({
	credentials:
		"a5411de0-36c9-4e9a-bd61-51da82c9a742:cbc4cf9924de5a5c864b1dbf2b1bf1f0",
});

export async function uploadAndFetch3D(
	setGeneratedModel,
	setGenerationRequestModel
) {
	// Create a Blob from the base64 data URI
	setGenerationRequestModel(true);
	console.log("generation requested 3D model");

	// Use the URL in your request
	const result = await fal.subscribe("fal-ai/triposr", {
		input: {
			image_url:
				"https://storage.googleapis.com/isolate-dev-hot-rooster_toolkit_bucket/github_110602490/80fb6ece52e044e1bbd48612fe975278_56a2f31d11804356ad8bccbf8433f278.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gke-service-account@isolate-dev-hot-rooster.iam.gserviceaccount.com/20240823/auto/storage/goog4_request&X-Goog-Date=20240823T002020Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=5c5813128b19e2ce763c98210aa0e148bd6485bcd374921199107f29533d6d079c2979d6dbf177ce6bbfbb066339585aeb5da412dc12ca2789f5ae5d182ea8b23ee23f3329cef8b3d36de66f2cf8c4eee54219d5c882b5c200f67498c70c44865246aeb23d0fb96577183b9083a73b29baa1ae3f36920767feb0f5e9015ad8021771d46012d73fd86b288ad14b6eaf17ee4d4b568e5127223104910f5d1d52bc4fa1fcfc7e2a6b69954b78a79d2adeb415376ffec24caea724fb4002bb529f8a810bab179fce9d47bc55271441bc73aeac09b47b8966a978f4e8a7a4cc99dcc2d0697e57ac4ba4930524d68f2c3d5cd7fcedfa0da30faf34658aa5136038a887",
			output_format: "glb",
			do_remove_background: false,
			foreground_ratio: 0.9,
			mc_resolution: 512,
		},
		logs: true,
		onQueueUpdate: (update) => {
			if (update.status === "IN_PROGRESS") {
				update.logs.map((log) => log.message).forEach(console.log);
			}
		},
	});

	if (result.model_mesh) {
		const modelUrl = result.model_mesh.url;
		setGeneratedModel(modelUrl);
		// setGenerationRequest(false);
		console.log("Generated Model URL:", modelUrl);
	} else {
		console.error("No image URL found in the result");
	}
}
