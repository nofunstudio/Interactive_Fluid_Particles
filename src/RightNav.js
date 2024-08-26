import React, { useState, useEffect } from "react";
import Mask from "./images/mask.svg";
import { useScoreStore } from "./ScoreStore";

export function RightNav() {
	const { activeMenu, setActiveMenu, setBackgroundOpacity, backgroundOpacity } =
		useScoreStore();

	const handleClick = (id) => {
		if (backgroundOpacity == 1) {
			setBackgroundOpacity(0);
		} else {
			setBackgroundOpacity(1);
		}
	};

	const buttons = [{ id: "Mask", icon: Mask }];

	return (
		<div className="side-wrapper-right">
			<div className="sidenav">
				{buttons.map((button) => (
					<div
						key={button.id}
						id={button.id}
						className={
							activeMenu === button.id ? "side-button active" : "side-button"
						}
						onPointerDown={() => handleClick(button.id)}
					>
						<img src={button.icon} className="icon" alt={button.id} />
					</div>
				))}
			</div>
		</div>
	);
}
