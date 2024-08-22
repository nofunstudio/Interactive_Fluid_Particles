import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const DepthShader = shaderMaterial(
	{
		uDepthTexture: null,
		uContrast: 5.0, // Add a uniform to control contrast
		uBrightness: 0.0, // Add a uniform to control brightness
	},
	`
   varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	`
    uniform sampler2D uDepthTexture;
    uniform float uContrast;
    uniform float uBrightness;
    varying vec2 vUv;
    
    void main() {
      // Sample the depth texture
      float depth = texture2D(uDepthTexture, vUv).r;
      
      // Invert the depth value
      depth = 1.0 - depth;

      // Apply contrast and brightness adjustments
      depth = depth * uContrast + uBrightness;
      
      // Ensure depth stays within the [0, 1] range
      depth = clamp(depth, 0.0, 1.0);

      // Output the final color
      gl_FragColor = vec4(vec3(depth), 1.0); // Grayscale depth visualization
    }
  `
);

extend({ DepthShader });
