import Product from "./product";

describe("Order unit tests", () =>{ 

    it("should throw error with id is empty", () => {
        expect(() => {
            const product = new Product("", "producto 1", 100)
        }).toThrowError("Id is required")
    });

    it("should throw error with name is empty", () => {
        expect(() => {
            const product = new Product("123", "", 100)
        }).toThrowError("Name is required")
    });

    it("should throw error when price is less than zero ", () => {
        expect(() => {
            const product = new Product("123", "product 1", -1)
        }).toThrowError("Price must be greater than zero")
    });

    it("should change name ", () => {
        expect(() => {
            const product = new Product("123", "product 1", 100);
            product.changeName("product 2");
            expect(product.name).toBe("product 2")
        })
    });

    it("should change price ", () => {
        expect(() => {
            const product = new Product("123", "product 1", 100);
            product.changePrice(200);
            expect(product.price).toBe(200)
        })
    });

    

});

    
    
