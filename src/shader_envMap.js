import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const RenderTargetShader = shaderMaterial(
	{
		time: 0,
		t2: undefined,
		t: undefined,
		envMap: undefined,
		damping: 0.02,

		directionalLightColor: new THREE.Color(0.5, 0.5, 0.5),
		directionalLightDirection: new THREE.Vector3(-1, -1, -1),
	},

	`
	varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vReflect;
attribute vec3 originalPosition;
uniform sampler2D t;
uniform float time;
uniform float damping;
varying vec3 vNormal;

void main() {
    vec4 color = texture2D(t, uv);
    float scaledGreen = 0.4 * color.a;
    vec3 displacementDirection = vec3(0, scaledGreen, scaledGreen);
    float displacementMagnitude = 1.;
    vec3 displacedPosition = position + (displacementDirection * displacementMagnitude);
    float grayscale = dot(color.rgb, vec3(0.2989, 0.5870, 0.1140));
    float blendFactor = damping * pow(grayscale, 3.0);
    vec3 finalPosition = mix(displacedPosition, originalPosition, smoothstep(0.0, 1.0, blendFactor));

    vUv = uv;
    vNormal = normalize(normalMatrix * normal); // Transformed normal
    vViewPosition = (-modelViewMatrix * vec4(finalPosition, 1.0)).xyz;
    vec3 transformedNormal = normalMatrix * normal;
    vReflect = reflect(normalize(position - cameraPosition), transformedNormal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = 30.0; // Adjust to your desired sphere size
}

	`,
	`
  varying vec2 vUv;
  uniform sampler2D t2;
  uniform samplerCube envMap;
  varying vec3 vViewPosition; // Make sure you're passing this from vertex shader
  
  void main() {
      vec4 baseColor = texture2D(t2, vUv);
  
      // Convert gl_PointCoord to [-1,1] range and calculate normal from it
      vec2 adjustedCoords = 2.0 * gl_PointCoord - 1.0;
      vec3 normal = normalize(vec3(adjustedCoords, sqrt(1.0 - dot(adjustedCoords, adjustedCoords))));
  
      // View direction
      vec3 viewDir = normalize(vViewPosition);
  
      // Reflect view direction around the normal
      vec3 reflectionVec = reflect(viewDir, normal);
  
      // Sample the environment map using the reflection vector
      vec3 reflection = textureCube(envMap, reflectionVec).rgb;
      float specularity = pow(max(dot(reflectionVec, viewDir), 0.0), 2.0);

      vec3 finalColor = baseColor.rgb + reflection * specularity;

  
      // Check for sphere boundary and discard fragments outside
      if (dot(adjustedCoords, adjustedCoords) > 1.0) discard;
  
      gl_FragColor = vec4(finalColor, baseColor.a);
  }
  


  
  

  `
);

extend({ RenderTargetShader });
