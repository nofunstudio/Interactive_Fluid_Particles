import React, { useEffect, useRef, useMemo, useState } from "react";
import {
	Canvas,
	useFrame,
	useThree,
	createPortal,
	useLoader,
} from "@react-three/fiber";
import {
	MeshStandardMaterial,
	DepthTexture,
	WebGLRenderTarget,
	PlaneGeometry,
	Mesh,
	Scene,
	OrthographicCamera,
	RGBAFormat,
	FloatType,
} from "three";

import * as THREE from "three";
import { useControls, Leva } from "leva";
import {
	PivotControls,
	GizmoHelper,
	GizmoViewport,
	Grid,
	Environment,
	Backdrop,
	useTexture,
	Splat,
} from "@react-three/drei";
import { PivotWrapper } from "./PivotWrapper";
import { DepthShader } from "./depthShader";
import { uploadAndFetchData } from "./Api";
import { useScoreStore } from "./ScoreStore";
import { Suzanne } from "./Suzanne";
import { depth } from "three/examples/jsm/nodes/Nodes.js";
import { Human } from "./Human";
import { Axe } from "./Axe";
import { ModelGenerated } from "./ModelGenerated";
import { uploadAndFetch3D } from "./Api3DTripo";
import { uploadAndFetchStabilityAI3D } from "./Api3Dfast";
import loading from "./images/loadingAi.png";
import { Cybertruck } from "./Cybertruck";
import selectImg from "./images/selectAi.png";
import { uploadAndFetchDataFlux } from "./ApiFlux";
import { uploadAndFetchData360 } from "./api360";
import envMap from "./images/stad2.png";
import EnvironmentShader from "./EnvironmentShader";
import { uploadAndFetchDataFaceFlux } from "./apiFaceFlux";
import { uploadAndFetchDataFluxDepth } from "./ApiFluxDepth";

export function Playground() {
	const {
		generatedImage,
		generationRequest,
		setGeneratedImage,
		setGenerationRequest,
		depthMapFrame,
		setDepthMapFrame,
		generatedModel,
		setGeneratedModel,
		generationRequestModel,
		setGenerationRequestModel,
		activeMenu,
		promptText,
		promptImage,
		setGenerationRequestEnvironment,
		generationRequestEnvironment,
		setGeneratedEnvironment,
		generatedEnvironment,
		faceInputImage,
		setFaceInputImage,
		isGenerating,
		setIsGenerating,
	} = useScoreStore();

	const { scene, gl, camera, size } = useThree();
	const depthRef = useRef();
	const environmentRef = useRef();
	const envMaterialRef = useRef();
	const loadingTexture = useTexture(loading);
	const selectTexture = useTexture(selectImg);
	const [modelArray, setModelArray] = useState([]);

	// Create a depth texture and a render target for the main scene
	const depthTexture = useMemo(() => new DepthTexture(), []);
	const renderTarget = useMemo(
		() =>
			new WebGLRenderTarget(512, 512, {
				depthTexture: depthTexture,
				depthBuffer: true,
				format: RGBAFormat,
				type: FloatType,
				generateMipmaps: false,
			}),
		[,]
	);

	// Create a separate render target for the depth shader result
	const depthShaderTarget = useMemo(
		() =>
			new WebGLRenderTarget(512, 512, { format: RGBAFormat, type: FloatType }),
		[]
	);

	// Create a separate scene and camera for rendering the depth shader
	const depthScene = useMemo(() => new Scene(), []);
	const depthCamera = useMemo(
		() => new OrthographicCamera(-1, 1, 1, -1, 0, 1),
		[]
	);

	const pingPongTarget = useMemo(() => new WebGLRenderTarget(512, 512), []);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		const handleTextureToImage = async () => {
			const processTexture = (target, setter) => {
				const buffer = new Float32Array(512 * 512 * 4);
				gl.readRenderTargetPixels(target, 0, 0, 512, 512, buffer);

				const canvas = document.createElement("canvas");
				canvas.width = 512;
				canvas.height = 512;
				const context = canvas.getContext("2d");

				const imageData = context.createImageData(512, 512);
				for (let i = 0; i < buffer.length; i += 4) {
					const r = Math.pow(buffer[i], 1 / 2.2) * 255;
					const g = Math.pow(buffer[i + 1], 1 / 2.2) * 255;
					const b = Math.pow(buffer[i + 2], 1 / 2.2) * 255;
					const a = buffer[i + 3] * 255;

					const row = Math.floor(i / 4 / 512);
					const col = (i / 4) % 512;
					const flippedIndex = ((511 - row) * 512 + col) * 4;

					imageData.data[flippedIndex] = r;
					imageData.data[flippedIndex + 1] = g;
					imageData.data[flippedIndex + 2] = b;
					imageData.data[flippedIndex + 3] = a;
				}
				context.putImageData(imageData, 0, 0);

				const base64Data = canvas.toDataURL("image/png");
				setter(base64Data);
				return base64Data;
			};
			console.log("generation false!!!!!!");
			setGenerationRequest(false);

			// Process renderTarget
			const renderTargetBase64 = processTexture(renderTarget, setDepthMapFrame);

			// Process depthShaderTarget
			const depthShaderTargetBase64 = processTexture(
				depthShaderTarget,
				setDepthMapFrame
			);

			if (activeMenu === "Cybertruck") {
				await uploadAndFetchData(
					renderTargetBase64,
					setGeneratedImage,
					setGenerationRequest,
					promptText
				);
			} else if (activeMenu !== "Face") {
				await uploadAndFetchDataFluxDepth(
					renderTargetBase64,
					depthShaderTargetBase64,
					setGeneratedImage,
					setGenerationRequest,
					promptText
				);
			}
		};

		if (isGenerating && !isLoading) {
			setGenerationRequest(true);
			handleTextureToImage();
		} else {
			setLoading(false);
		}
	}, [isGenerating, gl, depthShaderTarget, renderTarget]);
	const [faceImageURL, setFaceImageURL] = useState(null);
	const [faceTexture, setFaceTexture] = useState(null);

	useEffect(() => {
		if (faceInputImage) {
			const objectURL = URL.createObjectURL(faceInputImage);
			setFaceImageURL(objectURL);

			return () => {
				URL.revokeObjectURL(objectURL);
			};
		}
	}, [faceInputImage]);

	useEffect(() => {
		if (faceImageURL) {
			const loader = new THREE.TextureLoader();
			loader.load(
				faceImageURL,
				(texture) => {
					setFaceTexture(texture);
				},
				undefined,
				(error) => {
					console.error("Error loading texture:", error);
				}
			);
			uploadAndFetchDataFaceFlux(
				faceInputImage,
				setGeneratedImage,
				setGenerationRequest,
				promptText
			);
		}
	}, [faceImageURL]);

	useEffect(() => {
		const texture_resolution = "1024";
		const foreground_ratio = 0.85;
		if (promptImage && !generationRequestModel) {
			// uploadAndFetch3D(setGeneratedModel, setGenerationRequestModel);
			uploadAndFetchStabilityAI3D(
				setGeneratedModel,
				setGenerationRequestModel,
				promptImage,
				texture_resolution,
				foreground_ratio
			);
		}
	}, [promptImage]);

	useFrame((state, delta) => {
		const originalCameraLayers = camera.layers.mask;
		camera.layers.disable(1);
		// Render main scene to render target
		gl.setRenderTarget(renderTarget);
		gl.render(scene, camera);

		if (environmentRef.current) {
			environmentRef.current.uniforms.time.value += delta * 1.5;
		}

		// NEW: Ping-pong rendering for depth shader
		if (depthRef.current) {
			// First pass: Render depth shader using main scene depth texture
			gl.setRenderTarget(pingPongTarget);
			depthRef.current.uniforms.uDepthTexture.value = renderTarget.depthTexture;
			gl.render(depthScene, depthCamera);

			// Second pass: Render depth shader using result from first pass
			gl.setRenderTarget(depthShaderTarget);
			depthRef.current.uniforms.uDepthTexture.value = pingPongTarget.texture;
			gl.render(depthScene, depthCamera);
		}
		camera.layers.enableAll();
		// Reset render target
		gl.setRenderTarget(null);
	});

	useEffect(() => {
		// Set up the depth shader scene
		const quad = new Mesh(new PlaneGeometry(2, 2), depthRef.current);
		depthScene.add(quad);
	}, []);
	useEffect(() => {
		camera.layers.enableAll();
		camera.layers.disable(1);
	}, [camera]);

	useEffect(() => {
		if (generatedModel) {
			setModelArray((prevArray) => [...prevArray, generatedModel]);
		}
	}, [generatedModel]);

	const renderModels = () => {
		return modelArray.map((model, index) => (
			<ModelGenerated
				generationRequest={generationRequest}
				key={index}
				generatedModel={model}
				position={[index * 0.5 - (modelArray.length - 1), 0, 0]}
			/>
		));
	};
	const defaultEnvTexture = useLoader(THREE.TextureLoader, envMap);
	const [envTexture, setEnvTexture] = useState(defaultEnvTexture);

	useEffect(() => {
		if (generatedEnvironment) {
			console.log("Loading generated environment:", generatedEnvironment);
			const loader = new THREE.TextureLoader();
			loader.load(
				generatedEnvironment,
				(texture) => {
					console.log("New texture loaded:", texture);
					texture.mapping = THREE.EquirectangularReflectionMapping;
					setEnvTexture(texture);
					if (environmentRef.current) {
						environmentRef.current.uniforms.progress.value = 1.0;
						environmentRef.current.uniforms.t1.value = texture;
					}
				},
				undefined,
				(error) => console.error("Error loading texture:", error)
			);
			if (envMaterialRef.current) {
				envMaterialRef.current.needsUpdate = true;
				envMaterialRef.current.toneMapped = false;
			}
		} else {
			if (environmentRef.current) {
				environmentRef.current.uniforms.t1.value = defaultEnvTexture;
				environmentRef.current.needsUpdate = true;
			}
		}
	}, [generatedEnvironment]);
	//360 environment map

	useEffect(() => {
		if (activeMenu === "360") {
			uploadAndFetchData360(
				setGeneratedEnvironment,
				setGenerationRequestEnvironment,
				promptText
			);
		} else if (activeMenu === "Face") {
			// prompt upload image dialog
			const fileInput = document.createElement("input");
			fileInput.type = "file";
			fileInput.accept = "image/*";
			fileInput.onchange = (event) => {
				const file = event.target.files[0];
				if (file) {
					setFaceInputImage(file);
				}
			};
			fileInput.click();
		}
	}, [activeMenu]);

	useEffect(() => {
		if (environmentRef.current) {
			if (generationRequestEnvironment) {
				environmentRef.current.uniforms.progress.value = 0.0;
			}
		}
	}, [generationRequestEnvironment]);

	return (
		<>
			{/* <Environment
				files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/autumn_field_puresky_1k.hdr"
				// files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/little_paris_eiffel_tower_1k.hdr"
				background={activeMenu === "Ai3D" ? true : false}
			/> */}

			<Environment background={true} environmentIntensity={2.0}>
				<mesh scale={100}>
					<sphereGeometry args={[1, 64, 64]} />
					<meshBasicMaterial
						map={envTexture}
						side={THREE.BackSide}
						ref={envMaterialRef}
					/>
					{/* <environmentShader ref={environmentRef} side={THREE.BackSide} /> */}
				</mesh>
			</Environment>

			{/* <PivotWrapper /> */}
			{activeMenu === "Monkey" && <Suzanne />}
			{activeMenu === "Human" && <Human />}
			{activeMenu === "Axe" && <Axe />}
			{activeMenu === "Face" && faceTexture && (
				<mesh>
					<planeGeometry args={[2.5, 2.5]} />
					<meshBasicMaterial map={faceTexture} />
				</mesh>
			)}
			{activeMenu === "Shoe" && (
				<Splat
					src={
						"https://huggingface.co/cakewalk/splat-data/resolve/main/nike.splat"
					}
					scale={1.5}
					position={[1, 3, 1]}
					alphaTest={0.1}
				/>
			)}
			{activeMenu === "360" && (
				<>
					{!generationRequestEnvironment && (
						<mesh scale={0.5}>
							<sphereGeometry args={[1, 64, 64]} />
							<meshStandardMaterial
								color={"grey"}
								roughness={0.1}
								metalness={0.9}
							/>
						</mesh>
					)}
				</>
			)}

			<mesh scale={5}>
				<sphereGeometry args={[1, 64, 64]} />

				<environmentShader ref={environmentRef} side={THREE.BackSide} />
			</mesh>

			{activeMenu === "Ai3D" &&
				(modelArray.length > 0 ? (
					renderModels()
				) : (
					<>
						<group position={[0, -0.5, 0]}>
							<Grid
								gridSize={[10.5, 10.5]}
								cellSize={0.6}
								cellThickness={1}
								cellColor={"#ffffff"}
								sectionSize={3.3}
								sectionThickness={1.5}
								sectionColor={"#f0f0f0"}
								fadeDistance={25}
								fadeStrength={1}
								followCamera={false}
								infiniteGrid={true}
							/>
						</group>

						<mesh position={[0, 0.5, 0]}>
							<planeGeometry args={[1.0, 1.0]} />
							<meshBasicMaterial
								map={generationRequestModel ? loadingTexture : selectTexture}
								transparent
								opacity={0.9}
							/>
						</mesh>
					</>
				))}

			<mesh position={[-0.5, 0.5, 1.0]} layers={1}>
				<planeGeometry args={[0.25, 0.25]} />
				<depthShader ref={depthRef} />
			</mesh>
		</>
	);
}
