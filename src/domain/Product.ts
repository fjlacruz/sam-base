/**
 * Representa un producto con detalles específicos.
 */
export class Product {
    /**
     * Crea una instancia de `Product`.
     *
     * @param {string} productID - El identificador único del producto.
     * @param {string} categoryID - El identificador de la categoría a la que pertenece el producto.
     * @param {number} price - El precio del producto.
     * @param {string} title - El título o nombre del producto.
     */
    constructor(
        public productID: string,
        public categoryID: string,
        public price: number,
        public title: string
    ) {}
}
