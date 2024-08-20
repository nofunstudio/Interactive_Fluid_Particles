import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const RenderTargetShader = shaderMaterial(
	{
		time: 0,
		t4: undefined,
		t3: undefined,
		t2: undefined,
		t: undefined,
		transition1: 0.0,
		transition2: 0.0,
		transitionNoise: 0.0,
		damping: 0.01,
		roughness: 0.0,
		metalness: 0.0,
		pointSize: 2.0,

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
uniform float pointSize;
uniform float damping;
varying vec3 vNormal;
uniform float transition1;
uniform float transition2;
uniform float transitionNoise;

void main() {
    vec4 textureColor = texture2D(t, uv);

    // Use the alpha channel or luminance for displacement
    float maxDisplacement = 3.;
    float displacementIntensity = clamp(textureColor.r*.99 , 0.0, maxDisplacement);
    

    // Directly use displacementIntensity to displace the vertex along the normal
    vec3 displacedPosition = position + normal * (displacementIntensity * 20.);

    float displacementFactor = damping * displacementIntensity;

    // Blend between the original and displaced positions
    vec3 finalPosition = mix(position, displacedPosition, displacementFactor);

    // Standard transformations for passing to the fragment shader
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = (-modelViewMatrix * vec4(finalPosition, 1.0)).xyz;
    vec3 transformedNormal = normalMatrix * normal;
    vReflect = reflect(normalize(position - cameraPosition), transformedNormal);

   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize =( transition1 - transition2)*50.;
    //gl_PointSize =( transition1 - transition2)*5. * pointSize + displacementIntensity*5.; // Adjust to your desired sphere size
}


	`,
	`
  varying vec2 vUv;
  uniform sampler2D t2;
  uniform sampler2D t3;
  uniform sampler2D t4;
  uniform float transition1;
  uniform float transition2;
  varying vec3 vViewPosition; 
  uniform float roughness;
  uniform float metallic;
  
  vec3 fresnelSchlick(float cosTheta, vec3 F0) {
      return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
  }
  void main() {
  vec4 currentColor = texture2D(t2, vUv);
  vec4 lowResColor = texture2D(t3, vUv);
  vec4 highResColor = texture2D(t4, vUv);
 vec4 mix1 = mix(currentColor, lowResColor, transition1);

    // Mix lowResColor with highResColor based on transition2
    vec4 mix2 = mix(lowResColor, highResColor, transition2);

    // Combine the two mixes to get the final baseColor
    vec4 baseColor = mix(mix1, mix2, transition2);
    
    // Check if the pixel is black or close to black
    //if (baseColor.g > 0.99) discard; // You can adjust the 0.01 value to your liking
   // float threshold = 0.99; // Adjust this value based on how close to white you want to cut out
   // if (baseColor.r > threshold && baseColor.g > threshold && baseColor.b > threshold) discard;

    vec3 toFragment = normalize(vec3(2.0 * gl_PointCoord.x - 1.0, 2.0 * gl_PointCoord.y - 1.0, sqrt(1.0 - (2.0 * gl_PointCoord.x - 1.0) * (2.0 * gl_PointCoord.x - 1.0) - (2.0 * gl_PointCoord.y - 1.0) * (2.0 * gl_PointCoord.y - 1.0))));
    
    vec2 adjustedCoords = gl_PointCoord * 2.0 - 1.0;
    float len = length(adjustedCoords);
    if (len > 1.0) discard;

    float edgeSoftness = 0.2;  
    float alpha = smoothstep(1.0, 1.0 - edgeSoftness, len);

    vec3 ambientColor = baseColor.rgb * 0.01;  // Reduced ambient intensity
    vec3 N = toFragment;
    //light source
    vec3 L = normalize(vec3(1.0, -2.0, 10.0));

    float shininess = 10.0;

    float specularStrength = pow(max(dot(reflect(-L, N), N), 0.0), shininess);
    vec3 specularColor = specularStrength * vec3(1.0, 1.0, 1.0) * .25;  // Reduced specular intensity

    vec3 finalColor = baseColor.rgb + ambientColor + specularColor;
    finalColor = clamp(finalColor, 0.0, 1.0);  // Ensure values remain in the valid range

    gl_FragColor = vec4(finalColor, baseColor.a * alpha);
}




  
  

  `
);

extend({ RenderTargetShader });
