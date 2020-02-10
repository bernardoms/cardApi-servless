/**
 * The Offer Repository
 */
class OfferRepository {
    static get _baseParams() {
        return {
            TableName: 'offers'
        };
    }

    /**
     * Contructs a new offer repository
     * @param {AWS.DynamoDB.DocumentClient} documentClient The Document Client
     */
    constructor(documentClient) {
        this._documentClient = documentClient;
    }

    /**
     * Gets a list of offers
     * @returns {Promise<Models.offer[]>} A list of offers
     */
    async list() {
        const params = OfferRepository._createParamObject();
        const response = await this._documentClient.scan(params).promise();

        return response.Items || [];
    }

    /**
     * Gets a offer by id
     * @param {string} id The offer id
     * @returns {Promise<Models.offer>} The offer
     */
    async get(id) {
        const params = OfferRepository._createParamObject({ Key: { id } });
        const response = await this._documentClient.get(params).promise();

        return response.Item;
    }

    async getByBrand(id) {
        const param = {
            IndexName : "offer_brand",
            KeyConditionExpression: "brandId = :v_brand",
            ExpressionAttributeValues: {
                ":v_brand": id
            }
        };

        const params = OfferRepository._createParamObject(param);
        const response = await this._documentClient.query(params).promise();

        return response.Items;
    }

    /**
     * Add or replace a offer
     * @param {Models.offer} offer The offer
     * @returns {Promise<Models.offer>} The offer
     */
    async put(offer) {
        const params = OfferRepository._createParamObject({ Item: offer });
        await this._documentClient.put(params).promise();

        return offer;
    }

    /**
     * Deletes a offer by id
     * @param {string} id The offer id
     * @return {Promise<string>} The id of the deleted offer
     */
    async delete(id) {
        const params = OfferRepository._createParamObject({ Key: { id } });
        await this._documentClient.delete(params).promise();

        return id;
    }

    static _createParamObject(additionalArgs = {}) {
        return Object.assign({}, OfferRepository._baseParams, additionalArgs);
    }
}

exports.OfferRepository = OfferRepository;