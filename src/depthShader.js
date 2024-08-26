import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const DepthShader = shaderMaterial(
	{
		uDepthTexture: { value: null },
	},
	// Vertex shader
	`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	// Fragment shader
	`
    uniform sampler2D uDepthTexture;
    varying vec2 vUv;

void main() {
      vec4 depth = texture2D(uDepthTexture, vUv);
      float depthValue = depth.r;
      float contrast =1.5;

      // Apply contrast adjustment
      float midpoint = 0.5;
      float adjustedDepth = (depthValue - midpoint) * contrast + midpoint;

      // Clamp the result to [0, 1] range
      adjustedDepth = clamp(adjustedDepth, 0.0, 1.0);

      gl_FragColor = vec4(vec3(adjustedDepth), 1.0);
    }
  `
);

extend({ DepthShader });
