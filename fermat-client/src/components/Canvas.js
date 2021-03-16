import React, { useContext, useEffect, useRef } from "react"
import { DrawGrid } from "./symbols/SymbolGrid.js";
import { SymbolContext } from "./symbols/SymbolProvider"


export const Canvas = props => {

	const canvasRef = useRef();
	const cellSize = 50;
	const gridPadding = 50;
	const rowLength = 2;
	let gridSymbols = [];
	let equationSymbols = [];
	let ctx;
	let canvas;
	let clickedSymbol = {};

	const grid = {
		width: 300,
		height: 500
	}

	const { symbols, getSymbols } = useContext(SymbolContext);

	useEffect(() => {
		getSymbols();
	}, [])

	const redraw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		DrawGrid(symbols, rowLength, gridPadding, cellSize)
	}

	const DrawGrid = (symbols, rowLength, gridPadding, cellSize) => {
		ctx.font = "30px Courier";
		ctx.textBaseline = "top"

		const length = symbols.length

		for (let row = 0; row < Math.floor((length) / rowLength) + length % rowLength; row++) {
			for (let col = 0; col < rowLength; col++) {
				// This is kind of hacky but it makes it work for an abritrary grid size
				let index = col + row * rowLength
				if (index < length) {

					let x = gridPadding + cellSize * col
					let y = gridPadding + cellSize * row
					ctx.fillText(String.fromCharCode(symbols[index].entity_code),
						x, y);
					let gridSymbol = {
						x,
						y,
						name: symbols[index].name,
						entity_code: symbols[index].entity_code
					}
					gridSymbols.push(gridSymbol)
				}
				else {
					break;
				}
			}
		}
	}

	const getMousePos = (e) => {
		const rect = canvas.getBoundingClientRect();
		return {
			posX: e.clientX - rect.left,
			posY: e.clientY - rect.top
		};
	}

	const checkSymbolInGrid = (symbol, mousePos) => {

		if (symbol.x < mousePos.posX && symbol.y < mousePos.posY && symbol.x + cellSize > mousePos.posX &&
			symbol.y + cellSize > mousePos.posY)
			return true
		else
			return false
	}

	const handleGridClickEvent = (e, mousePos) => {
		gridSymbols.map(symbol => {
			if (checkSymbolInGrid(symbol, mousePos)) {
				clickedSymbol = symbol
			}
		})
	}

	const handleCanvasMouseDown = e => {
		const mousePos = getMousePos(e)
		if (mousePos.posX < grid.width && mousePos.posY < grid.height) {
			handleGridClickEvent(e, mousePos)
		}
	}

	const handleMouseMove = e => {
		const mousePos = getMousePos(e);
		redraw();
		ctx.fillText(`MouseX: ${mousePos.posX} MouseY: ${mousePos.posY}`, 20, window.innerHeight - 70)
		if (clickedSymbol.entity_code) {
			ctx.fillText(String.fromCharCode(clickedSymbol.entity_code), mousePos.posX, mousePos.posY)
		}
	}

	const handleCanvasMouseUp = e => {
		clickedSymbol = {};
		redraw();
	}

	if (canvasRef.current) {
		canvas = canvasRef.current;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d');

		if (symbols.length) {
			redraw();
		}
	}

	return (
		<>
			<canvas width={500} height={500} ref={canvasRef} onMouseDown={handleCanvasMouseDown}
				onMouseMove={handleMouseMove} onMouseUp={handleCanvasMouseUp}></canvas>
		</>
	);
}