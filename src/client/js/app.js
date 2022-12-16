function planHandler() {
  const dateDepartEl = document.getElementById("date-depart");
  const cardImageTempEl = document.querySelector(".trip-backgrund-temp");

  //set the min date for departure
  const newDate = new Date();
  dateDepartEl.setAttribute(
    "min",
    `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`
  );
  const planBtn = document.getElementById("search");
  const cancelBtn = document.getElementById("cancel");
  //event listener to the click of user for planning
  planBtn.addEventListener("click", (e) => {
    e.preventDefault();
    //get the city value and date from user
    const cityEl = document.getElementById("city").value;
    const cardEl = document.querySelector(".card");
    // send user data to the backend
    if (cityEl === "" || dateDepartEl.value === "") {
      alert("Please, enter city and date");
    } else {
      Client.postData("http://localhost:8081/userPlan", { dest: cityEl }).then(
        (data) => {
          console.log(data);
          if (!data.cityImage) {
            cardImageTempEl.src = data.countryImage;
          } else {
            cardImageTempEl.src = data.cityImage;
          }
          document
            .querySelector(".plan-result-temp")
            .classList.toggle("active");
          //when user cancel the plan clear all fields and return to form
          cancelBtn.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("city").value = "";
            document
              .querySelector(".plan-result-temp")
              .classList.remove("active");
          });
        }
      );
    }
  });
}
export { planHandler };
