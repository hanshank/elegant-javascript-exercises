const SCRIPTS = require('./scripts');

exports.repeat = (n, action) => {
  for (let i = 0; i < n; i++) {
    action(i);
  }
};

exports.characterCount = script =>
  script.ranges.reduce((count, [from, to]) => count + (to - from), 0);

exports.characterScript = code => {
  for (const script of SCRIPTS) {
    if (script.ranges.some(([from, to]) => code >= from && code < to)) {
      return script;
    }
  }
  return null;
};

exports.countBy = (items, groupName) => {
  const counts = [];
  for (const item of items) {
    const name = groupName(item);
    const known = counts.findIndex(c => c.name == name);
    if (known == -1) {
      counts.push({ name, count: 1 });
    } else {
      counts[known].count++;
    }
  }
  return counts;
};

exports.textScripts = text => {
  const scripts = this.countBy(text, char => {
    const script = this.characterScript(char.codePointAt(0));
    return script ? script.name : 'none';
  }).filter(({ name }) => name !== 'none');

  const total = scripts.reduce((n, { count }) => n + count, 0);
  if (total === 0) return 'No scripts found';

  return scripts
    .map(({ name, count }) => `${Math.round((count * 100) / total)}% ${name}`)
    .join(', ');
};
