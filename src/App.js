import React, { useEffect, useState } from "react";

import "./styles.css";

import { Canvas } from "@react-three/fiber";

import { useControls, Leva } from "leva";
import { GridBox } from "./GridBox";
import ParentDiv from "./Wrapper";

export function App() {
	return (
		<>
			<Leva hidden={false} collapsed hideTitleBar />
			<ParentDiv />
		</>
	);
}
