/**
 * The Location Repository
 */
class LocationRepository {
    static get _baseParams() {
        return {
            TableName: 'locations'
        };
    }

    /**
     * Contructs a new location repository
     * @param {AWS.DynamoDB.DocumentClient} documentClient The Document Client
     */
    constructor(documentClient) {
        this._documentClient = documentClient;
    }

    /**
     * Gets a list of locations
     * @returns {Promise<Models.location[]>} A list of locations
     */
    async list() {
        const params = LocationRepository._createParamObject();
        const response = await this._documentClient.scan(params).promise();

        return response.Items || [];
    }

    async getByBrand(id) {
        const param = {
            IndexName : "location_brand",
            KeyConditionExpression: "brandId = :v_brand",
            ExpressionAttributeValues: {
                ":v_brand": id
            }
        };

        const params = LocationRepository._createParamObject(param);
        const response = await this._documentClient.query(params).promise();

        return response.Items;
    }

    /**
     * Gets a location by id
     * @param {string} id The location id
     * @returns {Promise<Models.location>} The location
     */
    async get(id) {
        const params = LocationRepository._createParamObject({ Key: { id } });
        const response = await this._documentClient.get(params).promise();

        return response.Item;
    }

    /**
     * Add or replace a location
     * @param {Models.location} location The location
     * @returns {Promise<Models.location>} The location
     */
    async put(location) {
        const params = LocationRepository._createParamObject({ Item: location });
        await this._documentClient.put(params).promise();

        return location;
    }

    /**
     * Deletes a location by id
     * @param {string} id The location id
     * @return {Promise<string>} The id of the deleted location
     */
    async delete(id) {
        const params = LocationRepository._createParamObject({ Key: { id } });
        await this._documentClient.delete(params).promise();

        return id;
    }

    static _createParamObject(additionalArgs = {}) {
        return Object.assign({}, LocationRepository._baseParams, additionalArgs);
    }
}

exports.LocationRepository = LocationRepository;