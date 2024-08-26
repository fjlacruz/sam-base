import  { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBProductRepository } from '../adapters/DynamoDBProductRepository';
import  { Product } from '../domain/Product';

const productRepository = new DynamoDBProductRepository();

/**
 * Controlador Lambda para manejar solicitudes de API Gateway.
 * Este handler recupera todos los productos de la tabla DynamoDB
 * y los devuelve como una respuesta HTTP.
 *
 * @param {APIGatewayProxyEvent} event - El evento de API Gateway que contiene los detalles de la solicitud.
 * @returns {Promise<APIGatewayProxyResult>} - Una promesa que se resuelve con el resultado de la respuesta HTTP.
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    try {
        const products: Product[] = await productRepository.getAll();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Items retrieved successfully',
                data: products,
            }),
        };
    } catch (error) {
        console.error('Error scanning DynamoDB table:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error retrieving items from DynamoDB',
                error: error,
            }),
        };
    }
};
