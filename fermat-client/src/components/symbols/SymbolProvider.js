import React, { createContext, useState } from "react"

export const SymbolContext = createContext()

export const SymbolProvider = props => {

	const [symbols, setSymbols] = useState([]);
	const [categorySymbols, setCategorySymbols] = useState([])
	const [equationSymbols, setEquationSymbols] = useState([]);
	const [categories, setCategories] = useState([]);

	const getSymbols = () => {
		return fetch("http://localhost:8000/symbols")
			.then(res => res.json())
			.then(setSymbols)
	}

	const getCategories = () => {
		return fetch(`http://localhost:8000/categories`)
			.then(res => res.json())
			.then(setCategories)
	}

	const getSymbolsByCategory = id => {
		return fetch(`http://localhost:8000/symbols?category=${id}`)
			.then(res => res.json())
			.then(setCategorySymbols)
	}

	const getSymbolById = id => {
		return symbols.find(s => {
			return s.id === parseInt(id)
		})
	}

	const addEquationSymbol = symbol => {
		return fetch(`http://localhost:8000/equationsymbols`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(symbol)
		})
			.then(() => {
				getSymbolsForEquation(symbol.equation)
			})
	}

	const getEquationSymbols = () => {
		return fetch(`http://localhost:8000/equationsymbols`)
			.then(res => res.json())
			.then(setEquationSymbols)
	}

	const getSymbolsForEquation = equationId => {
		return fetch(`http://localhost:8000/equationsymbols/${equationId}`)
			.then(res => res.json())
			.then(setEquationSymbols)
	}

	const updateEquationSymbol = symbol => {
		return fetch(`http://localhost:8000/equationsymbols/${symbol.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(symbol)
		})
			.then(() => {
				getSymbolsForEquation(symbol.equation)
			})
	}

	const removeEquationSymbol = symbol => {
		return fetch(`http://localhost:8000/equationsymbols/${symbol.id}`, {
			method: "DELETE"
		})
			.then(() => {
				getSymbolsForEquation(symbol.equation)
			})
	}

return <SymbolContext.Provider value={{
	symbols, setSymbols, getSymbols, getSymbolsByCategory, getSymbolById, addEquationSymbol, getEquationSymbols,
	equationSymbols, setEquationSymbols, updateEquationSymbol, removeEquationSymbol, getSymbolsForEquation,
	categories, getCategories, categorySymbols, setCategorySymbols
}}>
	{props.children}
</SymbolContext.Provider>
}