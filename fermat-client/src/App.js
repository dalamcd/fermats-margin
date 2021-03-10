import logo from './logo.svg';
import './App.css';
import { Canvas } from "./components/Canvas"
import { SymbolGrid } from './components/symbols/SymbolGrid';
import { SymbolProvider } from './components/symbols/SymbolProvider';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SymbolProvider>
          <SymbolGrid />
        </SymbolProvider>
        <Canvas />
      </header>
    </div>
  );
}

export default App;
