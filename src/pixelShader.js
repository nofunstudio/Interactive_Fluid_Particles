import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const PixelShader = shaderMaterial(
	{
		time: 0,
		uFillColor: new THREE.Color("#f60"),
		progressDistortion: 0,
		progressImage: 0,
		uPixels: null,
		t: null,
		t2: null,
	},
	// vertex shader
	/*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	// fragment shader
	/*glsl*/ `
    uniform float time;
    uniform vec3 uFillColor;
    uniform float progressDistortion;
    uniform float progressImage;
    uniform float uPixels[36];
    uniform sampler2D t;
    uniform sampler2D t2;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      // Calculate aspect ratio based on UV coordinates
      float aspectRatio = 1.0;  // Assuming the texture is square or the UVs are adjusted accordingly
      uv.y *= aspectRatio;

      // Pixellation logic
      int indexProgress = int((1.-progressDistortion) * 36.0);
      float pixellation = floor(uPixels[indexProgress] * 1000.0);  // Adjust the factor if necessary

      vec2 gridSize = vec2(pixellation);
      vec2 newUV = floor(uv * gridSize) / gridSize;

        vec4 textureColor1 = texture2D(t, newUV);
    vec4 textureColor2 = texture2D(t2, newUV);
    vec4 textureColor = mix(textureColor1, textureColor2, progressImage);
      gl_FragColor = textureColor;

      gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / 2.2));
    }
  `
);

// declaratively
extend({ PixelShader });
