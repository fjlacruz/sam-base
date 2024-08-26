import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { productSchema } from '../schemas/productSchema';
import { DynamoDBProductRepository } from '../adapters/DynamoDBProductRepository';
import { Product } from '../domain/Product';

const productRepository = new DynamoDBProductRepository();

/**
 * Controlador Lambda para manejar solicitudes de API Gateway para crear un nuevo producto.
 * Este handler valida la entrada, crea un nuevo producto, y lo guarda en DynamoDB.
 *
 * @param {APIGatewayProxyEvent} event - El evento de API Gateway que contiene los detalles de la solicitud.
 * @returns {Promise<APIGatewayProxyResult>} - Una promesa que se resuelve con el resultado de la respuesta HTTP.
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const stage = process.env.stage;

    try {
        // Parsea el cuerpo de la solicitud, si está presente.
        const requestBody = event.body ? JSON.parse(event.body) : null;

        // Valida el cuerpo de la solicitud usando el esquema `productSchema`.
        const { error } = productSchema.validate(requestBody);
        if (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Input validation error',
                    details: error.details,
                }),
            };
        }

        // Extrae los datos del producto del cuerpo de la solicitud.
        const { categoryID, price, title } = requestBody;
        // Genera un ID único para el nuevo producto.
        const productID = uuidv4();
        // Crea una nueva instancia del producto.
        const product = new Product(productID, categoryID, price, title);

        // Guarda el nuevo producto en DynamoDB.
        await productRepository.save(product);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Elemento insertado correctamente',
                stage,
            }),
        };
    } catch (err) {
        // Maneja cualquier error que ocurra durante el procesamiento.
        console.error('Error processing request:', err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Ocurrió un error en el servidor',
            }),
        };
    }
};
