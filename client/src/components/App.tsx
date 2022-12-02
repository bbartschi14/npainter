import { BrowserRouter, Routes, Route } from "react-router-dom";
import Painter from "./pages/Painter";
import { MantineProvider } from "@mantine/core";

/**
 *
 */
const App = () => {
  return (
    <MantineProvider
      theme={{
        primaryColor: "gray",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Painter></Painter>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
