import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

export const DistortionDepthShader = shaderMaterial(
	{
		time: 0,
		progressDistortion: 0.0,
		scale: 10.0,
		t: undefined,
		t2: undefined,
		tDepth: undefined,
		progressImage: 0.0,
		maskProgress: 0.0,
		backgroundOpacity: 1.0, // New uniform for background opacity
	},
	`
  varying vec2 vUv;
  uniform sampler2D tDepth;
  uniform float progressDistortion;
  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Sample the depth texture
    float depth = texture2D(tDepth, uv).r;
    
    // Displace the vertex along the z-axis
    modelPosition.z += depth * 2.0 * progressDistortion;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
  }
	`,
	`
uniform float time;
uniform sampler2D t;
uniform sampler2D t2;
uniform sampler2D tDepth;
uniform float scale;
uniform float progressDistortion;
uniform float progressImage;
uniform float maskProgress;
uniform float backgroundOpacity;

varying vec2 vUv;

void main() {
    vec2 newUV = vUv;
    vec2 p = 2.0 * vUv - vec2(1.0);
    
    // Distortion Shader
    if(progressDistortion > 0.01) {
        p += 0.1 * cos(scale * 3.0 * p.yx + time + vec2(1.2, 3.4));
        p += 0.1 * cos(scale * 3.7 * p.yx + 1.4 * time + vec2(2.2, 3.4));
        p += 0.1 * cos(scale * 5.0 * p.yx + 2.6 * time + vec2(4.2, 0.0));
        p += 0.3 * cos(scale * 7.0 * p.yx + 3.6 * time + vec2(10.2, 0.));
    }
     p.y *= 0.2;

    vec2 distortedUV = mix(vUv, vUv + p, progressDistortion);
    
    // Sample textures
    vec4 textureColor1 = texture2D(t, distortedUV);
    vec4 textureColor2 = texture2D(t2, distortedUV);
    vec4 textureDepth = texture2D(tDepth, vUv);  // Use original UVs for depth
    vec4 textureColor = mix(textureColor1, textureColor2, progressImage);

    // Calculate alpha based on depth and mask progress
    float depthValue = 1.0-textureDepth.r;
    float threshold = maskProgress;
    float alpha = step(threshold, depthValue);

    // Sample the background (undistorted) texture
    vec4 bgTextureColor1 = texture2D(t, vUv);
    vec4 bgTextureColor2 = texture2D(t2, vUv);
    vec4 bgTextureColor = mix(bgTextureColor1, bgTextureColor2, progressImage);

    // Apply background opacity
    bgTextureColor.a *= backgroundOpacity;

    // Combine the foreground and background
    vec4 finalColor = mix(bgTextureColor, textureColor, alpha);

    // Ensure the alpha channel is correct
    finalColor.a = mix(bgTextureColor.a, 1.0, alpha);

    gl_FragColor = finalColor;
}
`
);

extend({ DistortionDepthShader });
