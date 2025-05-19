const container = document.getElementById('logs');
const searchInput = document.getElementById('search');
const selectButton = document.getElementById('select-log');

let allLogs = [];

function renderLogs(filteredLogs) {
  container.innerHTML = '';
  filteredLogs.forEach(sql => {
    const pre = document.createElement('pre');
    pre.textContent = sql;
    pre.title = "クリックでコピー";
    pre.addEventListener('click', () => {
      navigator.clipboard.writeText(sql);
    });

    if (/^\s*select/i.test(sql)) pre.classList.add('select');
    if (/^\s*insert/i.test(sql)) pre.classList.add('insert');
    if (/^\s*update/i.test(sql)) pre.classList.add('update');
    if (/^\s*delete/i.test(sql)) pre.classList.add('delete');

    container.prepend(pre);
  });
}

window.api.onSQLLog((sql) => {
  allLogs.push(sql);
  const filtered = filterLogs(searchInput.value);
  renderLogs(filtered);
});

function filterLogs(query) {
  if (!query) return allLogs;
  const q = query.toLowerCase();
  return allLogs.filter(sql => sql.toLowerCase().includes(q));
}

searchInput.addEventListener('input', () => {
  renderLogs(filterLogs(searchInput.value));
});

selectButton.addEventListener('click', async () => {
  const name = await window.api.selectLogFile();
  if (name) {
    selectButton.textContent = `監視中: ${name}`;
    allLogs = [];
    container.innerHTML = '';
  }
});