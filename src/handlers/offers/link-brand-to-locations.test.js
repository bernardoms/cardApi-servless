describe('link brand to location', () => {
    const mockOffersRepository = {
        get: id => null,
        getByBrand: id => null,
        put: offer => null
    };

    const mockLocationRepository = {
        get: id => null,
        getByBrand: id => null,
        put: location => null
    };

    const testOffers = {
        id: 'd9b1d9ff-543e-47c7-895f-87f71dcad91b',
        brandId: '692126c8-6e72-4ad7-8a73-25fc2f1f56e4',
        locationsTotal: 0,
        name: "Super Duper Offer"
    };

    const testOffers2 = {
        id: 'd9b1d9ff-543e-47c7-895f-87f71dcad9ca',
        brandId: '692126c8-6e72-4ad7-8a73-25fc2f1f56e2',
        locationsTotal: 0,
        name: "Super Duper Offer2"
    };

    const testLocations = [{
        "id": "03665f6d-27e2-4e69-aa9b-5b39d03e5f59",
        "address": "Address 1",
        "brandId": "692126c8-6e72-4ad7-8a73-25fc2f1f56e4",
        "clo": false
    }, {
        "id": "706ef281-e00f-4288-9a84-973aeb29636e",
        "brandId": "a00461d2-d63e-407c-846c-6055e838cfe8",
        "address": "Address 2",
        "clo": false
    }, {
        "id": "1c7a27de-4bbd-4d63-a5ec-2eae5a0f1870",
        "brandId": "692126c8-6e72-4ad7-8a73-25fc2f1f56e4",
        "address": "Address 3",
        "clo": false
    }];

    const testLocationWithOffers = [{
        "id": "03665f6d-27e2-4e69-aa9b-5b39d03e5f59",
        "offerId": "d9b1d9ff-543e-47c7-895f-87f71dcad91b",
        "address": "Address 1",
        "brandId": "692126c8-6e72-4ad7-8a73-25fc2f1f56e4",
        "clo": false
    }, {
        "id": "706ef281-e00f-4288-9a84-973aeb29636e",
        "brandId": "a00461d2-d63e-407c-846c-6055e838cfe8",
        "address": "Address 2",
        "clo": false
    }, {
        "id": "1c7a27de-4bbd-4d63-a5ec-2eae5a0f1870",
        "offerId": "d9b1d9ff-543e-47c7-895f-87f71dcad91b",
        "brandId": "692126c8-6e72-4ad7-8a73-25fc2f1f56e4",
        "address": "Address 3",
        "clo": false
    }];


    jest.mock('aws-sdk/clients/dynamodb', () => ({DocumentClient: jest.fn()}));

    jest.mock('../../repositories/offers-repository', () => ({OfferRepository: jest.fn(() => mockOffersRepository)}));

    jest.mock('../../repositories/location-repository', () => ({LocationRepository: jest.fn(() => mockLocationRepository)}));


    const {handler} = require('./link-brand-to-location');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should link an offer to all brand location', async () => {
        jest.spyOn(mockOffersRepository, 'getByBrand').mockImplementation(brandId => Promise.resolve(testOffers.brandId === brandId ? testOffers : null));
        jest.spyOn(mockLocationRepository, 'getByBrand').mockImplementation(brandId => Promise.resolve(testLocations.filter(loc => loc.brandId === brandId).length > 0 ? testLocations.filter(loc => loc.brandId === brandId) : null));
        jest.spyOn(mockOffersRepository, 'put').mockImplementation(data => Promise.resolve(data));
        jest.spyOn(mockLocationRepository, 'put').mockImplementation(data => Promise.resolve(data));

        const expectedResponse = {
            statusCode: 200,
        };

        const updatedOffer = {
            id: 'd9b1d9ff-543e-47c7-895f-87f71dcad91b',
            brandId: '692126c8-6e72-4ad7-8a73-25fc2f1f56e4',
            locationsTotal: 2,
            name: "Super Duper Offer"
        };

        const updatedLocation = {
            id: '03665f6d-27e2-4e69-aa9b-5b39d03e5f59',
            brandId: '692126c8-6e72-4ad7-8a73-25fc2f1f56e4',
            address: "Address 1",
            clo: false,
            offerId: "d9b1d9ff-543e-47c7-895f-87f71dcad91b"
        };
        const updatedLocation2 = {
            id: '1c7a27de-4bbd-4d63-a5ec-2eae5a0f1870',
            brandId: '692126c8-6e72-4ad7-8a73-25fc2f1f56e4',
            address: "Address 3",
            clo: false,
            offerId: "d9b1d9ff-543e-47c7-895f-87f71dcad91b"
        };

        const response = await handler({pathParameters: {brandId: "692126c8-6e72-4ad7-8a73-25fc2f1f56e4"}});

        expect(response).toEqual(expectedResponse);

        expect(mockOffersRepository.getByBrand).toHaveBeenCalledWith("692126c8-6e72-4ad7-8a73-25fc2f1f56e4");
        expect(mockOffersRepository.put).toHaveBeenCalledWith(updatedOffer);

        expect(mockLocationRepository.getByBrand).toHaveBeenCalledWith("692126c8-6e72-4ad7-8a73-25fc2f1f56e4");
        expect(mockLocationRepository.put).toBeCalledTimes(2);
        expect(mockLocationRepository.put).toHaveBeenCalledWith(updatedLocation);
        expect(mockLocationRepository.put).toHaveBeenCalledWith(updatedLocation2);
    });

    it('should return a 404 when not find an offer with passed brand id', async () => {
        jest.spyOn(mockOffersRepository, 'getByBrand').mockImplementation(brandId => Promise.resolve(testOffers.brandId === brandId ? testOffers : null));
        const expectedResponse = {
            statusCode: 404
        };

        const response = await handler({pathParameters: {brandId: "d9b1d9ff-543e-47c7-895f-123123"}});

        expect(response).toEqual(expectedResponse);
        expect(mockOffersRepository.getByBrand).toHaveBeenCalledWith("d9b1d9ff-543e-47c7-895f-123123");
    });

    it('should return 404 when has an offer with a brand but not a location', async () => {
        jest.spyOn(mockOffersRepository, 'getByBrand').mockImplementation(brandId => Promise.resolve(testOffers2.brandId === brandId ? testOffers2 : null));
        jest.spyOn(mockLocationRepository, 'getByBrand').mockImplementation(brandId => Promise.resolve(testLocations.filter(loc => loc.brandId === brandId).length > 0 ? testLocations.filter(loc => loc.brandId === brandId) : null));

        const expectedResponse = {
            statusCode: 404,
        };


        const response = await handler({
            pathParameters: {
                brandId: "692126c8-6e72-4ad7-8a73-25fc2f1f56e2",
                locationId: "123"
            }
        });

        expect(response).toEqual(expectedResponse);
        expect(mockOffersRepository.getByBrand).toHaveBeenCalledWith("692126c8-6e72-4ad7-8a73-25fc2f1f56e2");
    });

    it('should not link an offer to brand location, because all offer are already linked to an location.', async () => {
        jest.spyOn(mockOffersRepository, 'getByBrand').mockImplementation(brandId => Promise.resolve(testOffers.brandId === brandId ? testOffers : null));
        jest.spyOn(mockLocationRepository, 'getByBrand').mockImplementation(brandId => Promise.resolve(testLocationWithOffers.filter(loc => loc.brandId === brandId).length > 0 ? testLocationWithOffers.filter(loc => loc.brandId === brandId) : null));
        jest.spyOn(mockOffersRepository, 'put').mockImplementation(data => Promise.resolve(data));
        jest.spyOn(mockLocationRepository, 'put').mockImplementation(data => Promise.resolve(data));

        const expectedResponse = {
            statusCode: "422",
            body: "{\"error\":\"all brand for this location already have an offer linked!\"}",
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response = await handler({pathParameters: {brandId: "692126c8-6e72-4ad7-8a73-25fc2f1f56e4"}});

        expect(response).toEqual(expectedResponse);

        expect(mockOffersRepository.getByBrand).toHaveBeenCalledWith("692126c8-6e72-4ad7-8a73-25fc2f1f56e4");
        expect(mockOffersRepository.put).toBeCalledTimes(0);
        expect(mockLocationRepository.put).toBeCalledTimes(0);

        expect(mockLocationRepository.getByBrand).toHaveBeenCalledWith("692126c8-6e72-4ad7-8a73-25fc2f1f56e4");
    });
});

