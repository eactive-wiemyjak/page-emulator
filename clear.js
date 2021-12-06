const fs = require('fs');

fs.rmSync('public', { recursive: true, force: true });
