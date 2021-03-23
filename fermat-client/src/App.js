import './App.css';
import { Canvas } from "./components/Canvas"
import { SymbolProvider } from './components/symbols/SymbolProvider';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SymbolProvider>
          <Canvas />
        </SymbolProvider>
      </header>
    </div>
  );
}

export default App;
