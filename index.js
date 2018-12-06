const fs = require('fs');

parseLockfile();

function parseLockfile(file) {
    const pkgs = {}; // name -> {version -> [ranges]}

    const content = fs.readFileSync(file || './yarn.lock', 'utf8').toString();
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (!/^\S+.*:$/.test(lines[i])) continue;

        const arr = parseRulesLine(lines[i]);
        const name = arr[0][0];
        const ranges = arr.map((item) => item[1]);
        const version = parseVersionLine(lines[++i]);

        if (!pkgs[name]) {
            pkgs[name] = {};
        }
        if (!pkgs[name][version]) {
            pkgs[name][version] = [];
        }
        pkgs[name][version].push(ranges);
    }

    for (let name in pkgs) {
        const versions = Object.keys(pkgs[name]);
        if (versions.length > 1) {
            const listStr = versions
                .map((v) => `- ${v}: ${pkgs[name][v]}`)
                .join('\n');
            console.log(`${name}: ${versions.length} versions\n${listStr}`);
        }
    }

    console.log('...done!');
}
function parseRulesLine(line) {
    // the last character is colon
    return line.substr(0, line.length - 1).split(', ').map((token) => {
        if (token[0] === '"' && token[token.length - 1] === '"') token = token.substring(1, token.length - 1);

        const index = token.lastIndexOf('@');
        return [token.substr(0, index), token.substr(index + 1)];
    }, {});
}
function parseVersionLine(line) {
    const matches = /  version "([^"]+)"/.exec(line);
    return matches && matches[1];
}
