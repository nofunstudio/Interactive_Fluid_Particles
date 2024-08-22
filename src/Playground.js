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
} from "three";

import * as THREE from "three";
import { useControls, Leva } from "leva";
import {
	PivotControls,
	GizmoHelper,
	GizmoViewport,
	Grid,
	Environment,
} from "@react-three/drei";
import { PivotWrapper } from "./PivotWrapper";
import { DepthShader } from "./depthShader";
import { uploadAndFetchData } from "./Api";

export function Playground(isGenerating) {
	const { scene, gl, camera, size } = useThree();
	const depthRef = useRef();

	// Create a depth texture and a render target for the main scene
	const depthTexture = useMemo(() => new DepthTexture(), []);
	const renderTarget = useMemo(
		() =>
			new WebGLRenderTarget(size.width, size.height, {
				depthTexture: depthTexture,
				depthBuffer: true,
			}),
		[size.width, size.height]
	);

	// Create a separate render target for the depth shader result
	const depthShaderTarget = useMemo(
		() => new WebGLRenderTarget(size.width, size.height),
		[size.width, size.height]
	);

	// Create a separate scene and camera for rendering the depth shader
	const depthScene = useMemo(() => new Scene(), []);
	const depthCamera = useMemo(
		() => new OrthographicCamera(-1, 1, 1, -1, 0, 1),
		[]
	);

	useEffect(() => {
		const handleTextureToImage = async () => {
			const { width, height } = size;
			// Extract pixel data from the depth shader target
			const buffer = new Uint8Array(width * height * 4);
			gl.readRenderTargetPixels(depthShaderTarget, 0, 0, width, height, buffer);

			// Convert to a Base64 string
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const context = canvas.getContext("2d");

			const imageData = context.createImageData(width, height);
			imageData.data.set(buffer);
			context.putImageData(imageData, 0, 0);

			const base64Data = canvas.toDataURL("image/png"); // Convert canvas to Base64

			// Upload the Base64 image and fetch data
			await uploadAndFetchData(base64Data);
		};
		if (isGenerating) {
			handleTextureToImage();
		}
	}, [isGenerating, gl, depthShaderTarget, size]);

	useFrame(() => {
		// Render main scene to render target
		gl.setRenderTarget(renderTarget);
		gl.render(scene, camera);

		// Render depth shader to its own target
		if (depthRef.current) {
			depthRef.current.uniforms.uDepthTexture.value = depthTexture;
			gl.setRenderTarget(depthShaderTarget);
			gl.render(depthScene, depthCamera);
		}

		// Reset render target
		gl.setRenderTarget(null);
	});

	useEffect(() => {
		// Set up the depth shader scene
		const quad = new Mesh(new PlaneGeometry(2, 2), depthRef.current);
		depthScene.add(quad);
	}, []);

	return (
		<>
			<Environment
				files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/autumn_field_puresky_1k.hdr"
				background={true}
			/>

			<PivotWrapper />
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

			<mesh position={[-0.5, 0.5, 1.0]}>
				<planeGeometry args={[0.25, 0.25]} />
				<depthShader ref={depthRef} />
			</mesh>
		</>
	);
}
