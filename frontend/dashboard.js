async function fetchJSON(path) {
  const res = await fetch(path);
  return res.json();
}

function secondsToDaysLabel(ms) {
  return ms;
}

async function buildCharts() {
  const energy = await fetchJSON('/api/energy');
  const carbon = await fetchJSON('/api/carbon');
  const water = await fetchJSON('/api/water');
  const waste = await fetchJSON('/api/waste');

  const energyLabels = energy.slice(0, 12).map(r => r.period_date);
  const energyData = energy.slice(0, 12).map(r => r.consumption_kwh);

  const ctxE = document.getElementById('energyChart').getContext('2d');
  new Chart(ctxE, {
    type: 'line',
    data: {
      labels: energyLabels,
      datasets: [{ label: 'Energy (kWh)', data: energyData, borderColor: 'green', tension: 0.3 }]
    }
  });

  const carbonLabels = carbon.slice(0, 12).map(r => r.period_date);
  const carbonData = carbon.slice(0, 12).map(r => r.co2_kg);
  const ctxC = document.getElementById('carbonChart').getContext('2d');
  new Chart(ctxC, { type: 'bar', data: { labels: carbonLabels, datasets: [{ label: 'CO2 (kg)', data: carbonData, backgroundColor: 'rgba(200,50,50,0.6)' }] } });

  const waterLabels = water.slice(0, 12).map(r => r.period_date);
  const waterData = water.slice(0, 12).map(r => r.consumption_liters);
  const ctxW = document.getElementById('waterChart').getContext('2d');
  new Chart(ctxW, { type: 'line', data: { labels: waterLabels, datasets: [{ label: 'Water (L)', data: waterData, borderColor: 'blue' }] } });

  const wasteLabels = waste.slice(0, 12).map(r => r.period_date);
  const wasteData = waste.slice(0, 12).map(r => r.waste_kg);
  const ctxWa = document.getElementById('wasteChart').getContext('2d');
  new Chart(ctxWa, { type: 'bar', data: { labels: wasteLabels, datasets: [{ label: 'Waste (kg)', data: wasteData, backgroundColor: 'orange' }] } });

  // fetch predicted carbon
  const pred = await fetchJSON('/api/carbon/predict');
  const metricsDiv = document.getElementById('metrics');
  metricsDiv.innerHTML = `<h3>Predicted next month CO2: ${pred.prediction} kg</h3>`;
}

buildCharts().catch(err => console.error(err));
