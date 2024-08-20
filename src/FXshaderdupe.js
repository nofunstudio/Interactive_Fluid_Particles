import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const FXTargetShader = shaderMaterial(
	{ u_fx: new THREE.Texture() },
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

    void main() {
        vec2 uv = vUv;
        vec4 color = texture2D(u_fx, uv);
        gl_FragColor = vec4(clamp(color.rgb, 0.0, 1.0), 1.0);

}
  `
);

extend({ FXTargetShader });
