import React from "react";
import "./menu_style.css";
import { Link, useNavigate } from "react-router-dom";
import { MdChat } from 'react-icons/md';
import logoPath from "../images/Logo.png";
import { MdPlace } from 'react-icons/md';

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
      { <img src={logoPath} className="logoMenu" /> }

      <div className="contenitoreVociMenu">
        <Link
          to={"/"}
          className="voceMenuText"
          onClick={() => addClassActive(2, "contenitoreMainContent")}
        >
          <div className="voceMenu voceMenuActive" id="2">
                <MdPlace className="iconaMenu"/>
            <span>Culture Inspector</span>
          </div>
        </Link>

        <Link
          to={"/chatbot"}
          className="voceMenuText"
          onClick={() => addClassActive(1, "contenitoreMainContent")}
        >
          <div className="voceMenu" id="1">
            <MdChat className="iconaMenu"/>
            <span>Chatbot</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
export default Menu;