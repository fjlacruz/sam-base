import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { productSchema } from '../schemas/productSchema'; // Importa el esquema desde el archivo separado

/**
 * Initializes a DynamoDB client and Document Client for interacting with DynamoDB.
 * The DynamoDB Document Client simplifies requests by handling data marshalling.
 *
 * The `ddbDocClient` is used to interact with DynamoDB at a higher abstraction level.
 */
const client = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);

/**
 * AWS Lambda handler for processing incoming API Gateway events and inserting products into DynamoDB.
 *
 * La función procesa solicitudes HTTP POST donde el cuerpo debe contener detalles del producto
 * (`categoryID`, `price`, `title`). Los datos se validan utilizando el esquema de validación definido en
 * {@link productSchema | productSchema.ts}, y si los datos son válidos, un nuevo producto
 * se inserta en una tabla de DynamoDB. Cada producto se identifica de manera única con un UUID generado (`productID`).
 * La respuesta incluye el estado de la operación y cualquier error encontrado.
 *
 * El esquema de validación se encuentra en el archivo `productSchema.ts` y se utiliza para asegurar que los
 * datos del producto cumplan con los requisitos de formato y tipos.
 *
 * @param {APIGatewayProxyEvent} event - Represents the event object passed by AWS API Gateway.
 * The event contains HTTP request data such as headers, query parameters, path variables, and the body of the request.
 * This event is expected to carry a JSON body with product details.
 *
 * @returns {Promise<APIGatewayProxyResult>} - Returns a JSON-formatted response indicating the outcome of the operation.
 * A status code of `200` means the product was successfully inserted into the DynamoDB table, while a status code of `400` indicates
 * validation errors, and `500` indicates a server-side error.
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Retrieve the deployment stage (e.g., "DEV", "PROD") and the DynamoDB table name from environment variables
    const stage = process.env.stage;
    const table = process.env.tableName;

    try {
        // Parse the request body; defaults to null if no body is provided
        const requestBody = event.body ? JSON.parse(event.body) : null;

        // Validate the request body using the product schema
        const { error } = productSchema.validate(requestBody);
        if (error) {
            // Return validation errors with status code 400
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Input validation error',
                    details: error.details,
                }),
            };
        }

        // Destructure the product details from the validated request body
        const { categoryID, price, title } = requestBody;
        const productID = uuidv4(); // Generate a unique ID for the product

        /**
         * DynamoDB parameters to insert a new product item.
         * The product item is stored with a Partition Key (PK) and Sort Key (SK) for efficient lookups,
         * and secondary indexes are used to query by category, price, and title.
         *
         * - `PK`: Partition Key representing the unique product ID.
         * - `SK`: Sort Key, also based on the product ID.
         * - `GSI1PK`: Global Secondary Index for querying by `categoryID`.
         * - `GSI2PK` and `GSI2SK`: Secondary Index for querying by price.
         * - `GSI3PK` and `GSI3SK`: Secondary Index for querying by title.
         */
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

        // Create the DynamoDB PutItem command and send the request to insert the product
        const command = new PutItemCommand(params);
        const response = await ddbDocClient.send(command);

        // Return a successful response indicating the product has been inserted
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Elemento insertado correctamente',
                response,
                stage,
            }),
        };
    } catch (err) {
        // Log the error to CloudWatch for further investigation
        console.error('Error processing request:', err);

        // Return a generic 500 error indicating a server-side issue
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Ocurrió un error en el servidor',
            }),
        };
    }
};
