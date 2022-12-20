function planHandler() {
  // creating our json to save trips
  let savedTrips = JSON.parse(localStorage.getItem("savedTrips")) || [];

  if (savedTrips.length > 0) {
    Client.savedTripsUI(savedTrips);
  }

  const dateDepartEl = document.getElementById("date-depart");
  const cardImageTempEl = document.querySelector(".trip-background-temp");

  const planBtn = document.getElementById("search");
  const cancelBtn = document.getElementById("cancel");
  const saveBtn = document.getElementById("save");
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
      return;
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
        document.querySelector(".plan-result-temp").classList.toggle("active");
        //when user cancel the plan clear all fields and return to form
        cancelBtn.addEventListener("click", (e) => {
          e.preventDefault();
          document.getElementById("city").value = "";
          dateDepartEl.value = "";
          document
            .querySelector(".plan-result-temp")
            .classList.remove("active");
        });

        // to save the data to the local storage and update saved trips UI
        saveBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          // creating basic id solution to save it with the created date of the trip
          const id = Math.floor(Math.random() * 100000);
          const createdDate = new Date().getTime();
          console.log(id);
          const savedTrip = await {
            id: id,
            createdDate: createdDate,
            ...data,
          };
          savedTrips.push(savedTrip);
          localStorage.setItem("savedTrips", JSON.stringify(savedTrips));

          document.getElementById("city").value = "";
          dateDepartEl.value = "";
          document
            .querySelector(".plan-result-temp")
            .classList.remove("active");

          // show up the new trip
          window.location.reload();
        });
      });
    }
  });
}

export { planHandler };
