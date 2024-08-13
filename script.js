document.addEventListener("DOMContentLoaded", async function () {
    var locationElement = document.getElementsByClassName("location")[0];
    var temp = document.getElementsByClassName("temp")[0];
    var wind = document.getElementsByClassName("wind")[0];
    var rain = document.getElementsByClassName("rain")[0];
    var sunrise = document.getElementsByClassName("sunrise")[0];
    var sunset = document.getElementsByClassName("sunset")[0];
    var icon = document.getElementsByClassName("icon")[0];
    var localDate = document.getElementsByClassName("yourDate")[0];
    var submitButton = document.getElementsByClassName('submitButton')[0];
    var inputNewLocation = document.getElementsByClassName('inputNewLocation')[0];
    var modal = document.getElementById('locationModal');
    var changeLocationButton = document.getElementById('changeLocation');
    var closeModalButton = document.getElementsByClassName('closeModalButton')[0];

    const key = import.meta.env.VITE_APIKEY;
    const defaultLocation = 'delhi';

    const ftoc = (tempInF) => Math.floor((5 * (tempInF - 32)) / 9);
    const getLocalTime = (timezone) => {
        const options = { timeZone: timezone, hour12: true, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Intl.DateTimeFormat([], options).format(new Date());
    };

    const getWeather = async (location) => {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${key}&contentType=json`;
        // const url='1.json';
        try {
            const response = await fetch(url, { method: "GET" });
            const json = await response.json();
            console.log(json);

            // setInterval(() => {
            //     let localTime = getLocalTime(json.timezone);
            //     localDate.innerHTML = `${localTime}`;                
            // }, 1000);

            const currentDate = new Date();

            const formattedDate = currentDate.toDateString();
            setInterval(() => {
                const currentTime = new Date().toLocaleTimeString();
                localDate.innerHTML = `${formattedDate} ${currentTime}`;
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
                    card.className = "card flex flex-col flex-auto basis-1/6 list-none items-center  justify-center";
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
    getWeather(defaultLocation);

    // Event listener to open the modal
    changeLocationButton.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    // Event listener to close the modal
    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Event listener to update weather on submit
    submitButton.addEventListener('click', () => {
        const newLocation = inputNewLocation.value.trim();
        if (newLocation) {
            getWeather(newLocation);
            modal.classList.add('hidden');
            inputNewLocation.value = ""
        }
    });
});
