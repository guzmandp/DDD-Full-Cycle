import { Sequelize } from "sequelize-typescript";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerModel from "../db/sequelize/model/customer.models";
import CustomerRepository from "./customer.repository";
import OrderModel from "../db/sequelize/model/order.models";
import OrderItemModel from "../db/sequelize/model/order-item.models";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
let sequelize: Sequelize;

beforeEach(async () => {
        sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
    });

    await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
});

afterEach(async () => {
    await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "customer 1"); 
        const address =  new Address("Street 1", "City 1", "Zipcode 1", 1);
        customer.changeAddress(address);
        await customerRepository.create(customer);


        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem(
            "1",    
            product.name, 
            product.price,
            product.id,
            2
        );
        CustomerModel
        const order = new Order('123', '123', [ordemItem])

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id:    order.id },
            include: ["items"],
        })
        
        expect(orderModel.toJSON()).toStrictEqual({
            id: '123',
            customer_id: '123',
            total: order.total(),
            items: [{
                id: ordemItem.id,
                name : ordemItem.name,
                price : ordemItem.price,
                quantity : ordemItem.quantity,
                order_id : '123',
                product_id : "123"
            }]
        });
    })

    it("should find an order by ID", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street", "City", "Zipcode", 123);
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 50);
    await productRepository.create(product);

    const orderItem = new OrderItem("oi1", product.name, product.price, product.id, 3);
    const order = new Order("o1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find("o1");

    expect(foundOrder).toStrictEqual(order);
});

it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street", "City", "Zip", 100);
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 20);
    await productRepository.create(product);

    const orderItem1 = new OrderItem("oi1", product.name, product.price, product.id, 1);
    const order1 = new Order("o1", customer.id, [orderItem1]);
    
    const orderItem2 = new OrderItem("oi2", product.name, product.price, product.id, 2);
    const order2 = new Order("o2", customer.id, [orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: "o1" }),
        expect.objectContaining({ id: "o2" }),
    ]));
});

    // ----------------------------------------------------------

    it("should update a order", async () => {
            const productRepository = new ProductRepository();
            const product = new Product("1", "Product 1", 100);
        
            await productRepository.create(product);
        
            const productModel = await ProductModel.findOne({ where: { id: "1" } });
        
            expect(productModel.toJSON()).toStrictEqual({
                id: "1",
                name: "Product 1",
                price: 100,
            });
        
            product.changeName("Product 2");
            product.changePrice(200);
        
            await productRepository.update(product);
        
            const productModel2 = await ProductModel.findOne({ where: { id: "1" } });
        
            expect(productModel2.toJSON()).toStrictEqual({
                id: "1",
                name: "Product 2",
                price: 200,
            });
        });
    
        it("should find a product", async () => {
            const productRepository = new ProductRepository();
            const product = new Product("1", "Product 1", 100);
        
            await productRepository.create(product);
        
            const productModel = await ProductModel.findOne({ where: { id: "1" } });
        
            const foundProduct = await productRepository.find("1");
        
            expect(productModel.toJSON()).toStrictEqual({
                id: foundProduct.id,
                name: foundProduct.name,
                price: foundProduct.price,
            });
        });
        
        it("should find all products", async () => {
            const productRepository = new ProductRepository();
            const product = new Product("1", "Product 1", 100);
            await productRepository.create(product);
        
            const product2 = new Product("2", "Product 2", 200);
            await productRepository.create(product2);
        
            const foundProducts = await productRepository.findAll();
            const products = [product, product2];
        
            expect(products).toEqual(foundProducts);    
        });
    
    });