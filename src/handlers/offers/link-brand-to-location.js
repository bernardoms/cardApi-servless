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
    let response = {};

    const {brandId} = event.pathParameters;
    const offer = await offerRepository.getByBrand(brandId);

    if (!offer) {
        response.statusCode = 404;
        return response;
    }

    let locations = await locationRepository.getByBrand(brandId);

    if (!locations) {
        response.statusCode = 404;
        return response;
    }

    locations = locations.filter(loc=>!loc.offerId);

    if(locations.length === 0) {
        response = {
            statusCode: '422',
            body: JSON.stringify({ error: 'all brand for this location already have an offer linked!' }),
            headers: {
                'Content-Type': 'application/json',
            }
        };
        return response;
    }

    offer.locationsTotal = offer.locationsTotal + locations.length;

    for (const loc of locations) {
        loc.offerId = offer.id;
        await locationRepository.put(loc);
    }

    await offerRepository.put(offer);


    response.statusCode = 200;
    return response;
};