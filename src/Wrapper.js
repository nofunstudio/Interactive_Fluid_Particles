import React, { useState } from "react";
import "./wrapperStyles.css";
import sidebar from "./images/sidebar.png";
import prompt from "./images/prompt.png";
import kreaLogo from "./images/krealogo.png";
import gridBackground from "./images/gridBackground.png";
import { Canvas } from "@react-three/fiber";
import { useControls, Leva } from "leva";
import { GridBox } from "./GridBox";
import { Playground } from "./Playground";
import { OrbitControls } from "@react-three/drei";

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
		setTimeout(() => {
			setIsGenerating(false);
		}, 5000);
	}

	return (
		<div className="center-column">
			<button className="generateButton" onClick={handleButton}>
				Generate
			</button>
			<Canvas
				camera={{
					near: 0.5, // Adjust the near clipping plane here
					far: 2, // Adjust the far clipping plane here
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
			<GridBox />
		</Canvas>
	</div>
);

const CenterDiv = () => (
	<div className="center-div">
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
		<div className="prompt-div">
			<img src={prompt} loading="lazy" alt="" className="prompt-img" />
		</div>
		<div className="center-button-wrapper">
			<a className="center-button">Home</a>
			<a className="center-button active">Generate</a>
			<a className="center-button">Enhance</a>
		</div>
	</div>
);

const Sidebar = ({ position }) => (
	<img src={sidebar} loading="lazy" alt="" className={`sidebar-${position}`} />
);

const ParentDiv = () => (
	<div className="parent-div">
		<Header />
		<CenterDiv />
		<Footer />
		<Sidebar position="left" />
		<Sidebar position="right" />
	</div>
);

export default ParentDiv;
