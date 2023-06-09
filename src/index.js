import ReactDOM from "react-dom/client";
import React, { useEffect, useRef, useMemo } from "react";

import "./styles.css";
import img from "./images/purp.png";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils";
import { DoubleSide, Vector2 } from "three";
import * as THREE from "three";
import FX from "./FX";
import { RenderTexture, useTexture, OrbitControls } from "@react-three/drei";
import { RenderTargetShader } from "./shader";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function GridBox(props) {
	const canvasRef = useRef(document.getElementById("jimbo"));
	const textureRef = useRef();
	const group = useRef();
	const shaderRef = useRef();
	const image = useTexture(img);
	let cycleStartTime = 0;

	const particlesGeometry = useMemo(
		() => new THREE.PlaneGeometry(5, 5, 200, 200),
		[]
	);

	useFrame(({ clock }) => {
		if (textureRef.current) {
			textureRef.current.needsUpdate = true;
		}

		if (shaderRef.current) {
			const elapsedTime = clock.getElapsedTime();

			// Increase the time uniform value
			shaderRef.current.uniforms.time.value = elapsedTime * 0.1; // Adjust this value to increase or decrease the speed

			// Make sure the time value stays within the range [0.0, 1.0]
			if (shaderRef.current.uniforms.time.value > 1.0) {
				shaderRef.current.uniforms.time.value = 1.0;
			}
		}
	});

	useEffect(() => {
		if (shaderRef.current && textureRef.current) {
			shaderRef.current.uniforms.t.value = textureRef.current;
			shaderRef.current.uniforms.t2.value = image;
		}
	}, [textureRef]);
	return (
		<group ref={group} {...props}>
			<mesh rotation={[0, degToRad(0), degToRad(0)]}>
				<boxGeometry args={[0, 0, 0]} />
				<meshBasicMaterial transparent>
					<canvasTexture
						ref={textureRef}
						attach="map"
						image={canvasRef.current}
					/>
				</meshBasicMaterial>
			</mesh>

			{/* <mesh geometry={particlesGeometry} position={[0, 0.0, -0.0]}>
        <meshBasicMaterial map={image} />
      </mesh> */}
			<mesh>
				<points
					geometry={particlesGeometry}
					position={[0, 0.0, 1.3]}
					rotation={[0, 0, 0]}
				>
					<renderTargetShader
						ref={shaderRef}
						transparent
						side={DoubleSide}
						depth
						//blending={THREE.AdditiveBlending}
					/>
				</points>
			</mesh>
		</group>
	);
}

const App = () => {
	return (
		<Canvas>
			{/* <EffectComposer>
        <Bloom intensity={.0} />
      </EffectComposer> */}
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
