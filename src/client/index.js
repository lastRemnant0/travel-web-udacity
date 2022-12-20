import { planHandler } from "./js/app";
import { postData } from "./js/postData";
import { daysRemaining } from "./js/daysRemaining";
import { updateTempUI } from "./js/updateTempUI";
import { savedTripsUI } from "./js/savedTripsUI";
import "./styles/reset.scss";
import "./styles/header.scss";
import "./styles/main.scss";
import "./styles/footer.scss";

import backgroundMain from "./images/pexels-tobias-bjørkli-2104152.jpg";
const heroBgEl = document.getElementById("hero-background");
heroBgEl.style.backgroundImage = `url(${backgroundMain})`;

window.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  planHandler();
});

export { planHandler, postData, daysRemaining, updateTempUI, savedTripsUI };
