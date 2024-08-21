/**
 * Interface for a Product entity
 */
export interface Product {
    /**
     * Unique identifier for the product
     */
    id: string;

    /**
     * Name of the product
     */
    name: string;

    /**
     * Description of the product
     */
    description?: string; // Optional field

    /**
     * Price of the product in USD
     */
    price: number;

    /**
     * Stock quantity available for the product
     */
    quantity: number;

    /**
     * Category of the product (e.g., Electronics, Clothing)
     */
    category: string;

    /**
     * Timestamp when the product was added to the system
     */
    createdAt: Date;

    /**
     * Timestamp when the product was last updated
     */
    updatedAt?: Date; // Optional field
}
