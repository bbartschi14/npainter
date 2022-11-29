import { BrowserRouter, Routes, Route } from "react-router-dom";
import Painter from "./pages/Painter";

/**
 *
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Painter></Painter>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
