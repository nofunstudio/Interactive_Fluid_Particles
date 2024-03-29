import ReactDOM from "react-dom/client";
import React, { useEffect, useRef, useMemo, useState } from "react";

import "./styles.css";
import img from "./images/purp.png";
import cubeIMG from "./images/envMap.hdr";
import px from "./images/px.png";
import nx from "./images/nx.png";
import py from "./images/py.png";
import ny from "./images/ny.png";
import pz from "./images/pz.png";
import nz from "./images/nz.png";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils";
import { DoubleSide, Vector2 } from "three";
import * as THREE from "three";
import FX from "./FX";
import { RenderTexture, useTexture, OrbitControls } from "@react-three/drei";
import { RenderTargetShader } from "./shader_shoe";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEnvironmentMap } from "./envMap";
import { PRWMLoader } from "three/examples/jsm/loaders/PRWMLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
export function Shoe3D(props) {
	const canvasRef = useRef(document.getElementById("jimbo"));
	const textureRef = useRef();
	const group = useRef();
	const shaderRef = useRef();
	const image = useTexture(img);
	const loader = new THREE.CubeTextureLoader();
	const environmentMap = loader.load([px, nx, py, ny, pz, nz]);
	const [colorMap] = useLoader(TextureLoader, [
		"https://cdn.arcsineimaging.com/models/yeezy-700-v3-kyanitev2_98846271010b/textures/2k/base_texture.jpg",
	]);

	const url =
		"https://cdn.arcsineimaging.com/models/yeezy-700-v3-kyanitev2_98846271010b/model.*.bin";
	const particlesGeometry = useLoader(PRWMLoader, url);

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
		if (shaderRef.current) {
			shaderRef.current.uniforms.t2.value = colorMap;
			shaderRef.current.uniforms.envMap.value = environmentMap;
		}
	}, [textureRef]);

	return (
		<group ref={group} {...props}>
			<mesh>
				<points
					geometry={particlesGeometry}
					position={[0, -0.015, 4.75]}
					rotation={[0.5, 1, 0]}
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
