import "./App.css";
import Authenticated from "./Authenticated";
import FilterableProductTable from "./FilterableProductTable";

function App() {
  return (
    <div className="App">
    <Authenticated>
      <FilterableProductTable />
    </Authenticated>
    </div>
  );
}

export default App;
