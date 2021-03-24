import React, { createContext, useState } from "react"

export const UserContext = createContext()

export const UserProvider = props => {

	const getEquations = () => {
		return fetch("http://localhost:8000/equations")
		.then(res => {res.json()})
		.then(setEquations)
	}

	return <UserContext.Provider value={{
		users, getusers, getusersByUser
	}}>
		{props.children}
	</UserContext.Provider>

}