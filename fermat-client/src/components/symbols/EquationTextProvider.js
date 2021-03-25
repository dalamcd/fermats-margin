import React, { createContext, useState } from "react"

export const EquationTextContext = createContext()

export const EquationTextProvider = props => {

	const [equationText, setEquationText] = useState([])

	const getEquationText = () => {
		return fetch(`http://localhost:8000/equationtext`)
			.then(res => res.json())
			.then(setEquationText)
	}

	const addEquationText = text => {
		return fetch(`http://localhost:8000/equationtext`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(text)
		})
		.then(() => {
			getTextForEquation(text.equation)
		})
	}

	const getTextForEquation = equationId => {
		return fetch(`http://localhost:8000/equationtext/${equationId}`)
			.then(res => res.json())
			.then(setEquationText)
	}

	const updateEquationText = text => {
		return fetch(`http://localhost:8000/equationtext/${text.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(text)
		})
			.then(() => {
				getTextForEquation(text.equation)
			})
	}

	const removeEquationText = text => {
		return fetch(`http://localhost:8000/equationtext/${text.id}`, {
			method: "DELETE"
		})
		.then(() => {
			getTextForEquation(text.equation)
		})
	}

	return <EquationTextContext.Provider value={{
		getEquationText, getTextForEquation, updateEquationText, removeEquationText, addEquationText, equationText
	}}>
		{props.children}
	</EquationTextContext.Provider>
}