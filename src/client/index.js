import "./styles/reset.scss";
import "./styles/header.scss";
import "./styles/main.scss";
import "./styles/footer.scss";
console.log(process.env.NAME);
window.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("U CLICKED THE WINDOW");
});
