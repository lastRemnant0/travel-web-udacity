import { planHandler } from "./js/app";
import { postData } from "./js/postData";

import "./styles/reset.scss";
import "./styles/header.scss";
import "./styles/main.scss";
import "./styles/footer.scss";

import backgroundMain from "./images/pexels-tobias-bjørkli-2104152.jpg";
const heroBgEl = document.getElementById("hero-background");
heroBgEl.style.backgroundImage = `url(${backgroundMain})`;
console.log(process.env.NAME);

window.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  planHandler();
});

export { planHandler, postData };
