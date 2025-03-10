const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "62d54e0029589449c2fcf0f46c131b47";

document.addEventListener("DOMContentLoaded", () => {
  const lastedData = JSON.parse(localStorage.getItem("data"));
  if (lastedData) {
    getWeatherData(lastedData.name);
    displayWeatherData(JSON.parse(localStorage.getItem("data")));
  }
});

function saveToLocalStorage(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (city) {
    try {
      let weatherData = await getWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please Enter The City");
  }
});

async function getWeatherData(city) {
  try {
    let apiLink = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );
    if (!apiLink.ok) {
      throw new Error("City Is Wrong");
    }
    const data = await apiLink.json();
    saveToLocalStorage(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function displayWeatherData(data) {
  const {
    name,
    main: { temp, humidity },
    weather: [{ description }],
  } = data;

  const emojisDescription = {
    "clear sky": "☀️",
    "few clouds": "🌤️",
    "scattered clouds": "⛅",
    "broken clouds": "🌥️",
    "overcast clouds": "☁️",
    mist: "🌫️",
    smoke: "💨",
    haze: "🌫️",
    dust: "🌪️",
    fog: "🌫️",
    sand: "🏜️",
    ash: "🌋",
    squalls: "🌬️",
    tornado: "🌪️",
    "light rain": "🌦️",
    "moderate rain": "🌧️",
    "heavy intensity rain": "⛈️",
    "shower rain": "🌧️",
    thunderstorm: "⛈️",
    snow: "❄️",
    "light snow": "🌨️",
    "heavy snow": "❄️❄️",
    sleet: "🌧️❄️",
    "rain and snow": "🌨️🌧️",
  };

  saveToLocalStorage(data);

  const cityDisplay = document.createElement("h1");
  cityDisplay.textContent = name;
  cityDisplay.className = "cityDisplay";

  const tempDisplay = document.createElement("p");
  tempDisplay.textContent = `${(temp - 273.15).toFixed(2)}°C`;
  tempDisplay.className = "tempDisplay";

  const humidityDisplay = document.createElement("p");
  humidityDisplay.textContent = `${humidity}%`;
  humidityDisplay.className = "humidityDisplay";

  const descDisplay = document.createElement("p");
  descDisplay.textContent = description;
  descDisplay.className = "descDisplay";

  const weatherEmoji = document.createElement("p");
  weatherEmoji.textContent = emojisDescription[description];
  weatherEmoji.className = "weatherEmoji";

  card.textContent = "";
  card.style.display = "flex";

  card.append(
    cityDisplay,
    tempDisplay,
    humidityDisplay,
    descDisplay,
    weatherEmoji
  );
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.className = "errorDisplay";
  card.textContent = "";
  card.style.display = "flex";
  card.append(errorDisplay);
}
