# Overview

This project is a CLI tool designed to generate Liquibase change logs. It is a Node.js-based project that helps in managing and versioning database schema changes.

# Key Features

- **Database Configuration**: The tool connects to a PostgreSQL database using the provided configuration details.
- **Change Log Generation**: It generates Liquibase change logs based on the database schema.
- **Environment Specific Scripts**: Supports different scripts for initializing the database schema on different operating systems (default and Unix).

# Prerequisites

- **Java**: Ensure that Java is installed on your system.
- **Gradle**: The tool uses Gradle for running scripts.
- **Liquibase**: Ensure that Liquibase CLI is installed on your system.

# Configuration

The configuration for the tool is specified in a `config.json` file. Below is an example configuration:

```json
{
  "database": {
    "url": "jdbc:postgresql://localhost:5432/db_name",
    "username": "root",
    "password": "root",
    "referenceUrl": "jdbc:postgresql://localhost:5432/db_name",
    "referenceUsername": "root",
    "referencePassword": "root"
  },
  "changeLogCreator": {
    "initDiffDbScript": {
      "default": "gradlew test --rerun --tests com.test.ci.GenerateDatabaseForDiffCI",
      "unix": "./gradlew test --rerun --tests com.test.ci.GenerateDatabaseForDiffCI"
    },
    "changelogBasePath": "src/main/resources/db/changelogs",
    "outputCreateChangelogBasePath": "src/main/resources/db/changelogs",
    "outputGenerateDiffChangelogFilePath": "src/main/resources/db/changelogs",
    "changelogForExecForDiffDb": {
      "includes": ["*.p.xml"],
      "excludes": []
    }
  }
}
```

# Usage

1. **Setup**: Ensure that the config.json file is properly configured with your database details.
2. **Run the Tool**: Use the provided CLI commands to generate the Liquibase change logs.

# Build

To build the project, use the following command:

```sh
npm run build
```

> **Note:** After running the build command, the build artifacts will be available in the build directory.
