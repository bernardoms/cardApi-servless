require('dotenv/config');

const {OfferRepository} = require('../../repositories/offers-repository');

const {LocationRepository} = require('../../repositories/location-repository');

const {DocumentClient} = require('aws-sdk/clients/dynamodb');

const withProcessEnv = ({AWS_ENDPOINT, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY}) => () => {
    const options = {
        endpoint: AWS_ENDPOINT,
        region: AWS_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    };

    return new DocumentClient(options);
};


const docClient = withProcessEnv(process.env)();
const offerRepository = new OfferRepository(docClient);
const locationRepository = new LocationRepository(docClient);

exports.handler = async (event) => {
    const response = {};

    const {offerId, locationId} = event.pathParameters;
    const offer = await offerRepository.get(offerId);

    if (!offer) {
        response.statusCode = 404;
        return response;
    }

    const location = await locationRepository.get(locationId);

    if (!location) {
        response.statusCode = 404;
        return response;
    }

    offer.locationsTotal = offer.locationsTotal + 1;

    await offerRepository.put(offer);

    response.statusCode = 200;
    return response;
};