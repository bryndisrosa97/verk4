export async function fetchEarthquakes(type, period) {
  let result;
  const url = new URL(`/proxy?period=${period}&type=${type}`, window.location).href;

  try {
    result = await fetch(url);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();
  return data;
}
