import React from "react"
import { Login } from "./components/auth/Login"
import { Register } from "./components/auth/Register"
import { Canvas } from "./components/Canvas"
import { SymbolProvider } from './components/symbols/SymbolProvider';
import { Route, Redirect } from "react-router-dom"
import { EquationProvider } from "./components/equations/EquationsProvider";


export const FermatsMargin = () => {
  return (
    <>
      <Route render={() => {
        if (localStorage.getItem("fm_token")) {
          return <>
            <EquationProvider>
              <SymbolProvider>
                <Canvas />
              </SymbolProvider>
            </EquationProvider>
          </>
        } else {
          return <Redirect to="/login" />
        }
      }} />

      <Route path="/login" render={Login} />
      <Route path="/register" render={Register} />
    </>
  )
}
export default FermatsMargin