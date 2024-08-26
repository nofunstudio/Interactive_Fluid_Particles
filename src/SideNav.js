import React from "react";
import Ai3D from "./images/3d.svg";
import Axe from "./images/axe.svg";
import Human from "./images/human.svg";
import Monkey from "./images/monkey.svg";
import Simulation from "./images/simulation.svg";
import Cybertruck from "./images/cybertruck.svg";
import { useScoreStore } from "./ScoreStore";

export function SideNav() {
	const { activeMenu, setActiveMenu } = useScoreStore();

	const handleClick = (id) => {
		setActiveMenu(id);
	};

	const buttons = [
		{ id: "Ai3D", icon: Ai3D },
		{ id: "Monkey", icon: Monkey },
		{ id: "Human", icon: Human },
		{ id: "Axe", icon: Axe },
		{ id: "Simulation", icon: Simulation },
		{ id: "Cybertruck", icon: Cybertruck },
	];

	return (
		<div className="side-wrapper-left">
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
