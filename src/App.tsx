//Root application component.
// Coordinates the major sections of the application.

import Header from "./components/Header";


function App() {
  return (
    <>
      <Header title="MOMENTUM" />


      <main>
        <p>Build 0.0.1a</p>

        <button>
          Begin Today
        </button>
      </main>
    </>
  );
}

export default App;