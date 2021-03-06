require('dotenv/config');

const { OfferRepository } = require('../../repositories/offers-repository');
const { DocumentClient } = require('aws-sdk/clients/dynamodb');

const withProcessEnv = ({ AWS_ENDPOINT, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY }) => () => {
    const options = {
        endpoint: AWS_ENDPOINT,
        region: AWS_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    };

    return new DocumentClient(options);
};

const docClient = withProcessEnv(process.env)();

const repository = new OfferRepository(docClient);

exports.handler = async (event) => {

    const response = {
    };

    const { offerId } = event.pathParameters;
    const offer = await repository.get(offerId);

    if (!offer){
        response.statusCode = 404;
        return response;
    }

    response.body = JSON.stringify(offer);
    response.statusCode = 200;
    return response;
};