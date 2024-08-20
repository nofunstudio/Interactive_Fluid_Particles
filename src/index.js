import ReactDOM from "react-dom/client";
import React from "react";
import { App } from "./App";

const rootElement = document.getElementById("root");

// Create a root and render the App inside
ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
