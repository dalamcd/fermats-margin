import React, { useContext, useEffect, useRef, useState } from "react"
import { EquationContext } from "./equations/EquationsProvider";
import { SymbolContext } from "./symbols/SymbolProvider"
import { EquationTextContext } from "./symbols/EquationTextProvider";


export const Canvas = props => {

	const canvasRef = useRef();
	const loadDialog = React.createRef();
	const loadEquation = useRef();
	const newDialog = React.createRef();
	const newEquation = useRef();
	const addTextDialog = React.createRef();
	const newText = useRef();

	const [currentEquation, setCurrentEquation] = useState(1)
	const [currentCategory, setCurrentCategory] = useState(1)

	const cellSize = 50;
	const gridPadding = 50;
	const rowLength = 2;
	let gridSymbols = [];
	let gridCategories = [];
	let ctx;
	let canvas;
	let clickedSymbol = undefined;
	let selectedWhiteboardSymbol = undefined;
	let loadPos = {};
	let newPos = {};
	let addTextPos = {};

	const grid = {
		width: 300,
		height: 500
	};

	const { symbols, getSymbols, getSymbolById, addEquationSymbol, removeEquationSymbol,
		equationSymbols, getSymbolsForEquation, updateEquationSymbol, categories, getCategories,
		getSymbolsByCategory, categorySymbols } = useContext(SymbolContext);

	const { equations, getEquations, getEquationsByUser, addEquation, removeEquation } = useContext(EquationContext)

	const { equationText, getEquationText, getTextForEquation, addEquationText,
		updateEquationText, removeEquationText } = useContext(EquationTextContext)

	useEffect(() => {
		getCategories()
			.then(getEquationText)
			.then(getEquations)
			.then(getSymbols)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		getSymbolsByCategory(currentCategory)
	}, [currentCategory])

	useEffect(() => {
		redraw()
	})

	useEffect(() => {
		const userEquations = getEquationsByUser(localStorage.getItem("fm_token"))
		if (userEquations.length > 0) {
			getSymbolsForEquation(userEquations[userEquations.length - 1].id)
			getTextForEquation(userEquations[userEquations.length - 1].id)

			setCurrentEquation(userEquations[userEquations.length - 1].id)
		}
	}, [equations])

	if (canvasRef.current) {
		canvas = canvasRef.current;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d');
	}

	const redraw = () => {
		if (symbols.length > 0 && gridSymbols.length === 0) {
			fillSymbolGrid(categorySymbols, rowLength, gridPadding, cellSize)
		}
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			DrawGrid();
			DrawCategories(3);
			ctx.font = "30px Courier";
			equationSymbols.forEach(s => {
				if (!s.selected) {
					const symbol = getSymbolById(s.symbol)
					if (symbol)
						ctx.fillText(String.fromCharCode(symbol.entity_code), s.x, s.y)
				}
			})
			equationText.forEach(t => {
				if (!t.selected) {
					ctx.fillText(t.content, t.x, t.y)
				}
			})
			DrawLoad();
			DrawNew();
			DrawAddText();
			//DEBUG
			//ctx.fillText(currentEquation, canvas.width - 50, 20)
		}
	}

	const DrawAddText = () => {
		ctx.fillText("Add Text", 380, canvas.height - 50)
		const metrics = ctx.measureText("Load")
		addTextPos = {
			top: canvas.height - 50,
			left: 380,
			right: 380 + metrics.width,
			bottom: canvas.height - 50 - metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

		}
	}

	const DrawCategories = (rowLength) => {
		const length = categories.length;
		let curLen = 0;

		if (length > 0) {
			for (let row = 0; row < Math.floor((length) / rowLength) + length % rowLength; row++) {
				curLen = 0;
				for (let col = 0; col < rowLength; col++) {
					// This is kind of hacky but it makes it work for an abritrary grid size
					let index = col + row * rowLength
					if (index < length) {
						ctx.font = "12px Courier"
						const metrics = ctx.measureText(categories[index].name)
						const top = 500 + (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent * row)
						const newCategory = {
							id: categories[index].id,
							name: categories[index].name,
							left: curLen,
							top: top,
							right: curLen + metrics.width + 15,
							bottom: top + metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
						};

						ctx.font = "12px Courier";
						ctx.fillText(newCategory.name, newCategory.left, newCategory.top);
						curLen += metrics.width + 15;
						gridCategories.push(newCategory);
					}
					else {
						break;
					}
				}
			}
		}
	}

	const DrawLoad = () => {

		ctx.fillText("Load", 20, canvas.height - 50)
		const metrics = ctx.measureText("Load")
		loadPos = {
			top: canvas.height - 50,
			left: 20,
			right: 20 + metrics.width,
			bottom: canvas.height - 50 - metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

		}
	}

	const DrawNew = () => {

		ctx.fillText("New", 200, canvas.height - 50)
		const metrics = ctx.measureText("New")
		newPos = {
			top: canvas.height - 50,
			left: 200,
			right: 200 + metrics.width,
			bottom: canvas.height - 50 - metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

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
		gridSymbols.forEach(symbol => {
			if (checkSymbolInGrid(symbol, mousePos)) {
				clickedSymbol = symbol;
				return;
			}
		});
	}

	const handleWhiteboardClickEvent = (e, mousePos) => {
		let found = false;
		for (let i = 0; i < equationSymbols.length; i++) {
			if (checkSymbolInWhiteboard(equationSymbols[i], mousePos)) {
				selectedWhiteboardSymbol = equationSymbols[i];
				equationSymbols[i].selected = true;
				found = true;
				break;
			}
		}

		if (found)
			return;

		for (let i = 0; i < equationText.length; i++) {
			if (checkSymbolInWhiteboard(equationText[i], mousePos)) {
				selectedWhiteboardSymbol = equationText[i];
				equationText[i].selected = true;
				break;
			}
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
		if (ctx) {
			//DEBUG
			//ctx.fillText(`MouseX: ${mousePos.posX} MouseY: ${mousePos.posY}`, 20, window.innerHeight - 70)
			if (clickedSymbol) {
				ctx.fillText(String.fromCharCode(clickedSymbol.entity_code), mousePos.posX, mousePos.posY)
			}
			if (selectedWhiteboardSymbol) {
				let symbol = undefined;
				let metrics;

				if (selectedWhiteboardSymbol.symbol)
					symbol = getSymbolById(selectedWhiteboardSymbol.symbol)

				if (!symbol) {
					ctx.fillText(selectedWhiteboardSymbol.content, mousePos.posX, mousePos.posY)
					metrics = ctx.measureText(selectedWhiteboardSymbol.content)

				} else {
					ctx.fillText(String.fromCharCode(symbol.entity_code), mousePos.posX, mousePos.posY)
					metrics = ctx.measureText(String.fromCharCode(symbol.entity_code))
				}

				ctx.strokeStyle = "#000000"
				ctx.lineWidth = 2
				const width = metrics.width
				const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
				ctx.strokeRect(mousePos.posX, mousePos.posY,
					width,
					height);

			}
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
				equation: currentEquation,
				x: mousePos.posX,
				y: mousePos.posY,
				size: 1.0
			}
			addEquationSymbol(newSymbol)
			clickedSymbol = undefined;
			redraw();
		}

		if (selectedWhiteboardSymbol !== undefined) {
			if (mousePos.posX > grid.width) {
				selectedWhiteboardSymbol.x = mousePos.posX;
				selectedWhiteboardSymbol.y = mousePos.posY;

				if (selectedWhiteboardSymbol.symbol)
					updateEquationSymbol(selectedWhiteboardSymbol);
				else
					updateEquationText(selectedWhiteboardSymbol);

				selectedWhiteboardSymbol = undefined;
			} else {
				if (selectedWhiteboardSymbol.symbol)
					removeEquationSymbol(selectedWhiteboardSymbol);
				else
					removeEquationText(selectedWhiteboardSymbol)
				selectedWhiteboardSymbol = undefined;
			}
		}
	}

	const handleCanvasClick = e => {
		const mousePos = getMousePos(e);
		if (mousePos.posX > loadPos.left && mousePos.posX < loadPos.right
			&& mousePos.posY > loadPos.top && mousePos.posY < loadPos.bottom) {
			loadDialog.current.showModal();
		}
		if (mousePos.posX > newPos.left && mousePos.posX < newPos.right
			&& mousePos.posY > newPos.top && mousePos.posY < newPos.bottom) {
			newDialog.current.showModal()
		}
		if (mousePos.posX > addTextPos.left && mousePos.posX < addTextPos.right
			&& mousePos.posY > addTextPos.top && mousePos.posY < addTextPos.bottom) {
			addTextDialog.current.showModal()
		}

		for (let i = 0; i < gridCategories.length; i++) {
			if (mousePos.posX > gridCategories[i].left && mousePos.posX < gridCategories[i].right
				&& mousePos.posY > gridCategories[i].top && mousePos.posY < gridCategories[i].bottom) {
				setCurrentCategory(gridCategories[i].id)
				break;
			}
		}
	}

	return (
		<>
			<dialog className="addTextDialog" ref={addTextDialog}>
				<input type="text" ref={newText} />
				<button className="button--add-text" onClick={() => {
					if (canvas) {
						addEquationText({
							x: canvas.width / 2,
							y: canvas.height / 2,
							content: newText.current.value,
							equation: currentEquation,
							size: 1.0
						})
					}
					addTextDialog.current.close()
				}}>Add</button>
				<button className="button--close" onClick={e => addTextDialog.current.close()}>Close</button>
			</dialog>
			<dialog className="newDialog" ref={newDialog}>
				<input type="text" ref={newEquation}></input>
				<button className="button--add" onClick={(e) => {
					let id;
					addEquation({
						user: localStorage.getItem("fm_token"),
						name: newEquation.current.value
					})
						.then(res => {
							console.log(res)
							setCurrentEquation(res.id)
							getEquations();
						})
					newDialog.current.close();
				}}>Add</button>

				<button className="button--close" onClick={e => newDialog.current.close()}>Close</button>
			</dialog>

			<dialog className="loadDialog" ref={loadDialog}>
				<select ref={loadEquation} name="equations" id="equations">
					{equations && getEquationsByUser(localStorage.getItem("fm_token")).map(e => {
						return (
							<option value={e.id}>{e.name}</option>
						)
					})}
				</select>
				<button className="button--load" onClick={(e) => {
					getSymbolsForEquation(loadEquation.current.value);
					getTextForEquation(loadEquation.current.value);
					setCurrentEquation(loadEquation.current.value)
					loadDialog.current.close();
				}}>Load</button>
				<button className="button--delete" onClick={(e) => {
					removeEquation(loadEquation.current.value)
						.then(getEquations)
					loadDialog.current.close();
				}}>Delete</button>
				<button className="button--close" onClick={e => loadDialog.current.close()}>Close</button>
			</dialog>
			<canvas width={500} height={500} ref={canvasRef} onMouseDown={handleCanvasMouseDown}
				onMouseMove={handleMouseMove} onMouseUp={handleCanvasMouseUp} onClick={handleCanvasClick}></canvas>
		</>
	);
}