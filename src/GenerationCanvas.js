import React, { useEffect, useRef, useMemo, useState } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useScoreStore } from "./ScoreStore";
import { DistortionShader } from "./DistortionShader";

export function GenerationCanvas(props) {
	const {
		generatedImage,
		setGeneratedImage,
		setGenerationRequest,
		generationRequest,
	} = useScoreStore();
	const distortionRef = useRef();
	const { size, camera, viewport } = useThree();
	const dpr = viewport.dpr;
	const aspectRatio = size.width / size.height;
	const fov = camera.fov * (Math.PI / 180);
	const height = 2 * Math.tan(fov / 2) * camera.position.z;
	const width = height * aspectRatio;
	const particlesGeometry = useMemo(
		() =>
			new THREE.PlaneGeometry(width, height, props.gridSize, props.gridSize),
		[props.gridSize, width, height]
	);

	const [currentImage, setCurrentImage] = useState(
		"https://fal-cdn.batuhan-941.workers.dev/files/panda/tcyQIxzxxwR5n3H71yvG-.jpeg"
	);
	const [nextImage, setNextImage] = useState(
		"https://fal-cdn.batuhan-941.workers.dev/files/panda/tcyQIxzxxwR5n3H71yvG-.jpeg"
	);

	const highResImg = useLoader(THREE.TextureLoader, currentImage);
	const lowResImg = useLoader(THREE.TextureLoader, nextImage);
	const [phase, setPhase] = useState(0);

	useEffect(() => {
		if (distortionRef.current) {
			distortionRef.current.uniforms.t.value = highResImg;
			distortionRef.current.uniforms.t2.value = lowResImg;
		}
	}, [highResImg, lowResImg]);

	useEffect(() => {
		if (generationRequest) {
			setPhase(0);
		}
	}, [generationRequest]);

	useEffect(() => {
		if (generatedImage) {
			setNextImage(generatedImage);
			setPhase(1);
		}
	}, [generatedImage]);

	useFrame((state, delta) => {
		if (distortionRef.current) {
			const { uniforms } = distortionRef.current;
			uniforms.time.value -= delta * 0.15;

			switch (phase) {
				case 0: // Distortion phase
					uniforms.progressDistortion.value = Math.min(
						uniforms.progressDistortion.value + 0.005,
						0.2
					);
					break;
				case 1: // Transition phase
					uniforms.t2.value = lowResImg;
					uniforms.progressImage.value = Math.min(
						uniforms.progressImage.value + 0.025,
						1.0
					);
					uniforms.progressDistortion.value = Math.max(
						uniforms.progressDistortion.value - 0.005,
						0
					);

					if (
						uniforms.progressImage.value === 1.0 &&
						uniforms.progressDistortion.value === 0
					) {
						setPhase(2);
					}
					break;
				case 2: // Reset phase
					uniforms.t.value = lowResImg;
					uniforms.t2.value = lowResImg;
					uniforms.progressImage.value = 0.0;
					setCurrentImage(nextImage);
					setGenerationRequest(false);
					break;
			}

			uniforms.scale.value = 5.0;
		}
	});

	return (
		<mesh geometry={particlesGeometry} position={[0, 0.0, -0.0]}>
			<distortionShader ref={distortionRef} />
		</mesh>
	);
}
