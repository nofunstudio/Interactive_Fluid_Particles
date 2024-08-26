import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Cybertruck(props) {
	const { nodes, materials } = useGLTF("/cybertruck.glb");
	return (
		<group {...props} dispose={null}>
			<group
				scale={0.05}
				position={[-0.2, -0.5, 0.25]}
				rotation={[0.065, 0.6, 0]}
			>
				<group
					position={[0, 3.748, 6.035]}
					rotation={[0.065, 0, 0]}
					scale={1.503}
				>
					<group
						position={[0, 0.418, 2.714]}
						rotation={[-0.056, 0, 0]}
						scale={0.893}
					>
						<group position={[2.63, 2.644, -0.022]}>
							<mesh
								frustumCulled={false}
								castShadow
								receiveShadow
								geometry={nodes.polySurface51_M_MainColor_0.geometry}
							>
								<meshStandardMaterial
									color={0xa5a5a5}
									roughness={0.0}
									metalness={1.0}
								/>
							</mesh>
							<mesh
								castShadow
								receiveShadow
								geometry={nodes.polySurface51_M_Bottom_0.geometry}
								material={materials.M_Bottom}
							/>
							<mesh
								castShadow
								receiveShadow
								geometry={nodes.polySurface51_M_SideRed_0.geometry}
								material={materials.M_SideRed}
							/>
							<mesh
								castShadow
								receiveShadow
								geometry={nodes.polySurface51_M_Black_0.geometry}
								material={materials.M_Black}
							/>
							<mesh
								castShadow
								receiveShadow
								geometry={nodes.polySurface51_M_WhIteLamp_0.geometry}
								material={materials.M_WhIteLamp}
							/>
							<mesh
								castShadow
								receiveShadow
								geometry={nodes.polySurface51_M_SidesShade_0.geometry}
								material={materials.M_SidesShade}
							/>
							<mesh
								castShadow
								receiveShadow
								geometry={nodes.polySurface51_M_RedMiddle_0.geometry}
								material={materials.M_RedMiddle}
							/>
							<mesh
								castShadow
								receiveShadow
								geometry={nodes.polySurface51_M_Shade_0.geometry}
								material={materials.M_Shade}
							/>
						</group>
						<mesh
							castShadow
							receiveShadow
							geometry={nodes.polySurface46_M_Board_0.geometry}
							material={materials.M_Board}
							position={[2.63, 2.652, -0.022]}
						/>
						<mesh
							castShadow
							receiveShadow
							geometry={nodes.polySurface44_M_Board_0.geometry}
							material={materials.M_Board}
							position={[2.63, 2.785, -0.023]}
						/>
						<mesh
							castShadow
							receiveShadow
							geometry={nodes.polySurface42_M_Board_0.geometry}
							material={materials.M_Board}
							position={[2.63, 2.654, -0.022]}
						/>
						<mesh
							castShadow
							receiveShadow
							geometry={nodes.polySurface40_M_Board_0.geometry}
							material={materials.M_Board}
							position={[2.63, 2.656, -0.022]}
						/>
						<mesh
							castShadow
							receiveShadow
							geometry={nodes.polySurface14_M_SideWings_0.geometry}
							material={materials.M_SideWings}
							position={[2.63, 3.321, 0.457]}
							rotation={[0.08, 0, 0]}
						/>
						<mesh
							castShadow
							receiveShadow
							geometry={nodes.polySurface3_M_SideWings_0.geometry}
							material={materials.M_SideWings}
							position={[2.63, 2.632, 0.004]}
							rotation={[0.028, 0, 0]}
						/>
					</group>
				</group>
				<group
					position={[4.01, 4.056, 13.242]}
					rotation={[0.045, 0, -Math.PI / 2]}
					scale={1.048}
				>
					<group position={[0, -5.882, 0]}>
						<group
							position={[0.191, -5.85, -23.845]}
							rotation={[0.004, -0.012, -0.002]}
						>
							<mesh
								castShadow
								receiveShadow
								geometry={nodes.polySurface31_M_SideWings_0.geometry}
								material={materials.M_SideWings}
								position={[-3.394, 3.361, -0.126]}
							/>
							<mesh
								castShadow
								receiveShadow
								geometry={nodes.polySurface32_M_SideWings_0.geometry}
								material={materials.M_SideWings}
								position={[-3.38, -2.438, -0.102]}
							/>
						</group>
						<mesh
							castShadow
							receiveShadow
							geometry={nodes.polySurface17_M_SideWings_0.geometry}
							material={materials.M_SideWings}
							position={[-3.384, 3.37, -0.154]}
						/>
						<mesh
							castShadow
							receiveShadow
							geometry={nodes.polySurface18_M_SideWings_0.geometry}
							material={materials.M_SideWings}
							position={[-3.384, -2.484, -0.2]}
							rotation={[0.004, 0, 0]}
						/>
					</group>
				</group>
				<group
					position={[3.058, 1.044, 0.722]}
					rotation={[0.026, 0.004, -0.27]}
				>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface9_M_SideWings_0.geometry}
						material={materials.M_SideWings}
						position={[2.889, 3.793, -0.061]}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface10_M_SideWings_0.geometry}
						material={materials.M_SideWings}
						position={[-3.402, 2.054, -0.087]}
					/>
				</group>
				<group
					position={[-8.839, 2.198, 17.501]}
					rotation={[0.383, -0.934, 0.231]}
					scale={0.85}
				>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface28_M_OrangeLamp_0.geometry}
						material={materials.M_OrangeLamp}
						position={[1.933, 3.441, -4.278]}
						rotation={[-0.001, 0.034, 0.025]}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface29_M_OrangeLamp_0.geometry}
						material={materials.M_OrangeLamp}
						position={[-2.709, 4.816, 0.962]}
						rotation={[-0.022, -0.037, -0.001]}
					/>
				</group>
				<group position={[3.51, 3.549, -0.268]}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.pCube124_M_Tyre_0.geometry}
						material={materials.M_Tyre}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.pCube124_M_BlackDiskWheel_0.geometry}
						material={materials.M_BlackDiskWheel}
					/>
				</group>
				<group
					position={[-2.653, 3.549, 26.332]}
					rotation={[-Math.PI, 0, -Math.PI]}
				>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.pCube125_M_Tyre_0.geometry}
						material={materials.M_Tyre}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.pCube125_M_BlackDiskWheel_0.geometry}
						material={materials.M_BlackDiskWheel}
					/>
				</group>
				<group
					position={[-2.653, 3.549, 1.391]}
					rotation={[-Math.PI, 0, -Math.PI]}
				>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.pCube126_M_Tyre_0.geometry}
						material={materials.M_Tyre}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.pCube126_M_BlackDiskWheel_0.geometry}
						material={materials.M_BlackDiskWheel}
					/>
				</group>
				<group position={[3.51, 3.549, -25.235]}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.pCube127_M_Tyre_0.geometry}
						material={materials.M_Tyre}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.pCube127_M_BlackDiskWheel_0.geometry}
						material={materials.M_BlackDiskWheel}
					/>
				</group>
				<group position={[-2.58, 3.549, 0]}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface50_M_MainColor_0.geometry}
						material={materials.M_MainColor}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface50_M_Black_0.geometry}
						material={materials.M_Black}
					/>
				</group>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube4_M_Black_0.geometry}
					material={materials.M_Black}
					position={[0.5, 5.718, -18.733]}
					scale={2.243}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.typeMesh1_M_WhIteLamp_0.geometry}
					material={materials.M_WhIteLamp}
					position={[1.52, 5.489, -18.765]}
					rotation={[-Math.PI, 0, -Math.PI]}
					scale={0.027}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube8_M_BlackSticks_0.geometry}
					material={materials.M_BlackSticks}
					position={[3.53, 3.549, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube11_M_SideRed_0.geometry}
					material={materials.M_SideRed}
					position={[6.506, 6.258, -18.546]}
					scale={0.284}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube12_M_SideRed_0.geometry}
					material={materials.M_SideRed}
					position={[-5.316, 6.258, -18.546]}
					scale={0.284}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube120_M_Bottom_0.geometry}
					material={materials.M_Bottom}
					position={[0.538, 6.497, 13.424]}
					scale={2.888}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube123_M_Bottom_0.geometry}
					material={materials.M_Bottom}
					position={[0.482, 6.879, -12.2]}
					scale={2.888}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.polySurface33_M_BlackSticks_0.geometry}
					material={materials.M_BlackSticks}
					position={[3.53, 3.549, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.polySurface34_M_BlackSticks_0.geometry}
					material={materials.M_BlackSticks}
					position={[3.53, 3.549, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.polySurface35_M_BlackSticks_0.geometry}
					material={materials.M_BlackSticks}
					position={[3.53, 3.549, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.polySurface36_M_BlackSticks_0.geometry}
					material={materials.M_BlackSticks}
					position={[-2.609, 3.549, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.polySurface37_M_BlackSticks_0.geometry}
					material={materials.M_BlackSticks}
					position={[-2.855, 3.868, 0]}
					rotation={[0, 0, -0.036]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.polySurface38_M_BlackSticks_0.geometry}
					material={materials.M_BlackSticks}
					position={[-2.112, 2.843, 0]}
					rotation={[0, 0, 0.082]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCylinder20_M_Black_0.geometry}
					material={materials.M_Black}
					position={[3.53, 3.549, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCylinder21_M_Black_0.geometry}
					material={materials.M_Black}
					position={[-2.664, 3.549, 26.096]}
					rotation={[-Math.PI, 0, -Math.PI]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCylinder22_M_Black_0.geometry}
					material={materials.M_Black}
					position={[-2.664, 3.549, 1.155]}
					rotation={[-Math.PI, 0, -Math.PI]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCylinder23_M_Black_0.geometry}
					material={materials.M_Black}
					position={[3.53, 3.549, -24.966]}
				/>
				<group position={[3.53, 3.549, 0]}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface47_M_MainColor_0.geometry}
						material={materials.M_MainColor}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface47_M_Black_0.geometry}
						material={materials.M_Black}
					/>
				</group>
				<group position={[3.53, 3.549, 0]}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface48_M_MainColor_0.geometry}
						material={materials.M_MainColor}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.polySurface48_M_Black_0.geometry}
						material={materials.M_Black}
					/>
				</group>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube131_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[5.171, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube132_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[4.088, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube133_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[3.01, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube134_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[1.931, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube135_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[0.835, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube136_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-0.261, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube137_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-1.358, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube138_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-2.454, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube139_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-3.521, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube140_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-4.59, 8.727, -12.142]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube141_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-1.358, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube142_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-2.473, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube143_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-3.53, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube144_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-4.594, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube145_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[-0.261, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube146_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[0.834, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube147_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[1.935, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube148_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[3.01, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube149_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[4.098, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.pCube150_M_MainColor_0.geometry}
					material={materials.M_MainColor}
					position={[5.183, 10.029, -18.231]}
					rotation={[1.524, 0, 0]}
				/>
			</group>
		</group>
	);
}

useGLTF.preload("/cybertruck.glb");
