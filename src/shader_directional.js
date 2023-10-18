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
		roughness: 0.3,
		metalness: 0.2,

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
    vViewPosition = (-modelViewMatrix * vec4(finalPosition, 1.0)).xyz;
    vec3 transformedNormal = normalMatrix * normal;
    vReflect = reflect(normalize(position - cameraPosition), transformedNormal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = 30.0;
}

	`,
	`
    varying vec2 vUv;
    uniform sampler2D t2;
    uniform vec3 ambientLightColor;
    uniform vec3 directionalLightColor;
    uniform vec3 directionalLightDirection;
    uniform samplerCube envMap;
    
    varying vec3 vReflect;
    
    void main() {
        vec4 baseColor = texture2D(t2, vUv);
    
        vec3 toFragment = normalize(vec3(2.0 * gl_PointCoord.x - 1.0, 2.0 * gl_PointCoord.y - 1.0, sqrt(1.0 - (2.0 * gl_PointCoord.x - 1.0) * (2.0 * gl_PointCoord.x - 1.0) - (2.0 * gl_PointCoord.y - 1.0) * (2.0 * gl_PointCoord.y - 1.0))));
        vec2 adjustedCoords = gl_PointCoord * 2.0 - 1.0;
    float len = length(adjustedCoords);
    if (len > 1.0) discard;
        vec3 ambient = baseColor.rgb;

        // Soften the edges
        float edgeSoftness = 0.02;  
        float alpha = smoothstep(1.0, 1.0 - edgeSoftness, len);
        
        float dotNL = max(dot(toFragment, directionalLightDirection), 0.0);
        vec3 diffuse = dotNL * directionalLightColor;
        
        vec3 reflection = textureCube(envMap, vReflect).rgb;
        vec3 specular = reflection; // You can adjust this further
    
        vec3 finalColor = ambient + diffuse ;
        
        gl_FragColor = vec4(finalColor, baseColor.a * alpha);
    }
    
    


  
  

  `
);

extend({ RenderTargetShader });
