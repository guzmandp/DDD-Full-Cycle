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
});