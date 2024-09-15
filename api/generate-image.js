// api/generate-image.js
const Replicate = require("replicate");

module.exports = async (req, res) => {
	if (req.method !== "POST") {
		res.status(405).send("Method Not Allowed");
		return;
	}

	const { faceInputImage, promptText } = req.body;

	const replicate = new Replicate({
		auth: process.env.REPLICATE_API_TOKEN,
	});

	const preText = "portrait of person, ";

	try {
		const output = await replicate.run(
			"zsxkib/flux-pulid:32235af21106089aad447a5afda017a7766f46ee09350243774091f115336d7f",
			{
				input: {
					width: 1024,
					height: 1024,
					prompt: preText + promptText,
					true_cfg: 1,
					id_weight: 1,
					num_steps: 20,
					start_step: 0,
					output_format: "png",
					guidance_scale: 4,
					output_quality: 90,
					main_face_image: faceInputImage,
					negative_prompt:
						"bad quality, worst quality, text, signature, watermark, extra limbs",
					max_sequence_length: 128,
				},
			}
		);

		if (output && output.length > 0) {
			res.status(200).json({ imageUrl: output[0] });
		} else {
			res.status(500).json({ error: "No image URL found in the output" });
		}
	} catch (error) {
		console.error("Error in generate-image function:", error);
		res
			.status(500)
			.json({ error: "An error occurred while generating the image" });
	}
};
