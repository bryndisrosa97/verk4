import { fetchEarthquakes } from './lib/earthquakes';
import { el, element, formatDate } from './lib/utils';
import { init, createPopup, clearMarkers } from './lib/map';

const loading = document.querySelector('.loading');
const nav = document.querySelector('.nav');
const list = nav.querySelectorAll('.list');

function clearingbabies() {
  const h1 = document.querySelector('h1');
  const earthquakes = document.querySelector('.earthquakes');
  const error = document.querySelector('.error');
  const cache = document.querySelector('.cache');

  while (earthquakes.firstChild) {
    earthquakes.removeChild(earthquakes.firstChild);
  }

  while (h1.firstChild) {
    h1.removeChild(h1.firstChild);
  }
  while (cache.firstChild) {
    cache.removeChild(cache.firstChild);
  }
  clearMarkers();

  if (error) {
    error.parent.removeChild(error);
  }
}

function timetocache(earthquakes, fyrirsogn) {
  const h1 = document.querySelector('h1');
  const caching = document.querySelector('.cache');
  const isCached = earthquakes.info.cached ? '' : 'not';
  h1.append(fyrirsogn);
  caching.append(`Data has ${isCached} been cached. Request took ${earthquakes.info.time} seconds.`);
}

function constearth(query) {
  const type = query.has('type') ? query.get('type') : 'all';
  const period = query.has('period') ? query.get('period') : 'hour';
  return { type, period };
}

function Listi(earthquakes, fyrirsogn) {
  const ul = document.querySelector('.earthquakes');
  timetocache(earthquakes, fyrirsogn);

  earthquakes.data.features.forEach((quake) => {
    const {
      title, mag, time, url,
    } = quake.properties;

    const linkur = element('a', { href: url, target: '_blank' }, null, 'Skoða nánar');

    const markerContent = el('div',
      el('h3', title),
      el('p', formatDate(time)),
      el('p', linkur));

    const marker = createPopup(quake.geometry, markerContent.outerHTML);

    const onClick = () => {
      marker.openPopup();
    };

    const li = el('li');

    li.appendChild(
      el('div',
        el('h2', title),
        el('dl',
          el('dt', 'Tími'),
          el('dd', formatDate(time)),
          el('dt', 'Styrkur'),
          el('dd', `${mag} á richter`),
          el('dt', 'Nánar'),
          el('dd', url.toString())),
        element('div', { class: 'buttons' }, null,
          element('button', null, { click: onClick }, 'Sjá á korti'),
          linkur)),
    );

    ul.appendChild(li);
  });
}

async function update() {
  list.forEach((li) => {
    const alink = li.querySelectorAll('a');
    const h2 = li.querySelector('h2');

    alink.forEach((a) => {
      a.addEventListener('click', async (event) => {
        event.preventDefault();
        clearingbabies();
        if (loading.classList.contains('hidden')) {
          loading.classList.toggle('hidden');
        }
        const url = new URL(event.target.href);
        const query = url.searchParams;

        const { type, period } = constearth(query);
        const earthquakes = await fetchEarthquakes(type, period);

        if (!loading.classList.contains('hidden')) {
          loading.classList.add('hidden');
        }
        const parent = loading.parentNode;

        if (earthquakes) {
          const fyrirsognin = h2.textContent.toLocaleLowerCase();
          Listi(earthquakes, `${event.target.innerText}, ${fyrirsognin}`);
        }

        if (!earthquakes) {
          parent.appendChild(el('p', { class: 'error' }, 'Villa við að sækja gögn'));
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const map = document.querySelector('.map');
  init(map);
  if (loading.classList.contains('hidden')) {
    loading.classList.toggle('hidden');
  }
  const earthquakes = await fetchEarthquakes('all', 'hour');
  await update();
  if (!loading.classList.contains('hidden')) {
    loading.classList.add('hidden');
  }
  Listi(earthquakes, 'Allir jarðskjálftar á seinustu klukkustund');
});
