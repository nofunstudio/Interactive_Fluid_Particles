import React, { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import map from "./images/Map-COL.jpg";

export function Human(props) {
	const texture = useTexture(map);
	const { nodes, materials } = useGLTF("/LeePerrySmith.glb");
	return (
		<group {...props} dispose={null} scale={0.25}>
			<mesh castShadow receiveShadow geometry={nodes.LeePerrySmith.geometry}>
				<meshStandardMaterial map={texture} />
			</mesh>
		</group>
	);
}

useGLTF.preload("/LeePerrySmith.glb");
