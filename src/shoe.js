import { forwardRef, useState, Suspense, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Html, ContactShadows, Points, Float } from "@react-three/drei";
import * as THREE from "three";
import { PRWMLoader } from "three/examples/jsm/loaders/PRWMLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

//THIS FILE ISNT USED IN THE FINAL PROJECT

const Model = () => {
	// * is automatically replaced by 'le' or 'be' depending on the client platform's endianness
	const [colorMap] = useLoader(TextureLoader, [
		"https://cdn.arcsineimaging.com/models/yeezy-700-v3-kyanitev2_98846271010b/textures/2k/base_texture.jpg",
	]);

	const url =
		"https://cdn.arcsineimaging.com/models/yeezy-700-v3-kyanitev2_98846271010b/model.*.bin";
	const geometry = useLoader(PRWMLoader, url);
	const uvs = geometry.attributes.uv.array;
	geometry.computeVertexNormals();

	return (
		<mesh scale={5} position={[0, -0.29, 0]} rotation={[0, Math.PI / 2, 0]}>
			<bufferGeometry {...geometry}>
				<bufferAttribute
					attachObject={["attributes", "uv2"]}
					array={uvs}
					itemSize={2}
				/>
			</bufferGeometry>
			<meshStandardMaterial map={colorMap} />
		</mesh>
	);
};

const Particle = () => {
	const [colorMap] = useLoader(TextureLoader, [
		"https://cdn.arcsineimaging.com/models/yeezy-700-v3-kyanitev2_98846271010b/textures/2k/base_texture.jpg",
	]);

	const url =
		"https://cdn.arcsineimaging.com/models/yeezy-700-v3-kyanitev2_98846271010b/model.*.bin";
	const geometry = useLoader(PRWMLoader, url);

	geometry.computeVertexNormals();
	const uvs = geometry.attributes.uv.array;
	geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

	let m = new THREE.PointsMaterial({
		map: colorMap,
		sizeAttenuation: false,
		size: 2.529,
		onBeforeCompile: (shader) => {
			shader.vertexShader = `
        // varying vec2 vUv;
        ${shader.vertexShader}
      `.replace(
				`#include <begin_vertex>`,
				`#include <begin_vertex>
          vUv = uv;
        `
			);
			console.log(shader.vertexShader);
			shader.fragmentShader = `
        // varying vec2 vUv;
        ${shader.fragmentShader}
      `.replace(
				`#include <map_particle_fragment>`,
				`	
          vec4 mapTexel = texture2D( map, vUv );
          diffuseColor *= mapTexel;
        `
			);
			// console.log(shader.fragmentShader);
		},
	});

	return (
		<>
			<mesh scale={8} position={[0, -0.35, 3]}>
				<points geometry={geometry} material={m} />
			</mesh>
		</>
	);
};

export function Shoe() {
	return (
		<Suspense fallback={<Html>Loading...</Html>}>
			<color attach="background" args={["black"]} />
			<mesh>
				<Float>
					<Model />
				</Float>
			</mesh>
			<ContactShadows
				rotation-x={Math.PI / 2}
				position={[0, -0.5, 0]}
				opacity={0.75}
				width={2.5}
				height={2.5}
				blur={0.5}
				far={0.8}
			/>
		</Suspense>
	);
}

export function ParticleShoe() {
	return (
		<Suspense fallback={<Html>Loading...</Html>}>
			{/* <color attach="background" args={["black"]} /> */}
			<Particle />
		</Suspense>
	);
}
