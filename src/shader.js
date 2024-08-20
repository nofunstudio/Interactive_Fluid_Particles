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
varying vec3 vPosition;
    float PI = 3.141592653589793238;

    vec3 mod289(vec3 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x)
    {
      return mod289(((x*34.0)+10.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    vec3 fade(vec3 t) {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
    }
    
    // Classic Perlin noise
    float cnoise(vec3 P)
    {
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod289(Pi0);
      Pi1 = mod289(Pi1);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
    
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
    
      vec4 gx0 = ixy0 * (1.0 / 7.0);
      vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    
      vec4 gx1 = ixy1 * (1.0 / 7.0);
      vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    
      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    
      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;
    
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
    
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }
    

    
    
    mat3 rotation3dY(float angle) {
      float s = sin(angle);
      float c = cos(angle);
    
      return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
      );
    }
    
    float saturate(float x)
    {
      return clamp(x, 0.0, 1.0);
    }
    
    vec3 curlNoise(vec3 p)
    {
    
      // return curlNoise(p);
      const float step = 0.01;
      float ddx = cnoise(p+vec3(step, 0.0, 0.0)) - cnoise(p-vec3(step, 0.0, 0.0));
      float ddy = cnoise(p+vec3(0.0, step, 0.0)) - cnoise(p-vec3(0.0, step, 0.0));
      float ddz = cnoise(p+vec3(0.0, 0.0, step)) - cnoise(p-vec3(0.0, 0.0, step));
    
      const float divisor = 1.0 / ( 2.0 * step );
      return ( vec3(ddy - ddz, ddz - ddx, ddx - ddy) * divisor );
    }
    
    vec3 fbm_vec3(vec3 p, float frequency, float offset)
    {
      return vec3(
        cnoise((p+vec3(offset))*frequency),
        cnoise((p+vec3(offset+20.0))*frequency),
        cnoise((p+vec3(offset-30.0))*frequency)
      );
    }

void main() {

    vUv = uv;
        vec3 distortion1 = vec3(position.x*1.,position.y,1.)*curlNoise(vec3(
    position.x*0.95 +time*0.9,
    position.y*0.95 + time*0.9,
    (position.x + position.y)+time*.1
    ))*transitionNoise*.2;
    
    vec3 finalPosition = position + distortion1;
       // Ensure Z position is positive
    finalPosition.z = max(finalPosition.z, 0.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = (-modelViewMatrix * vec4(position, 1.0)).xyz;
    vec3 transformedNormal = normalMatrix * normal;
    vReflect = reflect(normalize(position - cameraPosition), transformedNormal);

   gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
    
    gl_PointSize =(transitionNoise)*15. ;
      // gl_PointSize =10.;
   
}


	`,
	`
  varying vec2 vUv;
  uniform sampler2D t2;
  uniform sampler2D t3;
  uniform sampler2D t4;
  uniform float transition1;
  uniform float transition2;
  uniform float transitionNoise;
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
