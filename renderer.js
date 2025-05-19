const { ipcRenderer } = require('electron');
const sqlFormatter = require('sql-formatter');
const hljs = require('highlight.js/lib/core');
const sql = require('highlight.js/lib/languages/sql');
hljs.registerLanguage('sql', sql);

// 要素取得
const openBtn = document.getElementById('open-btn');
const contentDiv = document.getElementById('content');

// ログファイルを選択
openBtn.addEventListener('click', async () => {
  const result = await ipcRenderer.invoke('select-log-file');

  if (result.canceled) return;

  const lines = result.content.split('\n');

  const formattedHTML = lines.map(line => {
    const cleaned = line.replace(/^Executing\s+\(.*?\):\s*/, '');
    if (!cleaned.trim()) return '';

    const formatted = sqlFormatter.format(cleaned, {
      language: 'postgresql',
      indent: '  '
    });

    const highlighted = hljs.highlight(formatted, { language: 'sql' }).value;
    return `<pre><code class="hljs sql">${highlighted}</code></pre>`;
  });

  contentDiv.innerHTML = formattedHTML.join('\n');
});
