import React, { createContext, useContext, useState } from "react"

export const SymbolContext = createContext()

export const SymbolProvider = props => {

	const [symbols, setSymbols] = useState([])

	const getSymbols = () => {
		return fetch("http://localhost:8000/symbols")
		.then(res => res.json())
		.then(setSymbols)
	}

	const getSymbolsByCategory = id => {
		return fetch(`http:/localhost:8000/symbols?category=${id}`)
		.then(res => res.json())
		.then(setSymbols)
	}

	return <SymbolContext.Provider value={{
		symbols, setSymbols, getSymbols, getSymbolsByCategory
	}}>
		{props.children}
	</SymbolContext.Provider>
}