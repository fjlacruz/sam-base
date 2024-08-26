import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import type { ProductRepository } from '../ports/ProductRepository';
import type { Product } from '../domain/Product';

/**
 * Repositorio de productos que utiliza DynamoDB como base de datos.
 * Implementa la interfaz `ProductRepository` para interactuar con DynamoDB.
 */
export class DynamoDBProductRepository implements ProductRepository {
    private client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
    private tableName = process.env.tableName;

    /**
     * Guarda un producto en la tabla de DynamoDB.
     *
     * @param {Product} product - El producto que se va a guardar.
     * @returns {Promise<void>} - Una promesa que se resuelve cuando el producto se guarda correctamente.
     */
    async save(product: Product): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                PK: { S: `PRODUCT#${product.productID}` },
                SK: { S: `PRODUCT#${product.productID}` },
                GSI1PK: { S: `PRODUCT#${product.categoryID}` },
                GSI1SK: { S: `PRODUCT#${product.productID}` },
                GSI2PK: { S: 'PRODUCT#' },
                GSI2SK: { N: `${product.price}` },
                GSI3PK: { S: 'PRODUCT#' },
                GSI3SK: { S: `PRODUCT#${product.title}` },
            },
        };

        const command = new PutItemCommand(params);
        await this.client.send(command);
    }

    /**
     * Recupera todos los productos de la tabla de DynamoDB.
     *
     * @returns {Promise<Product[]>} - Una promesa que se resuelve con una lista de productos recuperados.
     */
    async getAll(): Promise<Product[]> {
        const params = {
            TableName: this.tableName,
        };

        const command = new ScanCommand(params);
        const result = await this.client.send(command);

        return (result.Items || []).map((item: any) => ({
            productID: item.PK.S.split('#')[1],
            categoryID: item.GSI1PK.S.split('#')[1],
            title: item.GSI3SK.S.split('#')[1],
            price: Number(item.GSI2SK.N),
        }));
    }
}
