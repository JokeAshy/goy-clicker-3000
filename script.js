const state = {
  score: 0,
  perClick: 1,
  perSecond: 0,
  easterEggShown: false,
};

const upgrades = [
  {
    id: 1,
    name: 'Auto Clicker',
    description: '+1 Goy / sec',
    type: 'sps',
    amount: 1,
    baseCost: 15,
    costMultiplier: 1.35,
  },
  {
    id: 2,
    name: 'Double Tap',
    description: '+1 Goy / click',
    type: 'spc',
    amount: 1,
    baseCost: 50,
    costMultiplier: 1.45,
  },
  {
    id: 3,
    name: 'Super Generator',
    description: '+10 Goys / sec',
    type: 'sps',
    amount: 10,
    baseCost: 200,
    costMultiplier: 1.6,
  },
];

const upgradeCounts = { 1: 0, 2: 0, 3: 0 };
const clickTimestamps = [];

function formatNumber(value) {
  return Math.floor(value).toLocaleString();
}

function updateCps() {
  const now = performance.now();
  while (clickTimestamps.length && clickTimestamps[0] <= now - 1000) {
    clickTimestamps.shift();
  }
  document.getElementById('cps-display').textContent = String(clickTimestamps.length);
}

function showClickFeedback(message) {
  const feedback = document.getElementById('click-feedback');
  feedback.textContent = message;
  feedback.classList.remove('show');
  void feedback.offsetWidth;
  feedback.classList.add('show');
}

function getUpgradeCost(upgradeId) {
  const upgrade = upgrades.find((item) => item.id === upgradeId);
  const level = upgradeCounts[upgradeId];
  return Math.ceil(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
}

function updateUi() {
  const scoreDisplay = document.getElementById('score-display');
  const spsDisplay = document.getElementById('sps-display');
  const spcDisplay = document.getElementById('spc-display');

  scoreDisplay.textContent = formatNumber(state.score);
  spsDisplay.textContent = formatNumber(state.perSecond);
  spcDisplay.textContent = formatNumber(state.perClick);

  if (state.score >= 666 && !state.easterEggShown) {
    state.easterEggShown = true;
    const notification = document.getElementById('easter-egg-notification');
    notification.textContent = 'Number of the beast! You reached 666 Goys! Benjamin Netanyahu is proud of you!';
    notification.classList.add('visible');
  }

  upgrades.forEach((upgrade) => {
    const costEl = document.getElementById(`cost-${upgrade.id}`);
    const countEl = document.getElementById(`count-${upgrade.id}`);
    const buttonEl = document.getElementById(`upgrade-${upgrade.id}`);
    const cost = getUpgradeCost(upgrade.id);

    costEl.textContent = formatNumber(cost);
    countEl.textContent = upgradeCounts[upgrade.id];
    buttonEl.disabled = state.score < cost;
    buttonEl.setAttribute('aria-label', `${upgrade.name}: ${upgrade.description}, costs ${cost} goys`);
  });
}

function buyUpgrade(upgradeId) {
  const upgrade = upgrades.find((item) => item.id === upgradeId);
  const cost = getUpgradeCost(upgradeId);

  if (state.score < cost) {
    return;
  }

  state.score -= cost;
  upgradeCounts[upgradeId] += 1;

  if (upgrade.type === 'sps') {
    state.perSecond += upgrade.amount;
  } else if (upgrade.type === 'spc') {
    state.perClick += upgrade.amount;
  }

  updateUi();
}

document.getElementById('main-clicker').addEventListener('click', () => {
  clickTimestamps.push(performance.now());
  updateCps();
  state.score += state.perClick;
  showClickFeedback(`+${formatNumber(state.perClick)} goyslop`);
  updateUi();
});

upgrades.forEach((upgrade) => {
  document.getElementById(`upgrade-${upgrade.id}`).addEventListener('click', () => {
    buyUpgrade(upgrade.id);
  });
});

setInterval(() => {
  state.score += state.perSecond;
  if (upgradeCounts[1] > 0) {
    showClickFeedback(`sending love to israel x${formatNumber(upgradeCounts[1])}`);
  }
  updateUi();
}, 1000);

setInterval(updateCps, 100);
updateUi();
updateCps();
