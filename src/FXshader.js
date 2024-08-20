import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const FXTargetShader = shaderMaterial(
	{
		u_fx: new THREE.Texture(),
		u_progress: 0.0, // Uniform to control progress
	},
	`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
  `,
	`
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D u_fx;
    uniform float u_progress;

    float random(vec2 p) {
        return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
            mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
            mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
            u.y
        );
    }

    void main() {
        vec2 uv = vUv * 5.0; // Adjusted scale for better visibility
        float n = noise(uv);

        // Interpolate between black and noise
        float intensity = u_progress * (1.0 - u_progress) * 4.0;
        vec3 color = mix(vec3(0.0), vec3(n), intensity);

        gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ FXTargetShader });
