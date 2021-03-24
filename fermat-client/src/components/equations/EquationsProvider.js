import React, { createContext, useState } from "react"

export const EquationContext = createContext()

export const EquationProvider = props => {

	const [equations, setEquations] = useState([]);

	const getEquations = () => {
		return fetch("http://localhost:8000/equations")
		.then(res =>  res.json())
		.then(res => {
			setEquations(res)
		})
	}

	const getEquationsByUser = userId => {
		return equations.filter(e => e.user === userId)
	}

	const addEquation = equation => {
		return fetch(`http://localhost:8000/equations`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(equation)
		})
		.then(res => res.json())
	}

	const removeEquation = equationId => {
		return fetch(`http://localhost:8000/equations/${equationId}`, {
			method: "DELETE"
		})
	}

	return <EquationContext.Provider value={{
		equations, getEquations, setEquations, getEquationsByUser, addEquation, removeEquation
	}}>
		{props.children}
	</EquationContext.Provider>

}