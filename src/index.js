import ReactDOM from "react-dom/client";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { Perf } from "r3f-perf";

import "./styles.css";
import img from "./images/link.png";
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
import {
	useFluid,
	useSingleFBO,
	useFxTexture,
} from "@funtech-inc/use-shader-fx";
import { FXTargetShader } from "./FXshader";
import { RenderTargetShader } from "./shader";
import { useControls, Leva } from "leva";

function GridBox(props) {
	const ref = useRef(null);
	const textureRef = useRef();
	const shaderRef = useRef();
	const image = useTexture(img);
	const { size, camera, viewport } = useThree();
	const dpr = viewport.dpr;

	const {
		density_dissipation,
		velocity_dissipation,
		velocity_acceleration,
		splat_radius,
		curl_strength,
		pressure_iterations,
		showFluidTexture,
		pointSize,
		gridSize,
		mapIntensity,
		edgeIntensity,
		showImage,
		showParticles,
		showPerf,
	} = useControls({
		density_dissipation: {
			value: 0.99,
			min: 0,
			max: 1,
			step: 0.01,
		},
		velocity_dissipation: {
			value: 0.98,
			min: 0,
			max: 1,
			step: 0.01,
		},
		velocity_acceleration: {
			value: 30,
			min: 0,
			max: 100,
			step: 1,
		},
		splat_radius: {
			value: 0.25,
			min: 0,
			max: 10,
			step: 0.01,
		},
		curl_strength: {
			value: 25,
			min: 0,
			max: 100,
			step: 1,
		},
		pressure_iterations: {
			value: 7,
			min: 0,
			max: 100,
			step: 1,
		},
		showImage: {
			value: true,
		},

		showFluidTexture: {
			value: false,
		},
		showParticles: {
			value: true,
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
		mapIntensity: {
			value: -0.4,
			min: -2,
			max: 2,
			step: 0.1,
		},
		edgeIntensity: {
			value: 0.01,
			min: -2,
			max: 2,
			step: 0.01,
		},
		showPerf: {
			value: false,
		},
	});

	const [bg] = useLoader(THREE.TextureLoader, [img]);

	const [updateFluid, setFluid, { output }] = useFluid({
		size,
		dpr: {
			shader: 0.08,
			fbo: 0.2,
		},
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

	const aspectRatio = size.width / size.height;
	const fov = camera.fov * (Math.PI / 180); // Convert FOV from degrees to radians
	const height = 2 * Math.tan(fov / 2) * camera.position.z; // distance from the camera
	const width = height * aspectRatio;
	const particlesGeometry = useMemo(
		() => new THREE.PlaneGeometry(width, height, gridSize, gridSize),
		[gridSize] // This dependency ensures the geometry updates when gridSize changes
	);

	useFrame((props) => {
		updateFluid(props);
		const elapsedTime = props.clock.getElapsedTime();
		if (shaderRef.current) {
			shaderRef.current.uniforms.t.value = output;
			shaderRef.current.uniforms.time.value = elapsedTime * 0.1;
			if (shaderRef.current.uniforms.time.value > 1.0) {
				shaderRef.current.uniforms.time.value = 1.0;
			}

			if (showImage) {
				shaderRef.current.uniforms.t2.value = boxView.texture;
			} else {
				shaderRef.current.uniforms.t2.value = output;
			}
		}

		if (ref.current) {
			if (showImage) {
				const bgTexture = updateFxTexture(props, {
					map: output,
					padding: 0,
					mapIntensity: mapIntensity,
					edgeIntensity: edgeIntensity,
					texture0: showImage ? bg : output,
				});
				ref.current.uniforms.u_fx.value = bgTexture;
				ref.current.uniforms.u_alpha = 1.0;
			} else {
				ref.current.uniforms.u_fx.value = output;
			}
		}
		updateRenderTarget(props.gl);
	});

	useEffect(() => {
		console.log(viewport.width + "width " + viewport.height + "height");
	}, []);

	//cleanup old particles
	useEffect(() => {
		console.log("cleaning up old particles");
		return () => {
			particlesGeometry.dispose(); // Clean up the old geometry when component unmounts or gridSize changes
		};
	}, [particlesGeometry]);

	useEffect(() => {
		console.log("setingfluid");
		setFluid({
			density_dissipation: density_dissipation,
			velocity_dissipation: velocity_dissipation,
			velocity_acceleration: velocity_acceleration,
			splat_radius: splat_radius * 0.001,
			curl_strength: curl_strength,
			// fluid_color: new THREE.Color(0x000000),
			pressure_iterations: pressure_iterations,
		});
	}, [
		density_dissipation,
		velocity_dissipation,
		velocity_acceleration,
		splat_radius,
		curl_strength,
		pressure_iterations,
	]);

	return (
		<>
			{showPerf && <Perf position={"top-left"} />}
			{createPortal(
				<mesh>
					<planeGeometry args={[2, 2]} />
					<fXTargetShader ref={ref} u_fx={output} />
				</mesh>,
				offscreenScene
			)}
			{/* background image  */}
			{/* {showBackgroundImage && (
				<mesh geometry={particlesGeometry} position={[0, 0.0, -0.0]}>
					<meshBasicMaterial map={image} />
				</mesh>
			)} */}

			{showFluidTexture && (
				<mesh position={[0, 0.0, 0.0]}>
					<planeGeometry args={[width, height]} />
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

const App = () => {
	const [refresh, setRefresh] = useState(false);
	useEffect(() => {
		const handleResize = () => {
			console.log("Window resized", window.innerWidth, window.innerHeight);
			setRefresh((prev) => !prev);
			// setRefresh(true);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<Leva hidden={false} collapsed hideTitleBar />
			<Canvas>
				<GridBox key={refresh} />
				<ambientLight intensity={0.5} />
			</Canvas>
		</>
	);
};

const rootElement = document.getElementById("root");

// Create a root and render the App inside
ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
