import React, { useEffect, useRef, useMemo, useState } from "react";
import { Perf } from "r3f-perf";

import "./styles.css";
import { imageList } from "./imageList";
import {
	Canvas,
	useFrame,
	useThree,
	createPortal,
	useLoader,
} from "@react-three/fiber";
import { DoubleSide, Vector2 } from "three";
import * as THREE from "three";
import { RenderTargetShader } from "./shader";
import { DistortionShader } from "./DistortionShader";
import { useControls, Leva } from "leva";

export function GridBox(props) {
	const { pointSize, gridSize, distScale, distort, showPerf } = useControls({
		pointSize: {
			value: 0.5,
			min: 0.1,
			max: 25,
			step: 0.1,
		},
		distort: {
			value: 0.1,
			min: 0.01,
			max: 1,
			step: 0.01,
		},
		distScale: {
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

	const shaderRef = useRef();
	const distortionRef = useRef();
	const { size, camera, viewport } = useThree();
	const dpr = viewport.dpr;
	const aspectRatio = size.width / size.height;
	const fov = camera.fov * (Math.PI / 180); // Convert FOV from degrees to radians
	const height = 2 * Math.tan(fov / 2) * camera.position.z; // distance from the camera
	const width = height * aspectRatio;
	const particlesGeometry = useMemo(
		() => new THREE.PlaneGeometry(width, height, gridSize, gridSize),
		[gridSize] // This dependency ensures the geometry updates when gridSize changes
	);

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const highResImg = useLoader(THREE.TextureLoader, [
		imageList[currentImageIndex].highRes,
	])[0];
	const lowResImg = useLoader(THREE.TextureLoader, [
		imageList[currentImageIndex].lowRes,
	])[0];

	// Use a ref to store the current high-res image
	const currentHighResImgRef = useRef(highResImg);

	const [generationRequested, setGenerationRequested] = useState(true);
	const [generationComplete, setGenerationComplete] = useState(false);
	const [phase, setPhase] = useState(0);

	// update the shader with the current images when they change
	useEffect(() => {
		if (shaderRef.current) {
			shaderRef.current.uniforms.t.value = currentHighResImgRef.current; // Use the stored high-res image
			shaderRef.current.uniforms.t2.value = lowResImg;
		}

		if (distortionRef.current) {
			distortionRef.current.uniforms.t.value = currentHighResImgRef.current;
			distortionRef.current.uniforms.t2.value = lowResImg;
		}
	}, [currentHighResImgRef.current, lowResImg]);

	//simulates loading the next batch of images for generation
	const cycleImages = () => {
		const nextIndex = (currentImageIndex + 1) % imageList.length;
		setCurrentImageIndex(nextIndex);
	};

	const resetValues = () => {
		setGenerationRequested(false);
		setGenerationComplete(true);
		//creates a loop simulating continous image generation on timer
		setTimeout(() => {
			cycleImages();
			setGenerationRequested(true);
		}, 1000);
	};

	//prototype simulating delay of image generation from the server
	useEffect(() => {
		if (generationRequested) {
			setPhase(0);

			setTimeout(() => {
				setPhase(1);
			}, 1000);

			setTimeout(() => {
				setPhase(2);
			}, 2000);
		}
	}, [generationRequested]);

	useFrame((props) => {
		const elapsedTime = props.clock.getElapsedTime();
		if (shaderRef.current) {
			if (phase === 0) {
				if (shaderRef.current.uniforms.progressDistortion.value < 0.99) {
					shaderRef.current.uniforms.progressDistortion.value += 0.01;
				}
			} else if (phase === 1) {
				shaderRef.current.uniforms.t2.value = lowResImg;
				if (shaderRef.current.uniforms.progressDistortion.value > 0.35) {
					shaderRef.current.uniforms.progressDistortion.value -= 0.005;
				}

				if (shaderRef.current.uniforms.progressImage.value <= 0.95) {
					shaderRef.current.uniforms.progressImage.value += 0.05;
				}
			} else if (phase === 2) {
				currentHighResImgRef.current = highResImg; // Update the stored high-res image
				shaderRef.current.uniforms.t.value = currentHighResImgRef.current; // Update shader with new high-res image

				if (shaderRef.current.uniforms.progressImage.value >= 0.05) {
					shaderRef.current.uniforms.progressImage.value -= 0.05;
				}
				if (shaderRef.current.uniforms.progressDistortion.value >= 0.01) {
					shaderRef.current.uniforms.progressDistortion.value -= 0.01;
				} else {
					resetValues();
				}
			}

			shaderRef.current.uniforms.time.value = elapsedTime * 0.1;
		}
		if (distortionRef.current) {
			distortionRef.current.uniforms.time.value = elapsedTime * -0.15;
			if (phase === 0) {
				if (distortionRef.current.uniforms.progressDistortion.value < 0.2) {
					distortionRef.current.uniforms.progressDistortion.value += 0.005;
				}
			} else if (phase === 1) {
				distortionRef.current.uniforms.t2.value = lowResImg;
				if (distortionRef.current.uniforms.progressImage.value < 1.0) {
					distortionRef.current.uniforms.progressImage.value += 0.025;
				}

				if (distortionRef.current.uniforms.progressDistortion.value > 0.075) {
					distortionRef.current.uniforms.progressDistortion.value -= 0.005;
				}
			} else if (phase === 2) {
				distortionRef.current.uniforms.t.value = currentHighResImgRef.current;
				if (distortionRef.current.uniforms.progressImage.value > 0.01) {
					distortionRef.current.uniforms.progressImage.value -= 0.01;
				}
				if (distortionRef.current.uniforms.progressDistortion.value > 0.0) {
					distortionRef.current.uniforms.progressDistortion.value -= 0.0015;
				}
			}
			distortionRef.current.uniforms.scale.value = distScale;
		}
	});

	// Cleanup old particles
	useEffect(() => {
		console.log("cleaning up old particles");
		return () => {
			particlesGeometry.dispose(); // Clean up the old geometry when component unmounts or gridSize changes
		};
	}, [particlesGeometry]);

	return (
		<>
			{showPerf && <Perf position={"top-left"} />}

			<mesh geometry={particlesGeometry} position={[0, 0.0, -0.0]}>
				<distortionShader ref={distortionRef} />
			</mesh>

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
		</>
	);
}
