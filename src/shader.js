import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

export const RenderTargetShader = shaderMaterial(
  {
    time: 0,
    t2: undefined,
    t: undefined,
    damping: 0.02
  },

  `
  varying vec2 vUv;
attribute vec3 originalPosition;
uniform sampler2D t;
uniform float time;
uniform float damping;

void main() {
  vec4 color = texture2D(t, uv);

  // Scale down the green color channel before using it for displacement
  float scaledGreen = 0.4 * color.a; // adjust 0.5 to get the desired effect

  vec3 displacementDirection = vec3(0, scaledGreen, scaledGreen);
  float displacementMagnitude = 1.; // This should be the maximum displacement

  vec3 displacedPosition = position + (displacementDirection * displacementMagnitude);

  float grayscale = dot(color.rgb, vec3(0.2989, 0.5870, 0.1140));
  float blendFactor = damping * pow(grayscale, 3.0);
  vec3 finalPosition = mix(displacedPosition, originalPosition, smoothstep(0.0, 1.0, blendFactor));

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
  gl_PointSize = 3.0;
}


  


  

`,
  `
  uniform sampler2D t; // Displacement texture
  uniform sampler2D t2; // Original texture
  varying vec2 vUv;
  
  void main() {
      vec4 displacementColor = texture2D(t, vUv);
  
      // Use the red component for X displacement and the green component for Y displacement.
      vec2 displacement = vec2(displacementColor.r, displacementColor.g);
  
      // Adjust the displacement scale and limit it to prevent exceeding the valid texture range
      float displacementScale = 0.1;
      vec2 displacedUv = vUv - displacementScale * displacement;
      displacedUv = mix(vUv, displacedUv, displacementColor.a);
  
      vec4 finalColor = texture2D(t, displacedUv);
  
      // Invert the alpha and clamp it between 0.2 and 1.0 (i.e., never fully transparent)
      //finalColor.a *= clamp(displacementColor.a, 0.25, 1.0);
  
      gl_FragColor = finalColor;
  }
  

  

  
  `
);

extend({ RenderTargetShader });
