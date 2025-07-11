const WEATHER_API_URL = 'https://software-engineering-school-5-0-kvachikk.onrender.com/weather/current';
const WEATHER_FORECAST_API_URL = 'https://software-engineering-school-5-0-kvachikk.onrender.com/weather/forecast';

const SUBSCRIBE_API_URL = 'https://software-engineering-school-5-0-kvachikk.onrender.com/subscribe';

const IP_GEOLOCATION_API_URL = 'https://ipapi.co/json/';

const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const searchWeatherResultCardWrapper = document.getElementById('searchWeatherResultCardWrapper');
const searchWeatherMessageDiv = document.getElementById('searchWeatherMessage');
const subscriptionForm = document.getElementById('subscriptionForm');
const subscribeBtn = document.getElementById('subscribeBtn');
const subscriptionMessageDiv = document.getElementById('subscriptionMessage');
const keyCitiesGrid = document.getElementById('keyCitiesGrid');
const keyCitiesMessageDiv = document.getElementById('keyCitiesMessage');
const DEMO_CITIES = ['Kyiv', 'Kharkiv', 'Dnipro', 'Odesa', 'Lviv'];
const cityForecastInput = document.getElementById('cityForecastInput');
const getForecastBtn = document.getElementById('getForecastBtn');
const forecastWeatherResultWrapper = document.getElementById('forecastWeatherResultWrapper');
const forecastWeatherMessageDiv = document.getElementById('forecastWeatherMessage');

function showMessage(e, t, r = 'info') {
   e.innerHTML = t;
   e.className = 'message-box';
   'success' === r
      ? e.classList.add('message-success')
      : 'error' === r
        ? e.classList.add('message-error')
        : 'loading' === r && e.classList.add('message-loading');
   e.style.display = 'block';
}

function hideMessage(e) {
   e.style.display = 'none';
   e.innerHTML = '';
}

function createWeatherCardHTML(e, t) {
   return !t || void 0 === t.temperature
      ? `<div class="weather-card-item p-6 text-center"><h3 class="text-xl font-semibold mb-2">${e.charAt(0).toUpperCase() + e.slice(1)}</h3><p class="text-red-500">Could not load weather data.</p></div>`
      : `
                <div class="weather-card-item p-4 md:p-5 transform transition-transform duration-300">
                    <h3 class="text-xl lg:text-2xl font-bold mb-2">${e.charAt(0).toUpperCase() + e.slice(1)}</h3>
                    <div class="my-3 md:my-4">
                        <p class="text-4xl lg:text-5xl font-bold">${t.temperature?.toFixed(1)}°C</p>
                        <p class="text-md lg:text-lg text-blue-500 capitalize">${t.description || 'N/A'}</p>
                    </div>
                    <div class="text-sm md:text-md">
                        <p>Humidity: ${t.humidity || 'N/A'}%</p>
                    </div>
                </div>
            `;
}

function createForecastCardHTML(e, t) {
   if (!t || 0 === t.length)
      return `<div class="weather-card-item p-6 text-center"><h3 class="text-xl font-semibold mb-2">${e.charAt(0).toUpperCase() + e.slice(1)} - Forecast</h3><p class="text-red-500">Could not load forecast data.</p></div>`;
   const r = t
      .map((t, r) => {
         let l = '';
         if (0 === r) l = 'Today';
         else if (1 === r) l = 'Tomorrow';
         else {
            const d = new Date();
            d.setDate(d.getDate() + r);
            l = d.toLocaleDateString(void 0, { weekday: 'short', day: 'numeric', month: 'short' });
         }
         return `\n                            <div class="weather-card-item p-4 md:p-5 flex flex-col items-center justify-center space-y-1">\n                                <h4 class="text-md font-semibold">${l}</h4>\n                                <p class="text-3xl font-bold">${t.temperature?.toFixed(1)}°C</p>\n                                <p class="text-sm text-blue-500 capitalize">${t.description || 'N/A'}</p>\n                                <p class="text-sm">Humidity: ${t.humidity || 'N/A'}%</p>\n                            </div>`;
      })
      .join('');
   return `\n                    <div class="p-4 md:p-5">\n                        <h3 class="text-xl lg:text-2xl font-bold mb-4">${e.charAt(0).toUpperCase() + e.slice(1)} - 4-Day Forecast</h3>\n                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">${r}</div>\n                    </div>`;
}

async function fetchAndDisplayWeather(e, t, r, s = !1) {
   r && showMessage(r, `Loading weather for ${e}...`, 'loading');
   let a;
   'keyCitiesGrid' === t.id
      ? ((a = document.createElement('div')),
        s && a.classList.add('my-location-highlight'),
        a.classList.add('weather-card-wrapper'),
        s ? keyCitiesGrid.prepend(a) : keyCitiesGrid.appendChild(a))
      : ((a = t), (a.innerHTML = ''));
   try {
      const t = await fetch(`${WEATHER_API_URL}?city=${encodeURIComponent(e)}`),
         s = await t.json();
      r && hideMessage(r),
         (a.innerHTML = createWeatherCardHTML(e, t.ok ? s : null)),
         setTimeout(() => a.classList.add('visible'), 50);
   } catch (t) {
      r && showMessage(r, `Network error fetching weather for ${e}.`, 'error'),
         (a.innerHTML = createWeatherCardHTML(e, null)),
         setTimeout(() => a.classList.add('visible'), 50);
   }
}

async function fetchAndDisplayForecast(e, t, r) {
   r && showMessage(r, `Loading forecast for ${e}...`, 'loading'), (t.innerHTML = '');
   try {
      const s = await fetch(`${WEATHER_FORECAST_API_URL}?city=${encodeURIComponent(e)}`),
         a = await s.json();
      r && hideMessage(r),
         (t.innerHTML = createForecastCardHTML(e, s.ok ? a : null)),
         setTimeout(() => t.classList.add('visible'), 50);
   } catch (s) {
      r && showMessage(r, `Network error fetching forecast for ${e}.`, 'error'),
         (t.innerHTML = createForecastCardHTML(e, null)),
         setTimeout(() => t.classList.add('visible'), 50);
   }
}

getWeatherBtn.addEventListener('click', () => {
   const e = cityInput.value.trim();
   return e
      ? void fetchAndDisplayWeather(e, searchWeatherResultCardWrapper, searchWeatherMessageDiv)
      : (showMessage(searchWeatherMessageDiv, 'Please enter a city name.', 'error'),
        searchWeatherResultCardWrapper.classList.remove('visible'),
        void (searchWeatherResultCardWrapper.innerHTML = ''));
});

subscriptionForm.addEventListener('submit', async (e) => {
   e.preventDefault();
   const t = subscriptionForm.email.value.trim(),
      r = subscriptionForm.city.value.trim(),
      s = subscriptionForm.frequency.value;
   if (!t || !r) return void showMessage(subscriptionMessageDiv, 'Please fill in all fields.', 'error');
   hideMessage(subscriptionMessageDiv),
      showMessage(subscriptionMessageDiv, 'Processing subscription...', 'loading'),
      (subscribeBtn.disabled = !0);
   const a = new URLSearchParams({ email: t, city: r, frequency: s });
   try {
      const e = await fetch(SUBSCRIBE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: a.toString(),
         }),
         t = await e.json();
      if (200 === e.status || 201 === e.status)
         showMessage(
            subscriptionMessageDiv,
            t.message || 'Subscription successful. Confirmation email sent.',
            'success',
         ),
            subscriptionForm.reset();
      else {
         let r = `Error ${e.status}: `;
         r +=
            t.errors && Array.isArray(t.errors)
               ? t.errors.map((e) => e.msg).join(', ')
               : t.message || 'Failed to subscribe.';
         showMessage(subscriptionMessageDiv, r, 'error');
      }
   } catch (e) {
      showMessage(subscriptionMessageDiv, 'Network error during subscription. Please try again.', 'error');
   } finally {
      subscribeBtn.disabled = !1;
   }
});

getForecastBtn.addEventListener('click', () => {
   const e = cityForecastInput.value.trim();
   return e
      ? void fetchAndDisplayForecast(e, forecastWeatherResultWrapper, forecastWeatherMessageDiv)
      : (showMessage(forecastWeatherMessageDiv, 'Please enter a city name.', 'error'),
        forecastWeatherResultWrapper.classList.remove('visible'),
        void (forecastWeatherResultWrapper.innerHTML = ''));
});

async function initializePage() {
   showMessage(keyCitiesMessageDiv, 'Detecting location and loading key cities...', 'loading');
   let e = null;
   try {
      const t = await fetch(IP_GEOLOCATION_API_URL);
      if (t.ok) {
         const r = await t.json();
         r.city && (e = r.city);
      }
   } catch (e) {
      console.warn('Could not fetch user location via IP:', e);
   }
   if (e) await fetchAndDisplayWeather(e, keyCitiesGrid, keyCitiesMessageDiv, !0);
   else {
      const e = document.createElement('div');
      e.classList.add('my-location-highlight', 'weather-card-wrapper', 'visible'),
         (e.innerHTML = createWeatherCardHTML('My Location', null).replace(
            'Could not load weather data.',
            'Location not found. Search manually.',
         )),
         keyCitiesGrid.prepend(e);
   }
   const t = DEMO_CITIES.map((e) => fetchAndDisplayWeather(e, keyCitiesGrid, null, !1));
   await Promise.allSettled(t), hideMessage(keyCitiesMessageDiv);
}

document.addEventListener('DOMContentLoaded', initializePage);
