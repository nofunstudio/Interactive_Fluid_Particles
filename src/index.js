import ReactDOM from "react-dom/client";
import React, { useEffect, useRef, useMemo } from "react";

import "./styles.css";
import img from "./images/bee.png";
import {
	Canvas,
	useFrame,
	useThree,
	createPortal,
	useLoader,
} from "@react-three/fiber";
import { DoubleSide, Vector2 } from "three";
import * as THREE from "three";
import { useTexture, OrbitControls } from "@react-three/drei";
// import { Home } from "./Home";
import {
	useFluid,
	useSingleFBO,
	useFxTexture,
} from "@funtech-inc/use-shader-fx";
import { FXTargetShader } from "./FXshader";
import { RenderTargetShader } from "./shader";

function GridBox(props) {
	const imageBackgroundState = true;
	const showFluidTextureDebug = false;
	const ref = useRef(null);
	const textureRef = useRef();
	const shaderRef = useRef();
	const image = useTexture(img);
	const { size, dpr, camera } = useThree((state) => {
		return { size: state.size, dpr: state.viewport.dpr, camera: state.camera };
	});
	const [bg] = useLoader(THREE.TextureLoader, [img]);

	const [updateFluid, setFluid, { output }] = useFluid({
		size,
		dpr: dpr,
	});
	const offscreenScene = useMemo(() => new THREE.Scene(), []);

	const [boxView, updateRenderTarget] = useSingleFBO({
		scene: offscreenScene,
		camera,
		size,
		dpr,
		samples: 4,
	});

	const [updateFxTexture] = useFxTexture({ size, dpr });

	const particlesGeometry = useMemo(
		//set the amount of particles
		() => new THREE.PlaneGeometry(5, 5, 100, 100),
		[]
	);

	useFrame((props) => {
		updateFluid(props);
		if (shaderRef.current) {
			if (ref.current) {
				shaderRef.current.uniforms.t.value = output;
				if (imageBackgroundState) {
					const bgTexture = updateFxTexture(props, {
						map: output,
						padding: 0.0,
						mapIntensity: 0.01,
						edgeIntensity: -0.5,
						texture0: bg,
					});
					ref.current.uniforms.u_fx.value = bgTexture;
					shaderRef.current.uniforms.t2.value = boxView.texture;
				} else {
					ref.current.uniforms.u_fx.value = output;
					shaderRef.current.uniforms.t2.value = image;
				}

				ref.current.uniforms.u_alpha = 0.0;
				updateRenderTarget(props.gl);
			}
			const elapsedTime = props.clock.getElapsedTime();

			// Increase the time uniform value
			shaderRef.current.uniforms.time.value = elapsedTime * 0.1; // Adjust this value to increase or decrease the speed

			// Make sure the time value stays within the range [0.0, 1.0]
			if (shaderRef.current.uniforms.time.value > 1.0) {
				shaderRef.current.uniforms.time.value = 1.0;
			}
		}
	});

	useEffect(() => {}, [textureRef]);

	useEffect(() => {
		if (ref.current && output) {
			ref.current.uniforms.u_fx.value = output;

			//  ref.current.u_alpha = 0.0;
		}
	}, [output]);

	useEffect(() => {
		setFluid({
			density_dissipation: 0.99,
			velocity_dissipation: 0.99,
			velocity_acceleration: 100,
			splat_radius: 0.001,
			curl_strength: 50,
			// fluid_color: new THREE.Color(0x000000),
			pressure_iterations: 20,
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
			{/* background image  */}
			{/*
			<mesh geometry={particlesGeometry} position={[0, 0.0, -0.0]}>
				<meshBasicMaterial map={image} />
			</mesh> */}

			{/* debug fluid texture  */}

			{showFluidTextureDebug && (
				<mesh position={[4, 0.0, -0.0]}>
					<planeGeometry args={[2, 2]} />
					<meshBasicMaterial map={boxView.texture} />
				</mesh>
			)}

			<mesh>
				<points
					geometry={particlesGeometry}
					position={[0, 0.0, 0]}
					rotation={[0, 0, 0]}
				>
					<renderTargetShader
						ref={shaderRef}
						transparent
						side={DoubleSide}
						depth
						pointSize={4.0}
						//blending={THREE.AdditiveBlending}
					/>
				</points>
			</mesh>
		</>
	);
}

const App = () => {
	return (
		<Canvas>
			<GridBox />
		</Canvas>
	);
};

const rootElement = document.getElementById("root");

// Create a root and render the App inside
ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
