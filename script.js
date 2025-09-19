const searchBox = document.querySelector("#search");
const resultsContainer = document.querySelector("#results");
const detailsContainer = document.querySelector("#details");

async function fetchCountries(query = "") {
  try {
    let url = query
      ? `https://restcountries.com/v3.1/name/${query}`
      : "https://restcountries.com/v3.1/all";

    const res = await fetch(url);
    if (!res.ok) throw new Error("No countries found");
    const data = await res.json();

    displayCountries(data);
  } catch (err) {
    resultsContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function displayCountries(countries) {
  resultsContainer.innerHTML = countries
    .map(
      (country) => `
      <div class="card" data-code="${country.cca3}">
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
        <h3>${country.name.common}</h3>
        <p><strong>Region:</strong> ${country.region}</p>
      </div>
    `
    )
    .join("");

  // attach click event to each card
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const code = card.getAttribute("data-code");
      showCountryDetails(code);
    });
  });
}

async function showCountryDetails(code) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    const data = await res.json();
    const country = data[0];

    detailsContainer.style.display = "block";
    detailsContainer.innerHTML = `
      <h2>${country.name.common}</h2>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" style="width:150px; margin:10px 0;">
      <p><strong>Official Name:</strong> ${country.name.official}</p>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
      <p><strong>Region:</strong> ${country.region} (${country.subregion || "N/A"})</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
      <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
      <p><strong>Currencies:</strong> ${country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(", ") : "N/A"}</p>
      <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
      <button onclick="detailsContainer.style.display='none'">Close</button>
    `;
    detailsContainer.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    detailsContainer.innerHTML = `<p style="color:red;">Details not available</p>`;
    detailsContainer.style.display = "block";
  }
}

searchBox.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();
  if (query) {
    fetchCountries(query);
  } else {
    fetchCountries();
  }
});

// Initial load
fetchCountries();
