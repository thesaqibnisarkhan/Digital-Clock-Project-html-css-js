let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// ⏰ CLOCK (ONLY 24H FORMAT)
function updateClock() {

  let now = new Date();

  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();

  document.getElementById("time").innerText =
    `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  document.getElementById("day").innerText = days[now.getDay()];
  document.getElementById("date").innerText = now.toLocaleDateString();
}

setInterval(updateClock, 1000);
updateClock();


// 🌍 CITY SEARCH + WEATHER
async function getCityData() {

  let city = document.getElementById("cityInput").value;

  if (city === "") {
    city = "Karachi";
  }

  try {
    document.getElementById("msg").innerText = "Loading...";

    let geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    let geoData = await geo.json();

    if (!geoData.results) {
      document.getElementById("msg").innerText = "City not found!";
      return;
    }

    let dataCity = geoData.results[0];
    let lat = dataCity.latitude;
    let lon = dataCity.longitude;
    let name = dataCity.name;
    let timezone = dataCity.timezone;

    // WEATHER
    let weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    let wdata = await weather.json();

    document.getElementById("temp").innerText =
      wdata.current_weather.temperature;

    document.getElementById("city").innerText = name;

    currentTimezone = timezone;

    document.getElementById("msg").innerText = "";

  } catch (err) {
    document.getElementById("msg").innerText = "Error loading data!";
  }
}


// ⏰ UPDATE TIME (CITY TIME ZONE)
setInterval(() => {

  let now = new Date();

  let time = new Intl.DateTimeFormat("en-US", {
    timeZone: currentTimezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  document.getElementById("time").innerText = time;

}, 1000);