/* ============================================================
   ROOM TYPE ORACLE — behaviour
   ============================================================ */

const NEIGHBOURHOODS = ["Allerton", "Arden Heights", "Arrochar", "Arverne", "Astoria", "Bath Beach", "Battery Park City", "Bay Ridge", "Bay Terrace", "Bay Terrace, Staten Island", "Baychester", "Bayside", "Bayswater", "Bedford-Stuyvesant", "Belle Harbor", "Bellerose", "Belmont", "Bensonhurst", "Bergen Beach", "Boerum Hill", "Borough Park", "Breezy Point", "Briarwood", "Brighton Beach", "Bronxdale", "Brooklyn Heights", "Brownsville", "Bull's Head", "Bushwick", "Cambria Heights", "Canarsie", "Carroll Gardens", "Castle Hill", "Castleton Corners", "Chelsea", "Chinatown", "City Island", "Civic Center", "Claremont Village", "Clason Point", "Clifton", "Clinton Hill", "Co-op City", "Cobble Hill", "College Point", "Columbia St", "Concord", "Concourse", "Concourse Village", "Coney Island", "Corona", "Crown Heights", "Cypress Hills", "DUMBO", "Ditmars Steinway", "Dongan Hills", "Douglaston", "Downtown Brooklyn", "Dyker Heights", "East Elmhurst", "East Flatbush", "East Harlem", "East Morrisania", "East New York", "East Village", "Eastchester", "Edenwald", "Edgemere", "Elmhurst", "Eltingville", "Emerson Hill", "Far Rockaway", "Fieldston", "Financial District", "Flatbush", "Flatiron District", "Flatlands", "Flushing", "Fordham", "Forest Hills", "Fort Greene", "Fort Hamilton", "Fresh Meadows", "Glendale", "Gowanus", "Gramercy", "Graniteville", "Grant City", "Gravesend", "Great Kills", "Greenpoint", "Greenwich Village", "Grymes Hill", "Harlem", "Hell's Kitchen", "Highbridge", "Hollis", "Holliswood", "Howard Beach", "Howland Hook", "Huguenot", "Hunts Point", "Inwood", "Jackson Heights", "Jamaica", "Jamaica Estates", "Jamaica Hills", "Kensington", "Kew Gardens", "Kew Gardens Hills", "Kingsbridge", "Kips Bay", "Laurelton", "Little Italy", "Little Neck", "Long Island City", "Longwood", "Lower East Side", "Manhattan Beach", "Marble Hill", "Mariners Harbor", "Maspeth", "Melrose", "Middle Village", "Midland Beach", "Midtown", "Midwood", "Mill Basin", "Morningside Heights", "Morris Heights", "Morris Park", "Morrisania", "Mott Haven", "Mount Eden", "Mount Hope", "Murray Hill", "Navy Yard", "Neponsit", "New Brighton", "New Dorp", "New Dorp Beach", "New Springville", "NoHo", "Nolita", "North Riverdale", "Norwood", "Oakwood", "Olinville", "Ozone Park", "Park Slope", "Parkchester", "Pelham Bay", "Pelham Gardens", "Port Morris", "Port Richmond", "Prince's Bay", "Prospect Heights", "Prospect-Lefferts Gardens", "Queens Village", "Randall Manor", "Red Hook", "Rego Park", "Richmond Hill", "Ridgewood", "Riverdale", "Rockaway Beach", "Roosevelt Island", "Rosebank", "Rosedale", "Rossville", "Schuylerville", "Sea Gate", "Sheepshead Bay", "Shore Acres", "Silver Lake", "SoHo", "Soundview", "South Beach", "South Ozone Park", "South Slope", "Springfield Gardens", "Spuyten Duyvil", "St. Albans", "St. George", "Stapleton", "Stuyvesant Town", "Sunnyside", "Sunset Park", "Theater District", "Throgs Neck", "Todt Hill", "Tompkinsville", "Tottenville", "Tremont", "Tribeca", "Two Bridges", "Unionport", "University Heights", "Upper East Side", "Upper West Side", "Van Nest", "Vinegar Hill", "Wakefield", "Washington Heights", "West Brighton", "West Farms", "West Village", "Westchester Square", "Westerleigh", "Whitestone", "Williamsbridge", "Williamsburg", "Willowbrook", "Windsor Terrace", "Woodhaven", "Woodlawn", "Woodside"];

const CLASS_ORDER = ["Entire home/apt", "Private room", "Shared room"];
const BOARD_WIDTH = 17; // widest label "ENTIRE HOME/APT" padded

/* ---------- populate datalist ---------- */
const neighbourhoodList = document.getElementById('neighbourhoodList');
neighbourhoodList.innerHTML = NEIGHBOURHOODS.map(n => `<option value="${n}"></option>`).join('');

/* ---------- range outputs ---------- */
function bindRange(inputId, outId){
  const input = document.getElementById(inputId);
  const out = document.getElementById(outId);
  const update = () => { out.textContent = input.value; };
  input.addEventListener('input', update);
  update();
}
bindRange('minimum_nights', 'minimum_nights_out');
bindRange('availability_365', 'availability_365_out');

/* ---------- borough map highlight ---------- */
const boroughIdMap = {
  'Bronx': 'map-bronx',
  'Brooklyn': 'map-brooklyn',
  'Manhattan': 'map-manhattan',
  'Queens': 'map-queens',
  'Staten Island': 'map-statenisland',
};
const boroughSelect = document.getElementById('neighbourhood_group');
function updateBoroughMap(){
  document.querySelectorAll('.borough-shape').forEach(el => el.classList.remove('active'));
  const id = boroughIdMap[boroughSelect.value];
  if (id){
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }
}
boroughSelect.addEventListener('change', updateBoroughMap);
updateBoroughMap();

/* ---------- console clock ---------- */
const consoleTime = document.getElementById('consoleTime');
function tickClock(){
  const now = new Date();
  consoleTime.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}
tickClock();
setInterval(tickClock, 1000);

/* ---------- flip board (split-flap) ---------- */
const flapBoard = document.getElementById('flapBoard');
const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/ '.split('');

function buildEmptyBoard(){
  flapBoard.innerHTML = '';
  for (let i = 0; i < BOARD_WIDTH; i++){
    const cell = document.createElement('div');
    cell.className = 'flap-cell space';
    cell.textContent = '';
    flapBoard.appendChild(cell);
  }
}
buildEmptyBoard();

function padLabel(label){
  const upper = label.toUpperCase();
  const total = BOARD_WIDTH;
  const padStart = Math.floor((total - upper.length) / 2);
  return upper.padStart(padStart + upper.length, ' ').padEnd(total, ' ');
}

function flipCellTo(cell, finalChar, delay){
  const steps = 3;
  let i = 0;
  const seq = [];
  for (let s = 0; s < steps; s++){
    seq.push(RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]);
  }
  seq.push(finalChar === ' ' ? '' : finalChar);

  setTimeout(() => {
    function playNext(){
      const char = seq[i];
      cell.classList.toggle('space', char === '' || char === undefined);
      cell.animate(
        [
          { transform: 'rotateX(0deg)' },
          { transform: 'rotateX(-90deg)' },
        ],
        { duration: 70, easing: 'ease-in' }
      ).onfinish = () => {
        cell.textContent = char || '';
        cell.animate(
          [
            { transform: 'rotateX(90deg)' },
            { transform: 'rotateX(0deg)' },
          ],
          { duration: 70, easing: 'ease-out' }
        );
      };
      i++;
      if (i < seq.length){
        setTimeout(playNext, 80);
      }
    }
    playNext();
  }, delay);
}

function setBoardText(label){
  const padded = padLabel(label);
  const cells = flapBoard.querySelectorAll('.flap-cell');
  padded.split('').forEach((ch, idx) => {
    flipCellTo(cells[idx], ch, idx * 45);
  });
}

/* ---------- status check ---------- */
const statusDot = document.getElementById('statusDot');
const statusLabel = document.getElementById('statusLabel');
const apiUrlInput = document.getElementById('apiUrl');

function getApiBase(){
  return apiUrlInput.value.trim().replace(/\/+$/, '');
}

async function checkStatus(){
  statusDot.className = 'status-dot checking';
  statusLabel.textContent = 'CONNECTING…';
  try{
    const res = await fetch(getApiBase() + '/', { method: 'GET' });
    if (!res.ok) throw new Error('bad response');
    statusDot.className = 'status-dot online';
    statusLabel.textContent = 'MODEL ONLINE';
  }catch(err){
    statusDot.className = 'status-dot offline';
    statusLabel.textContent = 'API UNREACHABLE';
  }
}
checkStatus();
apiUrlInput.addEventListener('change', checkStatus);

/* ---------- probability bars ---------- */
function animateCount(el, target){
  const start = 0;
  const duration = 800;
  const startTime = performance.now();
  function step(now){
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.round((start + (target - start) * eased) * 10) / 10;
    el.textContent = value.toFixed(1) + '%';
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updateProbabilities(probabilities){
  // probabilities: array in the order of model.classes_ which matches CLASS_ORDER
  const rows = document.querySelectorAll('.prob-row');
  let maxIdx = 0;
  probabilities.forEach((p, i) => { if (p > probabilities[maxIdx]) maxIdx = i; });

  rows.forEach((row, idx) => {
    const pct = (probabilities[idx] || 0) * 100;
    const fill = row.querySelector('.prob-fill');
    const value = row.querySelector('.prob-value');
    fill.style.width = pct.toFixed(1) + '%';
    animateCount(value, pct);
    row.classList.toggle('winner', idx === maxIdx);
  });
}

/* ---------- form submit ---------- */
const form = document.getElementById('predictForm');
const predictBtn = document.getElementById('predictBtn');
const errorMsg = document.getElementById('errorMsg');
const consoleHint = document.getElementById('consoleHint');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const payload = {
    latitude: parseFloat(document.getElementById('latitude').value),
    longitude: parseFloat(document.getElementById('longitude').value),
    price: parseFloat(document.getElementById('price').value),
    minimum_nights: parseInt(document.getElementById('minimum_nights').value, 10),
    number_of_reviews: parseInt(document.getElementById('number_of_reviews').value, 10),
    reviews_per_month: parseFloat(document.getElementById('reviews_per_month').value),
    calculated_host_listings_count: parseInt(document.getElementById('calculated_host_listings_count').value, 10),
    availability_365: parseInt(document.getElementById('availability_365').value, 10),
    neighbourhood_group: document.getElementById('neighbourhood_group').value,
    neighbourhood: document.getElementById('neighbourhood').value.trim(),
  };

  predictBtn.classList.add('loading');
  predictBtn.querySelector('.btn-label').textContent = 'CALLING';
  consoleHint.textContent = 'Reaching the model…';

  try{
    const res = await fetch(getApiBase() + '/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok){
      const detail = await res.text();
      throw new Error(`Server responded ${res.status}: ${detail.slice(0, 200)}`);
    }

    const data = await res.json();
    const predicted = data.Predicted_room_type;
    const probability = data.Probability;

    setBoardText(predicted || 'NO RESULT');
    updateProbabilities(probability || []);

    consoleHint.textContent = `Called at ${new Date().toLocaleTimeString('en-US', { hour12: false })} — ${predicted}.`;
    statusDot.className = 'status-dot online';
    statusLabel.textContent = 'MODEL ONLINE';

  }catch(err){
    console.error(err);
    errorMsg.textContent = `Couldn't reach the model: ${err.message}`;
    setBoardText('ERROR');
    consoleHint.textContent = 'Check the API endpoint and that the FastAPI server is running.';
    statusDot.className = 'status-dot offline';
    statusLabel.textContent = 'API UNREACHABLE';
  }finally{
    predictBtn.classList.remove('loading');
    predictBtn.querySelector('.btn-label').textContent = 'CALL IT';
  }
});
