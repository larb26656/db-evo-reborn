const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

// Custom function to merge two objects
function mergeConfigs(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && source[key] !== null) {
                if (!target[key]) {
                    target[key] = {};
                }
                mergeConfigs(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// Load base config from config.json
const configFilePath = path.join(__dirname, 'config.json');
const baseConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

// Parse command-line arguments
const args = minimist(process.argv.slice(2), {
    alias: {
        profile: 'p'
    }
});
const profile = args.profile || 'default';

// Load profile-specific config if it exists
let profileConfig = {};
if (profile !== 'default') {
    const profileConfigFilePath = path.join(__dirname, `config-${profile}.json`);
    if (fs.existsSync(profileConfigFilePath)) {
        profileConfig = JSON.parse(fs.readFileSync(profileConfigFilePath, 'utf-8'));
    }
}

// Merge base config with profile-specific config
const config = mergeConfigs(baseConfig, profileConfig);

module.exports = config;