import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree, createPortal } from "@react-three/fiber";
import { useFluid, useSingleFBO } from "@funtech-inc/use-shader-fx";
import { FXTargetShader } from "./FXshader";

//THIS FILE ISNT USED IN THE FINAL PROJECT

export const Portal = () => {
	const ref = useRef(null);
	const { size, viewport, camera } = useThree();
	const [updateFluid, setFluid, { output }] = useFluid({
		size,
		dpr: viewport.dpr,
	});
	const offscreenScene = useMemo(() => new THREE.Scene(), []);

	const [boxView, updateRenderTarget] = useSingleFBO({
		scene: offscreenScene,
		camera,
		size,
		dpr: viewport.dpr,
		samples: 4,
	});

	// useFrame((props) => updateFluid(props));
	useFrame((props) => {
		updateFluid(props);
		updateRenderTarget(props.gl);
	});

	useEffect(() => {
		if (ref.current && output) {
			ref.current.uniforms.u_fx.value = output;
		}
	}, [output]);

	useEffect(() => {
		setFluid({
			density_dissipation: 0.99,
			velocity_dissipation: 0.99,
			velocity_acceleration: 50,
			splat_radius: 0.001,
			curl_strength: 0.05,
			// fluid_color: new THREE.Color(0x000000),
			pressure_iterations: 10,
		});
	}, []);

	return (
		<>
			{createPortal(
				<mesh>
					<planeGeometry args={[2, 2]} />
					<fXTargetShader ref={ref} u_fx={output} />
				</mesh>,
				offscreenScene
			)}
		</>
	);
};
