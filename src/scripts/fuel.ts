type FuelData = {
  id: number;
  date: string;
  amount: number;
  cost: number;
  odometer: number;
  kmDiff?: number | '-';
  efficiency?: string;
}[];
let fuelData: FuelData = JSON.parse(localStorage.getItem('fuelData') as string) || [];
let filteredData: FuelData;
let sortByDate = true;
function testData(): void {
  fuelData = [
    { id: 0, date: '2024-01-15', amount: 40.5, cost: 20000, odometer: 15000 },
    { id: 1, date: '2024-02-10', amount: 42.0, cost: 21000, odometer: 15450 },
    { id: 2, date: '2024-03-05', amount: 38.7, cost: 19500, odometer: 15900 },
    { id: 3, date: '2024-03-30', amount: 43.2, cost: 21500, odometer: 16400 },
    { id: 4, date: '2024-04-20', amount: 40.0, cost: 20000, odometer: 16900 },
    { id: 5, date: '2024-05-15', amount: 45.0, cost: 22500, odometer: 17450 },
    { id: 6, date: '2024-06-10', amount: 41.8, cost: 20900, odometer: 18000 },
    { id: 7, date: '2024-07-05', amount: 39.5, cost: 19750, odometer: 18550 },
    { id: 8, date: '2024-08-01', amount: 44.0, cost: 22000, odometer: 19100 },
    { id: 9, date: '2024-08-25', amount: 42.5, cost: 21250, odometer: 19650 },
    { id: 10, date: '2024-09-18', amount: 39.0, cost: 19500, odometer: 20200 },
    { id: 11, date: '2024-10-10', amount: 40.3, cost: 20150, odometer: 20750 },
  ];
  localStorage.setItem('fuelData', JSON.stringify(fuelData));
  localStorage.setItem('testData', '0');
}
if (localStorage.getItem('testData') === '1') testData();

function getNextId(): number {
  if (fuelData.length === 0) return 0;
  const maxId = Math.max(...fuelData.map((item) => item.id));
  return maxId + 1;
}

function mapFuelData(): void {
  fuelData.map((data, index) => {
    const prev = fuelData[index - 1];
    const kmDiff = prev ? data.odometer - prev.odometer : '-';
    const efficiency = prev ? ((data.amount / Number(kmDiff)) * 100).toFixed(2) : '-';
    data.kmDiff = kmDiff;
    data.efficiency = efficiency;
  });
  filterFuelData();
}

window.onload = function () {
  mapFuelData();
  render();
};

(document.getElementById('fuelForm') as HTMLElement).addEventListener('submit', function (event) {
  event.preventDefault();
  fuelData.push({
    id: getNextId(),
    date: (document.getElementById('date') as HTMLInputElement).value,
    amount: parseFloat((document.getElementById('amount') as HTMLInputElement).value),
    cost: parseFloat((document.getElementById('cost') as HTMLInputElement).value),
    odometer: parseInt((document.getElementById('odometer') as HTMLInputElement).value),
  });
  filteredData = fuelData;
  if (!sortByDate) toggleSortMode();
  save();
  render();
  (document.getElementById('fuelForm') as HTMLFormElement).reset();
});

function sortFuelData(): void {
  if (!sortByDate) {
    const validateEff = (x: string | undefined) => (x !== '-' && x !== undefined ? Number(x) : Number.NEGATIVE_INFINITY);
    filteredData.sort((a, b) => validateEff(b.efficiency) - validateEff(a.efficiency));
  } else filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  updateFuelList();
}

function toggleSortMode(): void {
  if (sortByDate) document.getElementById('sortModeLabel')!.textContent = 'Hatékonyság';
  else document.getElementById('sortModeLabel')!.textContent = 'Dátum';
  sortByDate = !sortByDate;
  sortFuelData();
}

function updateFuelList(data = filteredData): void {
  if (filteredData !== undefined) data = filteredData;
  document.getElementById('fuelList')!.innerHTML = `
    <table class="w-full text-left border-collapse table-auto">
      <thead>
        <tr>
          <th>Dátum</th><th>Mennyiség (L)</th><th>Összeg (Ft)</th><th>Kilométeróra (km)</th><th>Kilométer Különbség (km)</th><th>Hatékonyság (L/100km)</th><th>Törlés</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map((item) => {
            return `
        <tr>
          <td>${item.date}</td>
          <td>${item.amount.toFixed(2)}</td>
          <td>${item.cost.toFixed(2)}</td>
          <td>${item.odometer}</td>
          <td>${item.kmDiff}</td>
          <td>${item.efficiency}</td>
          <td><button class="text-red-700 hover:text-red-900 hover:cursor-pointer" onclick="remove(${item.id})">Törlés</button></td>
        </tr>
        `;
          })
          .join('')}
      </tbody>
    </table>`;
}

function updateMonthlySummary(): void {
  const summary = {} as Record<string, number>;
  filteredData.forEach(({ date, cost }) => {
    const month = date.slice(0, 7);
    if (!summary[month]) summary[month] = 0;
    summary[month] += cost;
  });
  document.getElementById('monthlySummary')!.innerHTML = `
  <ul>${Object.entries(summary as Record<string, number>)
    .map(([month, total]) => `<li class="mb-2">${month}: ${total.toFixed(2)} Ft</li>`)
    .join('')}</ul>`;
}

function filterFuelData(): void {
  const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
  const endDate = (document.getElementById('endDate') as HTMLInputElement).value;
  if (startDate === '' || endDate === '') filteredData = fuelData;
  else {
    filteredData = fuelData.filter(({ date }) => {
      return (!startDate || new Date(date) >= new Date(startDate)) && (!endDate || new Date(date) <= new Date(endDate));
    });
  }
  updateFuelList();
}

function removeFilter(): void {
  filteredData = fuelData;
  render();
}

function remove(id: number) {
  if (!confirm('Biztosan törölni szeretnéd ezt?')) return;
  fuelData = fuelData.filter((item) => item.id !== id);
  sortFuelData();
  save();
  render();
}

function render(): void {
  sortFuelData();
  updateFuelList();
  updateMonthlySummary();
}

function save(): void {
  mapFuelData();
  filterFuelData();
  localStorage.setItem('fuelData', JSON.stringify(fuelData));
}
