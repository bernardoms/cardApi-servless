require('dotenv/config');

const {OfferSeeder} = require( "./offers/offer-seed");
const {LocationSeeder} = require("./locations/location-seed");
const {PublisherSeeder} = require("./publisher/publisher-seed");

const { DynamoDB } = require('aws-sdk');

const {DocumentClient} = DynamoDB;

const offersData = require('./offers-data');
const locationData = require("./locations-data");
const publisherData = require("./publisher-data");

const dynamo = new DynamoDB({
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const doclient = new DocumentClient({service: dynamo});

const offerSeeder = new OfferSeeder(dynamo, doclient);
const locationSeeder = new LocationSeeder(dynamo, doclient);
const publisherSeeder = new PublisherSeeder(dynamo, doclient);

const log = (...mgs) => console.log('>>', ...mgs);

const seedOffers = async () => {
    log(`Checking if 'offers' table exists`);

    const exists = await offerSeeder.hasTable();

    if (exists) {
        log(`Table 'offers' exists, deleting`);
        await offerSeeder.deleteTable();
    }

    log(`Creating 'offers' table`);
    await offerSeeder.createTable();

    log('Seeding data');
    await offerSeeder.seed(offersData);
};

const seedLocation = async () => {
    log(`Checking if 'locations' table exists`);

    const exists = await locationSeeder.hasTable();

    if (exists) {
        log(`Table 'locations' exists, deleting`);
        await locationSeeder.deleteTable();
    }

    log(`Creating 'locations' table`);
    await locationSeeder.createTable();

    log('Seeding data');
    await locationSeeder.seed(locationData);
};

const seedPublisher = async () => {
    log(`Checking if 'publisher' table exists`);

    const exists = await publisherSeeder.hasTable();

    if (exists) {
        log(`Table 'publisher' exists, deleting`);
        await publisherSeeder.deleteTable();
    }

    log(`Creating 'publisher' table`);
    await publisherSeeder.createTable();

    log('Seeding data');
    await publisherSeeder.seed(publisherData);
};

seedOffers()
    .then(() => log('Done!'))
    .catch(err => console.log(err));

seedLocation()
    .then(() => log('Done!'))
    .catch(err => console.log(err));

seedPublisher()
    .then(() => log('Done!'))
    .catch(err => console.log(err));