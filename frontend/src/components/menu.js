import React from "react";
import "./menu_style.css";
import { Link, useNavigate } from "react-router-dom";


function addClassActive(id, nomeClasseMainContent) {
  let attualmenteSelezionato = document.querySelectorAll(".voceMenuActive");

  [].forEach.call(attualmenteSelezionato, function (el) {
    el.classList.remove("voceMenuActive");
  });

  document.getElementById(id).classList.add("voceMenuActive");
}

function Menu() {
  let nav = useNavigate();

  return (
    <div className="contenitoreMenu">
      {/** <img src={logoPath} className="logoMenu" /> */}

      <div className="contenitoreVociMenu" id="menu-medico">
        <Link
          to={"/chatbot"}
          className="voceMenuText"
          onClick={() => addClassActive(1, "contenitoreMainContent")}
        >
          <div className="voceMenu voceMenuActive" id="1">
            <span>Chatbot</span>
          </div>
        </Link>

        <Link
          to={"/"}
          className="voceMenuText"
          onClick={() => addClassActive(2, "contenitoreMainContent")}
        >
          <div className="voceMenu voceMenuActive" id="2">
            <span>Culture Inspector</span>
          </div>
        </Link>

      </div>
    </div>
  );
}
export default Menu;