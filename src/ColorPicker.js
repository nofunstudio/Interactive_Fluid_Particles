import { useRef, useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useScoreStore } from "./ScoreStore";

export function ColorPicker() {
	const [color, setColor] = useState("#aabbcc");
	return <HexColorPicker color={color} onChange={setColor} />;
}
