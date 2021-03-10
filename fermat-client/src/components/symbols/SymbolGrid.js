import React, { useContext, useEffect } from "react"
import { SymbolContext } from "./SymbolProvider"
import "./Symbol.css"

export const SymbolGrid = props => {

	const { symbols, getSymbols } = useContext(SymbolContext)

	useEffect(() => {
		getSymbols()
	}, [])

	if(symbols.length > 0) {
		return (
			<>
			{symbols.map(s => {
				return <p className="mathSymbol" draggable={true} key={s.id}>{String.fromCharCode(s.entity_code)}</p>;
			})}
			</>
		)
	} else {
		return (
			<div>Loading symbol table...</div>
		)
	}
}