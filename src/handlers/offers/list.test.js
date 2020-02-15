describe('list offers', () => {
    const mockOffersRepository = {
        list: () => [],
    };

    const testOffers = [
        {
            id: 'd9b1d9ff-543e-47c7-895f-87f71dcad91b',
            brandId: '692126c8-6e72-4ad7-8a73-25fc2f1f56e4',
            locationsTotal: 0,
            name: "Super Duper Offer"
        },
    ];

    const mockWithStatusCode = jest.fn();

    jest.mock('aws-sdk/clients/dynamodb', () => ({DocumentClient: jest.fn()}));
    jest.mock('../../repositories/offers-repository', () => ({OfferRepository: jest.fn(() => mockOffersRepository)}));


    const {handler} = require('./list');

    beforeEach(() => {
        jest.resetAllMocks();
        mockWithStatusCode.mockImplementation((data) => ({statusCode: 200, body: JSON.stringify(data)}));
    });

    it('should return a list of offers', async () => {
        jest.spyOn(mockOffersRepository, 'list').mockResolvedValue(testOffers);

        const expectedResponse = {
            statusCode: 200,
            body: JSON.stringify(testOffers)
        };

        const response = await handler({});

        expect(response).toBeDefined();
        expect(response).toEqual(expectedResponse);
        expect(mockOffersRepository.list).toHaveBeenCalled();
    });
});

