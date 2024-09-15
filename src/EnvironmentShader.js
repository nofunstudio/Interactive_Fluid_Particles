import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const EnvironmentShader = shaderMaterial(
	{
		time: 0,
		t1: null,
		progress: 1.0,
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
   uniform float progress;
   uniform sampler2D t1;
    varying vec2 vUv;


float sdfLine(vec3 p) {
    float radius = 0.002;
    float closestXLine = length(vec2(round(p.yz)) - p.yz) - radius;
    float closestYLine = length(vec2(round(p.xz)) - p.xz) - radius;
    float closestZLine = length(vec2(round(p.xy)) - p.xy) - radius;
    return min(closestXLine, min(closestYLine, closestZLine));
}

vec3 uvTo3D(vec2 uv) {
    // The 2-Sphere point via UV => Lat/Long angles
    float theta = uv.x * 2.0 * 3.14159265359; // Longitude
    float phi = uv.y * 3.14159265359;         // Latitude
    // Trigonometry from 2-Sphere angles to an XYZ normalized [-1,1].
    float x = sin(phi) * cos(theta);
    float y = sin(phi) * sin(theta);
    float z = cos(phi);
    return vec3(x, y, z);
}

void main() {
vec2 resolution = vec2(2.0, 1.0);
 vec2 fragCoord = vUv * resolution;
     vec2 uv = fragCoord/resolution.xy;
    uv.y = 1.0 - uv.y; // Flip Y coordinate if necessary

    vec3 pos = uvTo3D(uv); // UV => 3D for equirectangular/spherical mapping

    // Simple ray marching
    const float MINIMUM_HIT_DISTANCE = 0.001;
    const int NUMBER_OF_STEPS = 15;
    float total_distance_traveled = 0.0;
    vec4 fragColor = vec4(0.0);

    for (int i = 0; i < NUMBER_OF_STEPS; ++i) {
        vec3 current_position = pos / 1.2 + time + total_distance_traveled * pos;
        float distance_to_closest = sdfLine(current_position);
        if (distance_to_closest < MINIMUM_HIT_DISTANCE) {
            fragColor = vec4(vec3(1.0), 1.0);
            break;
        }
        total_distance_traveled += distance_to_closest;
    }
        //mix frag color and t1 
        vec4 envColor = texture2D(t1, vUv);
        vec4 mixColor = mix(fragColor, envColor, progress);
        //Disable tone mapping effect by adjusting the color space
        mixColor.rgb= pow(mixColor.rgb, vec3(1.0/2.2));
        gl_FragColor = mixColor;
}

  `
);

// declaratively
extend({ EnvironmentShader });
