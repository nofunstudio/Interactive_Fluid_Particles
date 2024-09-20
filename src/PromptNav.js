import React, { useEffect, useState } from "react";
import { useScoreStore } from "./ScoreStore";
import a1 from "./images/a1.jpeg";
import a2 from "./images/a2.jpeg";
import a3 from "./images/a3.jpeg";
import a4 from "./images/a4.jpeg";
import a5 from "./images/a5a.jpeg";
import icon from "./images/prompt.svg";

export function PromptNav() {
	const {
		promptText,
		setPromptText,
		promptImage,
		setPromptImage,
		activeMenu,
		setActiveMenu,
		setIsGenerating,
		isGenerating,
	} = useScoreStore();

	const [menuOpen, setMenuOpen] = useState(false);
	function handleButton() {}

	const inputChangeText = (e) => {
		setPromptText(e.target.value);
	};

	const handleClick = (imgSrc) => () => {
		setPromptImage(imgSrc);
		setMenuOpen(false);
	};
	// causes infinite loop error!!!!!!!!!!!!!!
	const menuClick = () => () => {
		if (isGenerating) {
			setIsGenerating(false);
		} else {
			setIsGenerating(true);
		}
	};

	useEffect(() => {
		if (activeMenu === "Ai3D") {
			setMenuOpen(true);
		} else {
			setMenuOpen(false);
		}
	}, [activeMenu]);

	return (
		<div className="prompt-div">
			<div className="promptlayoutdiv">
				{!menuOpen && (
					<>
						<div className="prompt-text-area">
							<textarea
								placeholder={promptText}
								maxLength="5000"
								id="field"
								name="field"
								data-name="Field"
								className="textarea w-input"
								onChange={inputChangeText}
							></textarea>
						</div>
						<div className="add-image-div" onPointerDown={menuClick()}>
							<img
								src={icon}
								loading="lazy"
								alt=""
								className="add-image-icon"
							/>
						</div>
					</>
				)}
				{activeMenu === "Ai3D" && menuOpen && (
					<>
						<div className="add-image-div" onPointerDown={handleClick(a1)}>
							<img src={a1} loading="lazy" className="add-image-background" />
						</div>
						<div className="add-image-div" onPointerDown={handleClick(a2)}>
							<img src={a2} loading="lazy" className="add-image-background" />
						</div>
						<div className="add-image-div" onPointerDown={handleClick(a3)}>
							<img src={a3} loading="lazy" className="add-image-background" />
						</div>
						<div className="add-image-div" onPointerDown={handleClick(a4)}>
							<img src={a4} loading="lazy" className="add-image-background" />
						</div>
						<div className="add-image-div" onPointerDown={handleClick(a5)}>
							<img src={a5} loading="lazy" className="add-image-background" />
						</div>
					</>
				)}
			</div>
		</div>
	);
}
