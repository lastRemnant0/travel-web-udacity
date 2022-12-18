function planHandler() {
  const dateDepartEl = document.getElementById("date-depart");
  const cardImageTempEl = document.querySelector(".trip-background-temp");

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
    const cityEl = document.getElementById("city").value;

    // send user data to the backend
    if (
      cityEl === "" ||
      !destPattern.test(cityEl) ||
      dateDepartEl.value === "" ||
      !datePattern.test(dateDepartEl.value)
    ) {
      alert("Please, enter city and date");
    } else {
      const daysRemain = Client.daysRemaining(
        new Date(dateDepartEl.value),
        currentData
      );
      Client.postData("http://localhost:3000/userPlan", {
        dest: cityEl,
        depart_date: dateDepartEl.value,
        days_to: daysRemain,
      }).then(async (data) => {
        console.log(data);
        if (!data.cityImage) {
          cardImageTempEl.src = data.countryImage;
        } else {
          cardImageTempEl.src = data.cityImage;
        }
        // calling our function to update UI
        Client.updateTempUI(data);
        setTimeout(
          () =>
            document
              .querySelector(".plan-result-temp")
              .classList.toggle("active"),
          500
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

// async function getPixa(city) {
//   const response = await fetch(
//     `https://pixabay.com/api/?key=${process.env.PIXBAY_API_KEY}&q=${city}&image_type=photo&pretty=true`
//   );

//   try {
//     const newData = response.json();
//     return newData;
//   } catch (err) {
//     console.log("pixa client: " + err);
//   }
// }
export { planHandler };
