import React, { useState } from "react";
import "./wrapperStyles.css";
import "./normalize.css";
import "./webflow.css";
import sidebar from "./images/sidebar.png";
import prompt from "./images/prompt.png";
import kreaLogo from "./images/krealogo.png";
import gridBackground from "./images/gridBackground.png";
import { Canvas } from "@react-three/fiber";
import { useControls, Leva } from "leva";
import { GridBox } from "./GridBox";
import { Playground } from "./Playground";
import { OrbitControls } from "@react-three/drei";
import { GenerationCanvas } from "./GenerationCanvas";
import { SideNav } from "./SideNav";
import { PromptNav } from "./PromptNav";
import { RightNav } from "./RightNav";

const Header = () => (
	<div className="header-div">
		<img src={kreaLogo} loading="lazy" alt="" className="image" />
		<div className="center-button-wrapper">
			<a className="center-button">Home</a>
			<a className="center-button active">Generate</a>
			<a className="center-button">Enhance</a>
		</div>
		<a className="signup">Sign Up</a>
	</div>
);

const LeftCanvas = () => {
	const [isGenerating, setIsGenerating] = useState(false);
	function handleButton() {
		setIsGenerating(!isGenerating);
	}

	return (
		<div className="center-column">
			<Canvas
				onPointerUp={handleButton}
				camera={{
					near: 0.75, // Adjust the near clipping plane here
					far: 10, // Adjust the far clipping plane here
					fov: 75, // Field of view
					position: [0, 0, 2], // Camera position
				}}
			>
				<OrbitControls makeDefault />
				<Playground isGenerating={isGenerating} />
			</Canvas>
		</div>
	);
};

const RightCanvas = () => (
	<div className="center-column">
		<Canvas>
			{/* <GridBox /> */}
			<GenerationCanvas />
		</Canvas>
	</div>
);

const CenterDiv = () => (
	<div className="center-div">
		<RightNav />
		<SideNav />
		<LeftCanvas />
		<RightCanvas />
	</div>
);

const Footer = () => (
	<div className="footer-div">
		<div className="center-button-wrapper">
			<a className="center-button">Home</a>
			<a className="center-button active">Generate</a>
			<a className="center-button">Enhance</a>
		</div>
		<PromptNav />
		<div className="center-button-wrapper">
			<a className="center-button">Home</a>
			<a className="center-button active">Generate</a>
			<a className="center-button">Enhance</a>
		</div>
	</div>
);

const ParentDiv = () => (
	<div className="parent-div">
		<Header />
		<CenterDiv />
		<Footer />
	</div>
);

export default ParentDiv;
