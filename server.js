const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;
const ROOT = __dirname;
const IMG_DIR = path.join(ROOT, 'img');

function listSets() {
  const result = { cause: [], effect: [] };
  try {
    const entries = fs.readdirSync(IMG_DIR, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      const mCause = e.name.match(/^cause_(\d+)\.(png)$/i);
      const mEffect = e.name.match(/^effect_(\d+)\.(png)$/i);
      if (mCause) {
        result.cause.push(Number(mCause[1]));
      } else if (mEffect) {
        result.effect.push(Number(mEffect[1]));
      }
    }
    // Deduplicate and sort
    result.cause = Array.from(new Set(result.cause)).sort((a, b) => a - b);
    result.effect = Array.from(new Set(result.effect)).sort((a, b) => a - b);
  } catch (err) {
    // If img dir is missing, return empty arrays
    console.error('Error listing sets:', err.message);
  }
  return result;
}

app.get('/api/sets', (req, res) => {
  res.json(listSets());
});

// Serve static assets (index.html, app.js, styles.css, img/*)
app.use(express.static(ROOT));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
