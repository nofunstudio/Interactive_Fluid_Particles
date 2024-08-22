import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Suzanne(props) {
	const { nodes } = useGLTF("/suzanne.glb");
	return (
		<group {...props} dispose={null}>
			<mesh
				rotation={[Math.PI * -0.5, 0, Math.PI / 0.5]}
				castShadow
				receiveShadow
				geometry={nodes.Suzanne.geometry}
			>
				<meshStandardMaterial color="green" roughness={0.0} metalness={0.15} />
			</mesh>
		</group>
	);
}

useGLTF.preload("/suzanne.glb");
