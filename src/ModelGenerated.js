import React, { useEffect, useRef, useState } from "react";
import { useGLTF, PivotControls } from "@react-three/drei";
import { useScoreStore } from "./ScoreStore";

export function ModelGenerated(props) {
	const { nodes, materials } = useGLTF(props.generatedModel);
	const [selected, setSelected] = useState(false);
	const { generationRequest } = useScoreStore();

	// useEffect(() => {
	//     if (generationRequest) {
	//         setSelected(false);
	//     } else {
	//         setSelected(false);
	//     }
	// }
	// , [generationRequest]);
	return (
		<mesh layers={1}>
			<PivotControls
				depthTest={false}
				anchor={[0, 0, 0]}
				scale={0.75}
				visible={generationRequest ? false : selected}
				layers={1}
			>
				<group
					{...props}
					dispose={null}
					scale={2.25}
					rotation={[0, Math.PI * 1.0, 0]}
					position={props.position}
				>
					<mesh
						onPointerDown={(e) => {
							// e.stopPropagation();
							setSelected(true);
						}}
						onPointerMissed={() => setSelected(false)}
						castShadow
						receiveShadow
						geometry={nodes.geometry_0.geometry}
						material={nodes.geometry_0.material}
					/>
				</group>
			</PivotControls>
		</mesh>
	);
}
