function DepthMapPlane() {
	const { camera } = useThree();

	const material = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {
					uCameraNear: { value: camera.near },
					uCameraFar: { value: camera.far },
				},
				vertexShader: `
          varying float vDepth;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * worldPosition;
            vDepth = -viewPosition.z;
            gl_Position = projectionMatrix * viewPosition;
          }
        `,
				fragmentShader: `
          uniform float uCameraNear;
          uniform float uCameraFar;
          varying float vDepth;
  
          void main() {
            float depth = (vDepth - uCameraNear) / (uCameraFar - uCameraNear);
            depth = 1.0 - depth; // Invert depth to make closer objects white
            gl_FragColor = vec4(vec3(depth), 1.0);
          }
        `,
			}),
		[camera.near, camera.far]
	);

	return (
		<mesh position={[0, 0, -2]}>
			<planeGeometry args={[2, 2]} />
			<primitive attach="material" object={material} />
		</mesh>
	);
}
