import React, { useState } from "react";
import "./wrapperStyles.css";
// import "./normalize.css";
// import "./webflow.css";
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
import { Tldraw, TLUiOverrides } from "tldraw";
import "tldraw/tldraw.css";
import { TlDrawListener } from "./TlDrawListener";
import { useScoreStore } from "./ScoreStore";
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
	const { activeMenu } = useScoreStore();
	const components = {
		ContextMenu: null,
		ActionsMenu: null,
		HelpMenu: null,
		ZoomMenu: null,
		MainMenu: null,
		Minimap: null,
		StylePanel: null,
		PageMenu: null,
		NavigationPanel: null,
		// Toolbar: null,
		KeyboardShortcutsDialog: null,
		// QuickActions: null,
		HelperButtons: null,
		DebugPanel: null,
		DebugMenu: null,
		SharePanel: null,
		MenuPanel: null,
		TopPanel: null,
		CursorChatBubble: null,
	};

	return (
		<div className="center-column">
			{activeMenu !== "Scribble" ? (
				<Canvas
					camera={{
						near: 0.75,
						far: 10,
						fov: 75,
						position: [0, 0, 2],
					}}
				>
					<OrbitControls makeDefault />
					<Playground />
				</Canvas>
			) : (
				<div
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						inset: 0,
					}}
				>
					<Tldraw components={components} inferDarkMode>
						<TlDrawListener />
					</Tldraw>
				</div>
			)}
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
