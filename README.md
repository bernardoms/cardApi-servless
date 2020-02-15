# How To Run

Download the DynamoDb-Local jar file for your system here.

Extract the jar file to the root of this repository (the parent of this project folder) under the name: dynamodb_local.
Create a .env file at the root of the project and add in your own values for these enviornment variables.

AWS_ENDPOINT='http://localhost:8000/'
AWS_REGION='localhost'
AWS_ACCESS_KEY_ID='fake-access-key'
AWS_SECRET_ACCESS_KEY='fake-secret-key'

## DynamoDB JAR
DynamoDB Local

Open a terminal at the the folder where you extracted the jar file (Setup section).
Run: java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb to start it on the default port: 8000.
Open a browser at: http://localhost:8000/shell to interact with DynamoDB through the interactive shell.

##DynamoDB Container

Run docker-compose up -d localstack
If you already run the docker-compose.yml file and didn't teardown the container, start it again with, docker-compose start.
Lambda Functions

##Scripts
- Run npm run seed to seed some test data.
- Run npm start to start the functions locally.