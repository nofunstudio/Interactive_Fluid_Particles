import React, { useEffect, useRef, useMemo, useState } from "react";
import { Perf } from "r3f-perf";

import "./styles.css";
import img from "./images/link.png";
import img2 from "./images/link.png";
import img3 from "./images/link.png";
import img4 from "./images/bluenoise.png";
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
import { useSingleFBO } from "@funtech-inc/use-shader-fx";
import { FXTargetShader } from "./FXshaderdupe";
import { RenderTargetShader } from "./shader";
import { useControls, Leva } from "leva";

export function GridBox(props) {
	const ref = useRef(null);
	const textureRef = useRef();
	const shaderRef = useRef();
	const image = useTexture(img);
	const { size, camera, viewport } = useThree();
	const dpr = viewport.dpr;

	const {
		showDisplacementTexture,
		pointSize,
		gridSize,
		showImage,
		showPerf,
		requestGeneration,
	} = useControls({
		showImage: {
			value: true,
		},

		showDisplacementTexture: {
			value: false,
		},
		pointSize: {
			value: 4,
			min: 0.1,
			max: 25,
			step: 0.1,
		},
		gridSize: {
			value: 100,
			min: 10,
			max: 500,
			step: 10,
		},
		showPerf: {
			value: false,
		},
		requestGeneration: {
			value: false,
		},
	});

	const [currentImg] = useLoader(THREE.TextureLoader, [img]);
	const [lowResImg] = useLoader(THREE.TextureLoader, [img2]);
	const [highResImg] = useLoader(THREE.TextureLoader, [img3]);
	const [noiseImg] = useLoader(THREE.TextureLoader, [img4]);
	const [generationRequested, setGenerationRequested] = useState(true);
	const [transitionNoise, setTransitionNoise] = useState(0.0);
	const [transition1, setTransition1] = useState(0.0);
	const [transition2, setTransition2] = useState(0.0);
	const [transitionNoiseActive, setTransitionNoiseActive] = useState(false);
	const [transition1Active, setTransition1Active] = useState(false);
	const [transition2Active, setTransition2Active] = useState(false);
	const [generationComplete, setGenerationComplete] = useState(false);
	const [showParticles, setShowParticles] = useState(true);

	const resetValues = () => {
		setShowParticles(false);
		setTransition2Active(false);
		setTransition1Active(false);
		setGenerationRequested(false);
		setGenerationComplete(false);
		setTransitionNoise(0.0);
		setTransition1(0.0);
		setTransition2(0.0);
		//set in a loop for testing
		setTimeout(() => {
			setGenerationRequested(true);
		}, 100);
	};

	const offscreenScene = useMemo(() => new THREE.Scene(), []);

	const [boxView, updateRenderTarget] = useSingleFBO({
		scene: offscreenScene,
		camera,
		size,
		dpr,
		samples: 4,
	});

	const aspectRatio = size.width / size.height;
	const fov = camera.fov * (Math.PI / 180); // Convert FOV from degrees to radians
	const height = 2 * Math.tan(fov / 2) * camera.position.z; // distance from the camera
	const width = height * aspectRatio;
	const particlesGeometry = useMemo(
		() => new THREE.PlaneGeometry(width, height, gridSize, gridSize),
		[gridSize] // This dependency ensures the geometry updates when gridSize changes
	);

	useFrame((props) => {
		if (generationRequested) {
			console.log(transitionNoise);
			if (transitionNoiseActive && transitionNoise <= 0.99) {
				setTransitionNoise(transitionNoise + 0.01);
			}
			//return to original position
			if (!transitionNoiseActive) {
				if (transitionNoise >= 0.01) {
					setTransitionNoise(transitionNoise - 0.01);
				}
			}

			if (transition1Active && transition1 < 1.0) {
				setTransition1(transition1 + 0.01);
			}
			if (transition2Active) {
				//final transition begins
				if (transition2 < 0.99) {
					setTransition2(transition2 + 0.01);
				} else {
					resetValues();
				}
			}
		}

		const elapsedTime = props.clock.getElapsedTime();
		if (shaderRef.current) {
			shaderRef.current.uniforms.t.value = boxView.texture;
			shaderRef.current.uniforms.transition1.value = transition1;
			shaderRef.current.uniforms.transition2.value = transition2;
			shaderRef.current.uniforms.transitionNoise.value = transitionNoise;
			shaderRef.current.uniforms.time.value = elapsedTime * 0.1;

			if (showImage) {
				shaderRef.current.uniforms.t2.value = currentImg;
				shaderRef.current.uniforms.t3.value = lowResImg;
				shaderRef.current.uniforms.t4.value = highResImg;
			} else {
				//displacement texture debug
				shaderRef.current.uniforms.t2.value = boxView.texture;
			}
		}

		if (ref.current) {
			if (ref.current.uniforms.u_progress < 0.99) {
				ref.current.uniforms.u_progress = +0.01;
			} else {
				ref.current.uniforms.u_progress = 0.0;
			}
		}
		updateRenderTarget(props.gl);
	});

	//cleanup old particles
	useEffect(() => {
		console.log("cleaning up old particles");
		return () => {
			particlesGeometry.dispose(); // Clean up the old geometry when component unmounts or gridSize changes
		};
	}, [particlesGeometry]);

	useEffect(() => {
		if (generationRequested) {
			setShowParticles(true);

			setTransitionNoiseActive(true);

			setTimeout(() => {
				//noise needs to return to original position
				setTransitionNoiseActive(false);
				setTransition1Active(true);
			}, 800);

			setTimeout(() => {
				setTransition1Active(false);
				setGenerationComplete(true);
				setTransition2Active(true);
			}, 1200);
		}
	}, [generationRequested]);

	return (
		<>
			{showPerf && <Perf position={"top-left"} />}
			{createPortal(
				<mesh>
					<planeGeometry args={[2, 2]} />
					<fXTargetShader ref={ref} u_fx={noiseImg} u_progress={0.5} />
				</mesh>,
				offscreenScene
			)}
			{/* background image  */}

			<mesh geometry={particlesGeometry} position={[0, 0.0, -0.0]}>
				<meshBasicMaterial
					map={highResImg}
					opacity={1 - transition1 + transition2}
					transparent
				/>
			</mesh>

			{showDisplacementTexture && (
				<mesh geometry={particlesGeometry} position={[0, 0.0, -0.0]}>
					<meshBasicMaterial map={boxView.texture} />
				</mesh>
			)}
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
