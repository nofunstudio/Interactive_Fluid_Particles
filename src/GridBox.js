import React, { useEffect, useRef, useMemo, useState } from "react";
import { Perf } from "r3f-perf";

import "./styles.css";
import img from "./images/frame1.png";
import img2 from "./images/frame2.png";
import img3 from "./images/frame3.png";
import img4 from "./images/frame4.png";
import {
	Canvas,
	useFrame,
	useThree,
	createPortal,
	useLoader,
} from "@react-three/fiber";
import { DoubleSide, Vector2 } from "three";
import * as THREE from "three";
import { useSingleFBO } from "@funtech-inc/use-shader-fx";
import { BaseShader } from "./BaseShader";
import { FXTargetShader } from "./FXshaderdupe";
import { RenderTargetShader } from "./shader";
import { useControls, Leva } from "leva";

export function GridBox(props) {
	const shaderRef = useRef();
	const { size, camera, viewport } = useThree();
	const dpr = viewport.dpr;

	const { pointSize, gridSize, showPerf } = useControls({
		pointSize: {
			value: 4,
			min: 0.1,
			max: 25,
			step: 0.1,
		},
		gridSize: {
			value: 300,
			min: 10,
			max: 500,
			step: 10,
		},
		showPerf: {
			value: false,
		},
	});

	const [currentImg] = useLoader(THREE.TextureLoader, [img]);
	const [lowResImg] = useLoader(THREE.TextureLoader, [img2]);
	const [highResImg] = useLoader(THREE.TextureLoader, [img3]);
	const [noiseImg] = useLoader(THREE.TextureLoader, [img4]);
	const [generationRequested, setGenerationRequested] = useState(true);
	const [phase, setPhase] = useState(0);
	const [generationComplete, setGenerationComplete] = useState(false);
	const [showParticles, setShowParticles] = useState(true);

	const resetValues = () => {
		setShowParticles(false);
		setGenerationRequested(false);
		setGenerationComplete(true);
		//set in a loop for testing
		setTimeout(() => {
			setGenerationRequested(true);
		}, 1000);
	};

	useEffect(() => {
		if (generationRequested) {
			setShowParticles(true);
			setPhase(0);

			setTimeout(() => {
				setPhase(1);
			}, 1000);

			setTimeout(() => {
				setPhase(2);
			}, 2000);
		}
	}, [generationRequested]);

	const aspectRatio = size.width / size.height;
	const fov = camera.fov * (Math.PI / 180); // Convert FOV from degrees to radians
	const height = 2 * Math.tan(fov / 2) * camera.position.z; // distance from the camera
	const width = height * aspectRatio;
	const particlesGeometry = useMemo(
		() => new THREE.PlaneGeometry(width, height, gridSize, gridSize),
		[gridSize] // This dependency ensures the geometry updates when gridSize changes
	);

	useFrame((props) => {
		const elapsedTime = props.clock.getElapsedTime();
		if (shaderRef.current) {
			// shaderRef.current.uniforms.t.value = boxView.texture;
			if (phase === 0) {
				if (shaderRef.current.uniforms.transitionNoise.value < 0.99) {
					shaderRef.current.uniforms.transitionNoise.value += 0.01;
				}
			} else if (phase === 1) {
				if (shaderRef.current.uniforms.transitionNoise.value > 0.35) {
					shaderRef.current.uniforms.transitionNoise.value -= 0.005;
				}

				if (shaderRef.current.uniforms.transition1.value < 0.95) {
					shaderRef.current.uniforms.transition1.value += 0.05;
				}
			} else if (phase === 2) {
				if (shaderRef.current.uniforms.transition2.value < 0.95) {
					shaderRef.current.uniforms.transition2.value += 0.05;
				}
				if (shaderRef.current.uniforms.transitionNoise.value > 0.01) {
					shaderRef.current.uniforms.transitionNoise.value -= 0.01;
				} else {
					resetValues();
				}
			}

			shaderRef.current.uniforms.time.value = elapsedTime * 0.1;
			// this can be optimized by using a single texture and updating the uniforms
			shaderRef.current.uniforms.t2.value = currentImg;
			shaderRef.current.uniforms.t3.value = lowResImg;
			shaderRef.current.uniforms.t4.value = highResImg;
		}
	});

	//cleanup old particles
	useEffect(() => {
		console.log("cleaning up old particles");
		return () => {
			particlesGeometry.dispose(); // Clean up the old geometry when component unmounts or gridSize changes
		};
	}, [particlesGeometry]);

	return (
		<>
			{showPerf && <Perf position={"top-left"} />}

			{/* background image  */}

			<mesh geometry={particlesGeometry} position={[0, 0.0, -0.0]}>
				<meshBasicMaterial
					map={phase === 2 ? highResImg : phase === 1 ? lowResImg : currentImg}
					opacity={1.0}
					needsUpdate={true}
					transparent
				/>
			</mesh>

			{showParticles && (
				<mesh key={gridSize}>
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
							pointSize={pointSize * dpr}
							//blending={THREE.AdditiveBlending}
						/>
					</points>
				</mesh>
			)}
		</>
	);
}
