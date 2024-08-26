import  { Product } from '../domain/Product';

/**
 * Interfaz que define las operaciones básicas para manejar productos en un repositorio.
 * Implementa las operaciones de almacenamiento y recuperación de productos.
 */
export interface ProductRepository {
    /**
     * Guarda un producto en el repositorio.
     *
     * @param {Product} product - El producto que se desea guardar en el repositorio.
     * @returns {Promise<void>} - Una promesa que se resuelve cuando el producto ha sido guardado exitosamente.
     */
    save(product: Product): Promise<void>;

    /**
     * Recupera todos los productos del repositorio.
     *
     * @returns {Promise<Product[]>} - Una promesa que se resuelve con una lista de productos almacenados en el repositorio.
     */
    getAll(): Promise<Product[]>;
}
