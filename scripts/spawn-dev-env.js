const terminalTab = require('terminal-tab');

['start', 'test', 'cosmos'].forEach(cmd => {
  terminalTab.open(`yarn ${cmd}`);
});
