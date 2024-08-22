import React, { useEffect, useRef, useMemo, useState } from "react";
import {
	Canvas,
	useFrame,
	useThree,
	createPortal,
	useLoader,
} from "@react-three/fiber";
import * as THREE from "three";
import { useControls, Leva } from "leva";
import { PivotControls, GizmoHelper, GizmoViewport } from "@react-three/drei";

export function PivotWrapper(props) {
	const [selected, setSelected] = useState(false);

	return (
		<>
			<PivotControls
				depthTest={false}
				anchor={[0, 0, 0]}
				scale={0.75}
				visible={selected}
			>
				<mesh
					position={[0, 0, 0.2]}
					rotation={[0.5, 0.5, 0.5]}
					onPointerUp={(e) => {
						e.stopPropagation();
						setSelected(true);
					}}
					onPointerMissed={() => setSelected(false)}
				>
					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial color="orange" roughness={0.1} />
				</mesh>
			</PivotControls>
		</>
	);
}
