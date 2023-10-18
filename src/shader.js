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
		roughness: 0.0,
		metalness: 0.0,

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
    gl_PointSize = 15.0; // Adjust to your desired sphere size
}

	`,
	`
  varying vec2 vUv;
  uniform sampler2D t2;
  uniform samplerCube envMap;
  varying vec3 vViewPosition; // Make sure you're passing this from vertex shader
  uniform float roughness;
  uniform float metallic;
  
  vec3 fresnelSchlick(float cosTheta, vec3 F0) {
      return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
  }
  void main() {
    vec4 baseColor = texture2D(t2, vUv);

    vec3 toFragment = normalize(vec3(2.0 * gl_PointCoord.x - 1.0, 2.0 * gl_PointCoord.y - 1.0, sqrt(1.0 - (2.0 * gl_PointCoord.x - 1.0) * (2.0 * gl_PointCoord.x - 1.0) - (2.0 * gl_PointCoord.y - 1.0) * (2.0 * gl_PointCoord.y - 1.0))));
    
    vec2 adjustedCoords = gl_PointCoord * 2.0 - 1.0;
    float len = length(adjustedCoords);
    if (len > 1.0) discard;

    float edgeSoftness = 0.2;  
    float alpha = smoothstep(1.0, 1.0 - edgeSoftness, len);

    vec3 ambientColor = baseColor.rgb * 0.1;  // Reduced ambient intensity
    vec3 N = toFragment;
    vec3 L = normalize(vec3(0.0, 1.0, 1.0));

    float shininess = 5.0;

    float specularStrength = pow(max(dot(reflect(-L, N), N), 0.0), shininess);
    vec3 specularColor = specularStrength * vec3(1.0, 1.0, 1.0) * 0.5;  // Reduced specular intensity

    vec3 finalColor = baseColor.rgb + ambientColor + specularColor;
    finalColor = clamp(finalColor, 0.0, 1.0);  // Ensure values remain in the valid range

    gl_FragColor = vec4(finalColor, baseColor.a * alpha);
}




  
  

  `
);

extend({ RenderTargetShader });
