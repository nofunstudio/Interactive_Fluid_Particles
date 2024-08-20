import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const BaseShader = shaderMaterial(
	{ t2: undefined, t: undefined, transition1: 0.0, transition2: 0.0 },
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
    uniform sampler2D t;
    uniform sampler2D t2;
    uniform float transition1;
    uniform float transition2;

    void main() {
        vec2 uv = vUv;
        vec4 tex1 = texture2D(t, uv);
        vec4 tex2 = texture2D(t2, uv);
        vec4 color = mix(tex1, tex2, transition1 );

        gl_FragColor = color;

}
  `
);

extend({ BaseShader });
