describe('add location', () => {
    const mockOffersRepository = {
        get: id => null,
        put: offer => null
    };

    const mockLocationRepository = {
        get: id => null,
    };

    const testOffers = {id: 'd9b1d9ff-543e-47c7-895f-87f71dcad91b', brandId: '692126c8-6e72-4ad7-8a73-25fc2f1f56e4', locationsTotal: 0, name: "Super Duper Offer"};

    const testLocations = [{
        "id": "03665f6d-27e2-4e69-aa9b-5b39d03e5f59",
        "address": "Address 1",
        "clo": false
    }, {
        "id": "706ef281-e00f-4288-9a84-973aeb29636e",
        "address": "Address 2",
        "clo": false
    }, {
        "id": "1c7a27de-4bbd-4d63-a5ec-2eae5a0f1870",
        "address": "Address 3",
        "clo": false
    }];


    jest.mock('aws-sdk/clients/dynamodb', () => ({DocumentClient: jest.fn()}));
    jest.mock('../../repositories/offers-repository', () => ({OfferRepository: jest.fn(() => mockOffersRepository)}));
    jest.mock('../../repositories/location-repository', () => ({LocationRepository: jest.fn(() => mockLocationRepository)}));


    const {handler} = require('./add-location');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should link a location to an offer', async () => {
        jest.spyOn(mockOffersRepository, 'get').mockImplementation(id => Promise.resolve(testOffers.id === id ? testOffers : null));
        jest.spyOn(mockLocationRepository, 'get').mockImplementation(id => Promise.resolve(testLocations.filter(loc=> loc.id === id).length > 0 ? testLocations.filter(loc=> loc.id === id) : null));
        jest.spyOn(mockOffersRepository, 'put').mockImplementation(data => Promise.resolve(data));

        const expectedResponse = {
            statusCode: 200,
        };

        const updatedOffer =  {id: 'd9b1d9ff-543e-47c7-895f-87f71dcad91b', brandId: '692126c8-6e72-4ad7-8a73-25fc2f1f56e4', locationsTotal: 1, name: "Super Duper Offer"};

        const response = await handler({pathParameters: {offerId: "d9b1d9ff-543e-47c7-895f-87f71dcad91b", locationId: "03665f6d-27e2-4e69-aa9b-5b39d03e5f59"}});

        expect(response).toEqual(expectedResponse);
        expect(mockOffersRepository.get).toHaveBeenCalledWith("d9b1d9ff-543e-47c7-895f-87f71dcad91b");
        expect(mockOffersRepository.put).toHaveBeenCalledWith(updatedOffer);
    });

    it('should return a 404 when not find an offer', async () => {
        jest.spyOn(mockOffersRepository, 'get').mockImplementation(id => Promise.resolve(testOffers.id === id ? testOffers : null));
        const expectedResponse = {
            statusCode: 404
        };

        const response = await handler({pathParameters: {offerId: "d9b1d9ff-543e-47c7-895f-123123"}});

        expect(response).toEqual(expectedResponse);
        expect(mockOffersRepository.get).toHaveBeenCalledWith("d9b1d9ff-543e-47c7-895f-123123");
    });

    it('should return 404 when has an offer but not a location', async () => {
        jest.spyOn(mockOffersRepository, 'get').mockImplementation(id => Promise.resolve(testOffers.id === id ? testOffers : null));
        jest.spyOn(mockLocationRepository, 'get').mockImplementation(id => Promise.resolve(testLocations.filter(loc=> loc.id === id).length > 0 ? testLocations.filter(loc=> loc.id === id) : null));
        jest.spyOn(mockOffersRepository, 'put').mockImplementation(data => Promise.resolve(data));

        const expectedResponse = {
            statusCode: 404,
        };


        const response = await handler({pathParameters: {offerId: "d9b1d9ff-543e-47c7-895f-87f71dcad91b", locationId: "123"}});

        expect(response).toEqual(expectedResponse);
        expect(mockOffersRepository.get).toHaveBeenCalledWith("d9b1d9ff-543e-47c7-895f-87f71dcad91b");
    });
});

