const infoContainer = document.querySelector("#info");
const flagImg = document.querySelector("#flag");

// Get country code from URL
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

async function fetchCountry(code) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (!res.ok) throw new Error("Country not found");
    const data = await res.json();
    displayCountry(data[0]);
  } catch (err) {
    infoContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function displayCountry(country) {
  flagImg.src = country.flags.svg;
  flagImg.alt = `Flag of ${country.name.common}`;

  const currencies = country.currencies
    ? Object.values(country.currencies).map((c) => c.name).join(", ")
    : "N/A";

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  const borders = country.borders
    ? country.borders
        .map((b) => `<a href="detail.html?code=${b}">${b}</a>`)
        .join(" ")
    : "None";

  infoContainer.innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Official Name:</strong> ${country.name.official}</p>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
    <p><strong>Currencies:</strong> ${currencies}</p>
    <p><strong>Languages:</strong> ${languages}</p>
    <div class="borders"><strong>Borders:</strong> ${borders}</div>
  `;
}

// Fetch details
if (code) {
  fetchCountry(code);
} else {
  infoContainer.innerHTML = "<p style='color:red;'>No country selected.</p>";
}
