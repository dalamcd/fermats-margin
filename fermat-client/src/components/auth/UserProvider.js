import React, { createContext, useState } from "react"

export const UserContext = createContext()

export const UserProvider = props => {

	const [users, setEquations] = useState();

	const getEquations = () => {
		return fetch("http://localhost:8000/equations")
		.then(res => {res.json()})
		.then(setEquations)
	}

	const getEquationsByUser = userId => {
		return equations.filter(e => parseInt(e.user_id) === parseInt(userId) )
	}

	return <UserContext.Provider value={{
		users, getusers, getusersByUser
	}}>
		{props.children}
	</UserContext.Provider>

}