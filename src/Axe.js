import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Axe(props) {
	const { nodes, materials } = useGLTF("/axe.glb");
	return (
		<group {...props} dispose={null} position={[-0.5, -0.5, 0]}>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Cylinder.geometry}
				material={materials.brown}
				position={[0.783, 0.921, 0]}
				rotation={[-0.632, 0.306, 0.362]}
				scale={0.3}
			>
				<group position={[0, 0, 0.274]} scale={0.97}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Circle_1.geometry}
						material={materials["blue 5"]}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Circle_2.geometry}
						material={materials.silver}
					/>
				</group>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Circle001.geometry}
					material={materials.silver}
					position={[0, -3.745, 0.461]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube.geometry}
					material={materials.yellow}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cylinder001.geometry}
					material={materials.chocolate}
					position={[0, 1.62, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cylinder002.geometry}
					material={materials.chocolate}
					position={[0, -2.584, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cylinder003.geometry}
					material={materials.yellow}
					position={[0, -3.734, 0]}
					scale={[1.083, 1, 1.083]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Plane.geometry}
					material={materials.silver}
					position={[1.924, 0, 0]}
				/>
			</mesh>
		</group>
	);
}

useGLTF.preload("/axe.glb");
