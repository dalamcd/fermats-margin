import React, { useContext, useEffect, useRef, useState } from "react"
import { SymbolContext } from "./symbols/SymbolProvider"


export const Canvas = props => {

	const canvasRef = useRef();
	const cellSize = 50;
	const gridPadding = 50;
	const rowLength = 2;
	let gridSymbols = [];
	let symbolsOnCanvas = [];
	let ctx;
	let canvas;
	let clickedSymbol = undefined;
	let selectedWhiteboardSymbol = undefined;

	const grid = {
		width: 300,
		height: 500
	}

	const { symbols, getSymbols, getSymbolById, addEquationSymbol, removeEquationSymbol,
		equationSymbols, getEquationSymbols, updateEquationSymbol } = useContext(SymbolContext);

	useEffect(() => {
		getSymbols()
			.then(getEquationSymbols);
	}, [])

	useEffect(() => {
		redraw()
	})

	if (canvasRef.current) {
		canvas = canvasRef.current;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d');
	}

	const redraw = () => {
		if (symbols.length > 0 && gridSymbols.length == 0) {
			fillSymbolGrid(symbols, rowLength, gridPadding, cellSize)
		}
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			DrawGrid();
			equationSymbols.map(s => {
				if (!s.selected)
					ctx.fillText(String.fromCharCode(getSymbolById(s.symbol).entity_code), s.x, s.y)
			})
		}
	}

	const fillSymbolGrid = (symbols, rowLength, gridPadding, cellSize) => {

		const length = symbols.length

		for (let row = 0; row < Math.floor((length) / rowLength) + length % rowLength; row++) {
			for (let col = 0; col < rowLength; col++) {
				// This is kind of hacky but it makes it work for an abritrary grid size
				let index = col + row * rowLength
				if (index < length) {

					let x = gridPadding + cellSize * col
					let y = gridPadding + cellSize * row
					//ctx.fillText(String.fromCharCode(symbols[index].entity_code),
					//	x, y);
					let gridSymbol = {
						id: symbols[index].id,
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

	const DrawGrid = () => {
		ctx.font = "30px Courier";
		ctx.textBaseline = "top"

		gridSymbols.map(s => ctx.fillText(String.fromCharCode(s.entity_code), s.x, s.y));
	}

	const getMousePos = (e) => {
		if (canvas) {
			const rect = canvas.getBoundingClientRect();
			return {
				posX: e.clientX - rect.left,
				posY: e.clientY - rect.top
			};
		} else {
			return { posX: 0, posY: 0 }
		}
	}

	const checkSymbolInGrid = (symbol, mousePos) => {

		if (symbol.x < mousePos.posX && symbol.y < mousePos.posY && symbol.x + cellSize > mousePos.posX &&
			symbol.y + cellSize > mousePos.posY)
			return true;
		else
			return false;
	}

	const checkSymbolInWhiteboard = (symbol, mousePos) => {
		if (symbol.x < mousePos.posX && symbol.y < mousePos.posY && symbol.x + cellSize > mousePos.posX &&
			symbol.y + cellSize > mousePos.posY)
			return true;
		else
			return false;
	}

	const handleGridClickEvent = (e, mousePos) => {
		gridSymbols.map(symbol => {
			if (checkSymbolInGrid(symbol, mousePos)) {
				clickedSymbol = symbol;
				return;
			}
		});
	}

	const handleWhiteboardClickEvent = (e, mousePos) => {
		for (let i = 0; i < equationSymbols.length; i++)
			if (checkSymbolInWhiteboard(equationSymbols[i], mousePos)) {
				selectedWhiteboardSymbol = equationSymbols[i];
				equationSymbols[i].selected = true;
				break;
			}
	}

	const handleCanvasMouseDown = e => {
		const mousePos = getMousePos(e)
		if (mousePos.posX > grid.width) {
			handleWhiteboardClickEvent(e, mousePos)
		}
		if (mousePos.posX < grid.width && mousePos.posY < grid.height) {
			handleGridClickEvent(e, mousePos)
		}
	}

	const handleMouseMove = e => {
		const mousePos = getMousePos(e);
		redraw();
		ctx.fillText(`MouseX: ${mousePos.posX} MouseY: ${mousePos.posY}`, 20, window.innerHeight - 70)
		if (clickedSymbol) {
			ctx.fillText(String.fromCharCode(clickedSymbol.entity_code), mousePos.posX, mousePos.posY)
		}
		if (selectedWhiteboardSymbol) {
			const symbol = getSymbolById(selectedWhiteboardSymbol.symbol)
			ctx.fillText(String.fromCharCode(symbol.entity_code), mousePos.posX, mousePos.posY)
			ctx.strokeStyle = "#000000"
			ctx.lineWidth = 2
			const metrics = ctx.measureText(String.fromCharCode(symbol.entity_code))
			const width = metrics.width
			const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
			ctx.strokeRect(mousePos.posX, mousePos.posY,
				width,
				height);

		}
	}

	const handleCanvasMouseUp = e => {
		const mousePos = getMousePos(e);

		if (mousePos.posX < grid.width && mousePos.posY < grid.height) {
			clickedSymbol = undefined;
			redraw();
		} else if (clickedSymbol !== undefined) {
			const newSymbol = {
				symbol: clickedSymbol.id,
				equation: 1,
				x: mousePos.posX,
				y: mousePos.posY,
				size: 1.0
			}
			addEquationSymbol(newSymbol)
			symbolsOnCanvas.push(newSymbol)
			clickedSymbol = undefined;
			redraw();
		}

		if (selectedWhiteboardSymbol !== undefined) {
			if(mousePos.posX > grid.width) {
				selectedWhiteboardSymbol.x = mousePos.posX;
				selectedWhiteboardSymbol.y = mousePos.posY;

				updateEquationSymbol(selectedWhiteboardSymbol);

				selectedWhiteboardSymbol = undefined;
			} else {
				removeEquationSymbol(selectedWhiteboardSymbol.id);
				selectedWhiteboardSymbol = undefined;
			}
		}
	}

	return (
		<>
			<canvas width={500} height={500} ref={canvasRef} onMouseDown={handleCanvasMouseDown}
				onMouseMove={handleMouseMove} onMouseUp={handleCanvasMouseUp}></canvas>
		</>
	);
}