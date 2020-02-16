describe('get offers', () => {
    const mockOffersRepository = {
        get: id => null,
    };

    const testOffers = {id: 'd9b1d9ff-543e-47c7-895f-87f71dcad91b', brandId: '692126c8-6e72-4ad7-8a73-25fc2f1f56e4', locationsTotal: 0, name: "Super Duper Offer"};

    beforeEach(() => {
        jest.resetAllMocks();
    });

    jest.mock('aws-sdk/clients/dynamodb', () => ({DocumentClient: jest.fn()}));
    jest.mock('../../repositories/offers-repository', () => ({OfferRepository: jest.fn(() => mockOffersRepository)}));


    const {handler} = require('./get');

    it('should return a valid offer', async () => {
        jest.spyOn(mockOffersRepository, 'get').mockImplementation(id => Promise.resolve(testOffers.id === id ? testOffers : null));

        const expectedResponse = {
            statusCode: 200,
            body: JSON.stringify(testOffers)
        };

        const response = await handler({pathParameters: {offerId: "d9b1d9ff-543e-47c7-895f-87f71dcad91b"}});

        expect(response).toEqual(expectedResponse);
        expect(mockOffersRepository.get).toHaveBeenCalledWith("d9b1d9ff-543e-47c7-895f-87f71dcad91b");
    });

    it('should return a 404 when not have an offer', async () => {
        jest.spyOn(mockOffersRepository, 'get').mockImplementation(id => Promise.resolve(testOffers.id === id ? testOffers : null));
        const expectedResponse = {
            statusCode: 404
        };

        const response = await handler({pathParameters: {offerId: "d9b1d9ff-543e-47c7-895f-123123"}});

        expect(response).toEqual(expectedResponse);
        expect(mockOffersRepository.get).toHaveBeenCalledWith("d9b1d9ff-543e-47c7-895f-123123");
    });
});

