function planHandler() {
  const dateDepartEl = document.getElementById("date-depart");
  const cardImageTempEl = document.querySelector(".trip-backgrund-temp");

  const planBtn = document.getElementById("search");
  const cancelBtn = document.getElementById("cancel");

  // regex to validate the date
  const datePattern = /^\d{4}\-\d{2}\-\d{2}$/;
  // regex to validate the dest
  const destPattern = /^[a-zA-Z\s]+$/;
  //set the min date for departure
  const currentData = new Date();
  dateDepartEl.setAttribute(
    "min",
    `${currentData.getFullYear()}-${
      currentData.getMonth() + 1
    }-${currentData.getDate()}`
  );

  //event listener to the click of user for planning
  planBtn.addEventListener("click", (e) => {
    e.preventDefault();
    //get the city value and date from user
    console.log("depart date: " + new Date(dateDepartEl.value));
    console.log("current date: " + currentData);
    console.log(
      `DAYS REMAINING TO YOUR NEXT TRIP IS: ${Client.daysRemaining(
        new Date(dateDepartEl.value),
        currentData
      )}`
    );
    const cityEl = document.getElementById("city").value;
    const cardEl = document.querySelector(".card");
    // send user data to the backend
    if (
      cityEl === "" ||
      !destPattern.test(cityEl) ||
      dateDepartEl.value === "" ||
      !datePattern.test(dateDepartEl.value)
    ) {
      alert("Please, enter city and date");
    } else {
      Client.postData("http://localhost:8081/userPlan", {
        dest: cityEl,
        depart_date: dateDepartEl.value,
      }).then((data) => {
        console.log(data);
        if (!data.cityImage) {
          cardImageTempEl.src = data.countryImage;
        } else {
          cardImageTempEl.src = data.cityImage;
        }
        setTimeout(
          () =>
            document
              .querySelector(".plan-result-temp")
              .classList.toggle("active"),
          1000
        );
        //when user cancel the plan clear all fields and return to form
        cancelBtn.addEventListener("click", (e) => {
          e.preventDefault();
          document.getElementById("city").value = "";
          document
            .querySelector(".plan-result-temp")
            .classList.remove("active");
        });
      });
    }
  });
}

export { planHandler };
