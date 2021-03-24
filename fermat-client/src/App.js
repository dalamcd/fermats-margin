import React from "react"
import { Login } from "./components/auth/Login"
import { Register } from "./components/auth/Register"
import { Canvas } from "./components/Canvas"
import { Route, Redirect } from "react-router-dom"
import { SymbolProvider } from './components/symbols/SymbolProvider';
import { EquationProvider } from "./components/equations/EquationsProvider";
import { EquationTextProvider } from "./components/symbols/EquationTextProvider";

export const FermatsMargin = () => {
  return (
    <>
      <Route render={() => {
        if (localStorage.getItem("fm_token")) {
          return <>
            <EquationTextProvider>
              <EquationProvider>
                <SymbolProvider>
                  <Canvas />
                </SymbolProvider>
              </EquationProvider>
            </EquationTextProvider>
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