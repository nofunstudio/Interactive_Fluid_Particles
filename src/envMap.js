import { PMREMGenerator } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";

export function useEnvironmentMap(url) {
	const { gl } = useThree();
	const loader = new RGBELoader();
	const pmremGenerator = new PMREMGenerator(gl);

	const [envMap, setEnvMap] = useState();

	useEffect(() => {
		loader.load(url, (texture) => {
			const envMap = pmremGenerator.fromEquirectangular(texture).texture;
			setEnvMap(envMap);

			texture.dispose();
			console.log(envMap);
		});

		return () => {
			if (envMap) envMap.dispose();
			pmremGenerator.dispose();
		};
	}, [url, gl]);

	return envMap;
}
