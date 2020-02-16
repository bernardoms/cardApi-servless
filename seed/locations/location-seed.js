class LocationSeeder {
    /**
     * Constructs a new Location seeder
     * @param {AWS.DynamoDB} dynamodb The dynamo db instance
     * @param {AWS.DynamoDB.DocumentClient} docClient The dynamo db document client
     */
    constructor(dynamodb, docClient) {
        this.dynamodb = dynamodb;
        this.docClient = docClient;

        this._tablename = 'locations';
    }

    async hasTable() {
        const tables = await this.dynamodb.listTables({Limit: 5}).promise();

        return tables.TableNames && tables.TableNames.indexOf(this._tablename) >= 0;
    }

    async createTable() {
        const tableParams = {
            TableName: this._tablename,
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH", //Partition key
                }
            ],
            AttributeDefinitions: [
                {
                    AttributeName: "id",
                    AttributeType: "S"
                }, {
                    AttributeName: "brandId",
                    AttributeType: "S"
                }
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'location_brand',
                    KeySchema: [
                        {
                            AttributeName: 'brandId',
                            KeyType: 'HASH',
                        }
                    ],
                    Projection: {
                        ProjectionType: 'ALL'
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            ],
            ProvisionedThroughput: {       // Only specified if using provisioned mode
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        };

        const result = await this.dynamodb.createTable(tableParams).promise();

        return !!result.$response.error;
    }

    async deleteTable() {
        const result = await this.dynamodb.deleteTable({TableName: this._tablename}).promise();

        return !!result.$response.err
    }

    async seed(locations = []) {
        const putRequests = locations.map(c => ({
            PutRequest: {
                Item: Object.assign({}, c)
            }
        }));

        // set the request items param with the put requests
        const params = {
            RequestItems: {
                [this._tablename]: putRequests
            }
        };

        await this.docClient.batchWrite(params).promise();
    }
}

exports.LocationSeeder = LocationSeeder;