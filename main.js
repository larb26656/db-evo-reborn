const readlineSync = require('readline-sync');
const { createChangelog, generateDiffChangelog } = require('./change-log-creator');
const config = require('./config');

async function bootstrap() {
    while (true) {
        console.log('DB evo reborn v.0.0.1');
        console.log('Database URL:', config.database.url);
        console.log('Reference URL:', config.database.referenceUrl);
        console.log('Select an option:');
        console.log('1. Create changelog');
        console.log('2. Generate diff changelog');
        console.log('3. Exit');

        const choice = readlineSync.question('Enter your choice: ');

        switch (choice) {
            case '1':
                createChangelog(config);
                break;
            case '2':
                await generateDiffChangelog(config);
                break;
            case '3':
                console.log('Exiting...');
                process.exit(0);
            default:
                console.log('Invalid choice.');
        }
    }
}

bootstrap();