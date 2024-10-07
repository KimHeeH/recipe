import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Homepage/Homepage";
import Ingredient from "./Ingredient/Ingredient";
import AppLayout from "./AppLayout/AppLayout";
import Recommended from "./Recommended/Recommended";
import MyRecipe from "./MyRecipe/MyRecipe";
import FindRecipe from "./FindRecipe/FindRecipe";
function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Homepage />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/myrecipe" element={<MyRecipe />} />
        <Route path="/findrecipe" element={<FindRecipe />} />
        <Route path="/ingredient" element={<Ingredient />} />
      </Route>
    </Routes>
  );
}

export default App;
