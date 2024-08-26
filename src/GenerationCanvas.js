import React, { useEffect, useRef, useMemo, useState } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useScoreStore } from "./ScoreStore";
import { DistortionDepthShader } from "./DistortionDepthShader";
import { useControls } from "leva";

export function GenerationCanvas(props) {
	const {
		generatedImage,
		setGeneratedImage,
		setGenerationRequest,
		generationRequest,
		depthMapFrame,
		maskProgress,
		backgroundOpacity,
	} = useScoreStore();

	const distortionRef = useRef();
	const { size, camera, viewport } = useThree();
	const dpr = viewport.dpr;
	const aspectRatio = size.width / size.height;
	const fov = camera.fov * (Math.PI / 180);
	const height = 2 * Math.tan(fov / 2) * camera.position.z;
	const width = height * aspectRatio;
	const particlesGeometry = useMemo(
		() => new THREE.PlaneGeometry(width, height, 100, 100),
		[width, height]
	);

	const [currentImage, setCurrentImage] = useState(
		"https://fal-cdn.batuhan-941.workers.dev/files/panda/tcyQIxzxxwR5n3H71yvG-.jpeg"
	);
	const [nextImage, setNextImage] = useState(
		"https://fal-cdn.batuhan-941.workers.dev/files/panda/tcyQIxzxxwR5n3H71yvG-.jpeg"
	);
	const depthTexture = useLoader(
		THREE.TextureLoader,
		depthMapFrame ||
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
		if (distortionRef.current) {
			distortionRef.current.uniforms.backgroundOpacity.value =
				backgroundOpacity;
		}
	}, [backgroundOpacity]);

	useEffect(() => {
		if (generationRequest) {
			setPhase(0);
		}
	}, [generationRequest]);

	useEffect(() => {
		if (generatedImage) {
			const loader = new THREE.TextureLoader();
			loader.load(generatedImage, (texture) => {
				// Once the texture is loaded, update nextImage and start the transition
				setNextImage(generatedImage);
				if (distortionRef.current) {
					distortionRef.current.uniforms.t2.value = texture;
					setPhase(1);
				}
			});
		}
	}, [generatedImage]);

	useEffect(() => {
		if (nextImage !== currentImage) {
			// The transition will now start here, after the image has been loaded
			setPhase(1);
		}
	}, [nextImage, currentImage]);

	useFrame((state, delta) => {
		if (distortionRef.current) {
			const { uniforms } = distortionRef.current;
			if (depthMapFrame) {
				uniforms.tDepth.value = depthTexture;
				uniforms.maskProgress.value = maskProgress;
				uniforms.backgroundOpacity.value = backgroundOpacity;
			}

			uniforms.time.value += delta * 1.5;

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

			uniforms.scale.value = -6.0;
		}
	});

	return (
		<mesh geometry={particlesGeometry} position={[0, 0.0, -0.0]}>
			<distortionDepthShader ref={distortionRef} />
		</mesh>
	);
}
