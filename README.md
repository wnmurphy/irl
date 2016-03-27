# irl

> Ultra-local, time-limited event sharing. Find immediate experiences nearby. Create experiences for the people around you. Live more of your life.

## Team

  - __Product Owner__: Josh Riesenbach
  - __Scrum Master__: Michelle Thorsell
  - __Development Team Members__: Jisoo Yoon, Calvin Le, Neil Murphy

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Roadmap](#roadmap)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

To install locally:

1. Fork and clone repo.
1. Download and install [Java SDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
1. Download and install the [DynamoDB JAR](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.DynamoDBLocal.html).
1. Run DynamoDB to create a local database.
1. Install 'libvips' `brew install homebrew/science/vips --with-imagemagick --with-webp`
1. Install dependencies.
1. Run `nodemon sesrver/server.js` to start the server.
1. Visit [localhost:8080](localhost:8080).



## Requirements

- Node 5.5.0 (higher versions may break test suite)
- React ^0.14.7
- Express ^4.13.4
- Gulp ^3.9.1
- Python 2.7.x

### For Testing:
- Mocha ^2.4.5
- Chai ^3.5.0

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](https://github.com/hrr12MYLTR/thesis/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
