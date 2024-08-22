import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function ModelGenerated(props) {
	const { nodes, materials } = useGLTF(
		"https://storage.googleapis.com/isolate-dev-hot-rooster_toolkit_bucket/github_110602490/fd0187816e8742d29f72be9650cd48fc_model.glb?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gke-service-account%40isolate-dev-hot-rooster.iam.gserviceaccount.com%2F20240822%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240822T233325Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=15ff779510b881d09af2eca8809cb574a28fe94fc3751b64d3ee470dfc0bca5f35809ad4a44fb7c1030e0e44d81b1a8fed888995d8a49375dc8dbc3772526eb9edba8869aeec6527b071c853909d54179ac7053ebae2a41a46d8ee60d02ab97679be54674be194d862d73d51fa6e4cba6fe95bc7cfa1698d8ad1196b44895d0475eb36a5932cb733c07028aeda9f795d9410c680b32a186d7f47130510cceed01546a876c785a19dd1286ab3066346ffd8c84d4bb94d63f85c4984d69f79e7f9ac51b4bb890eb604389a9f13706ad3838631305d883c71f6eea655329e307324d5ea50f13febe98d2ceb474b3bd7c6f4e3032de0dfa441c6ba75e0169744d500"
	);
	return (
		<group {...props} dispose={null}>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.geometry_0.geometry}
				material={nodes.geometry_0.material}
			/>
		</group>
	);
}
