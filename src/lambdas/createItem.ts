import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);
import { v4 as uuidv4 } from 'uuid';
//import { Product } from '../interfaces/create.interface';

/**
 * Lambda function handler for processing API Gateway requests.
 *
 * This function handles API Gateway Proxy events, extracts the `stage` environment variable,
 * parses the request body (if provided), and returns a response with the parsed data and
 * current stage. In case of errors, it returns a 500 status code with an error message.
 *
 * @param {APIGatewayProxyEvent} event - The event object representing the API Gateway Lambda proxy input format.
 * This includes details such as HTTP method, headers, query parameters, and the request body.
 *
 * The structure of the `event` can be found here:
 * {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format API Gateway Lambda Proxy Input Format}
 *
 * @returns {Promise<APIGatewayProxyResult>} A Promise that resolves to the response object
 * for API Gateway, including a status code, headers, and body.
 *
 * The format of the returned response can be found here:
 * {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html API Gateway Lambda Proxy Output Format}
 *
 * @example
 * // Sample event body:
 * // {
 * //   "item": "itemToInsert"
 * // }
 *
 * // Sample response:
 * // {
 * //   "message": "create",
 * //   "data": "itemToInsert",
 * //   "stage": "DEV"
 * // }
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Retrieve the stage from environment variables
    const stage = process.env.stage;

    if (event.httpMethod !== 'POST') {
        throw new Error(`Only accept POST method, you tried: ${event.httpMethod}`);
    }

    try {
        // Parse the request body if available, else set to null
        //const requestBody = event.body ? JSON.parse(event.body) : null;
        const table = process.env.tableName;

        /**
         * Extract the 'item' from the request body.
         * If the 'item' key is not provided in the body, defaults to 'defaultItem'.
         */
        // const item = requestBody?.item || 'defaultItem';

        const productID = uuidv4();
        const categoryID = 3;
        const price = 1300;
        const title = 'Test2';
        const params = {
            TableName: table,
            Item: {
                PK: { S: `PRODUCT#${productID}` },
                SK: { S: `PRODUCT#${productID}` },
                GSI1PK: { S: `PRODUCT#${categoryID}` },
                GSI1SK: { S: `PRODUCT#${productID}` },
                GSI2PK: { S: `PRODUCT#` },
                GSI2SK: { N: `${price}` },
                GSI3PK: { S: `PRODUCT#` },
                GSI3SK: { S: `PRODUCT#${title}` },
            },
        };

        const command = new PutItemCommand(params);
        const response = await ddbDocClient.send(command);

        // Return a successful response with the parsed item and the stage
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Elemento insertado correctamente',
                response,
                stage,
            }),
        };
    } catch (err) {
        // Log the error to CloudWatch Logs
        console.error('Error processing request:', err);

        // Return an internal server error response
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
