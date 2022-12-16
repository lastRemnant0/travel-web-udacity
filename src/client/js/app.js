function planHandler() {
  const dateDepartEl = document.getElementById("date-depart");
  const cardImageEl = document.querySelector(".trip-backgrund ");
  //set the min date for departure
  const newDate = new Date();

  dateDepartEl.setAttribute(
    "min",
    `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`
  );
  const planBtn = document.getElementById("search");
  planBtn.addEventListener("click", (e) => {
    e.preventDefault();
    //get the city value and date from user
    const cityEl = document.getElementById("city").value;
    const cardEl = document.querySelector(".card");
    // send user data to the backend
    if (cityEl === "" || dateDepartEl.value === "") {
      alert("Please, enter city and date");
    } else {
      Client.postData("http://localhost:3500/userPlan", { dest: cityEl }).then(
        (data) => {
          console.log(data);
          if (!data.cityImage) {
            cardImageEl.src = data.countryImage;
          } else {
            cardImageEl.src = data.cityImage;
          }
        }
      );
    }
  });
}
export { planHandler };
