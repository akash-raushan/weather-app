document.addEventListener("DOMContentLoaded", async function () {
    var locationElement = document.getElementsByClassName("location")[0];
    var temp = document.getElementsByClassName("temp")[0];
    var wind = document.getElementsByClassName("wind")[0];
    var rain = document.getElementsByClassName("rain")[0];
    var sunrise = document.getElementsByClassName("sunrise")[0];
    var sunset = document.getElementsByClassName("sunset")[0];
    var icon = document.getElementsByClassName("icon")[0];
    var date = document.getElementsByClassName("date")[0];
  
    const key = import.meta.env.VITE_APIKEY;
  
    const ftoc = (tempInF) => Math.floor((5 * (tempInF - 32)) / 9);
  
    const getWeather = async (inputLocation) => {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${inputLocation}?key=${key}&contentType=json`;
      try {
        const response = await fetch(url, { method: "GET" });
        const json = await response.json();
        console.log(json);
  
        const currentDate = new Date();
        const formattedDate = currentDate.toDateString();
        setInterval(() => {
          const currentTime = new Date().toLocaleTimeString();
          date.innerHTML = `${formattedDate} ${currentTime}`;
        }, 1000);
  
        locationElement.innerHTML = `${json.resolvedAddress}`;
        temp.innerHTML = `${ftoc(json.currentConditions.temp)}°C`;
        wind.innerHTML = `${json.currentConditions.windspeed} mph`;
        rain.innerHTML = `${json.currentConditions.precipprob} %`;
        sunrise.innerHTML = `${json.currentConditions.sunrise}`;
        sunset.innerHTML = `${json.currentConditions.sunset}`;
        icon.src = `asset/${json.currentConditions.icon}.png`;
  
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const todayIndex = currentDate.getDay();
        const forecastContainer = document.getElementsByClassName("forecast-container")[0];
        forecastContainer.innerHTML = ""; // Clear previous forecast
  
        for (let i = 1; i <= 5; i++) {
          const dayIndex = (todayIndex + i) % 7;
          const day = daysOfWeek[dayIndex];
          const forecast = json.days[i - 1];
  
          if (forecast) {
            const card = document.createElement("div");
            card.className = "card flex flex-col flex-auto basis-1/6 list-none items-center gap-2 justify-center";
            card.innerHTML = `
              <span class="day lg:text-2xl lg:font-bold">${day}</span>
              <img src="asset/${forecast.icon}.png" class="icon size-12 lg:size-20" alt="">
              <span class="temp text-xl lg:text-2xl lg:font-semibold">${ftoc(forecast.temp)} °C</span>
            `;
            forecastContainer.appendChild(card);
          }
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
  
    // Initial call to fetch weather data
    getWeather("Arwal");
  
    // Attach getWeather to window to make it accessible from HTML
    window.getWeather = getWeather;
  });
  