import "./AppLayout.style.css";
import React from "react";
import logo from "./img/logo.png";
import todaysIcon from "./img/Today’s.svg"; // Today's.svg 이미지 import
import recipeIcon from "./img/Recipe.svg"; // Recipe.svg 이미지 import
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AppLayout = () => {
  const navigate = useNavigate();

  const goPage = (menu) => {
    navigate(`/${menu}`);
  };

  return (
    <div className="container">
      <div className="navbar-container">
        <div className="image-container">
          <img src={todaysIcon} alt="Logo" onClick={() => goPage("")} />
          <img src={recipeIcon} alt="Logo" onClick={() => goPage("")} />
        </div>
        <div className="menu-container">
          <div onClick={() => goPage("recommended")}>추천 레시피</div>
          <div onClick={() => goPage("myrecipe")}>나의 레시피</div>
          <div onClick={() => goPage("findrecipe")}>레시피 찾기</div>
          <div onClick={() => goPage("ingredient")}>재료관리</div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default AppLayout;
