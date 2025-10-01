import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import InputData from "./input";
import Start from "./start";
import Price from "./price";
import Shuttle from "./transport";
import Struk from "./struk";

const App = () => {
  return (
    <div>
      <BrowserRouter basename="/Transport">
        <Routes>
          <Route path="/" element={<Start />} ></Route>
          <Route path="/home" element={<Home />} ></Route>
          <Route path="/start" element={<InputData />} ></Route>
          <Route path="/price" element={<Price />} ></Route>
          <Route path="/shuttle" element={<Shuttle />} ></Route>
          <Route path="/struk" element={<Struk />} ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;