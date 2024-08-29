
import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Middleware para añadir encabezados CORS a la respuesta.
 * @param result - La respuesta de la Lambda.
 * @returns La respuesta con encabezados CORS añadidos.
 */
export const addCorsHeaders = (result: APIGatewayProxyResult): APIGatewayProxyResult => {
    return {
        ...result,
        headers: {
            ...result.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key',
        },
    };
};
