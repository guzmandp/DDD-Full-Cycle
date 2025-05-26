import Order from "../../domain/entity/order";
import OrderModel from "../db/sequelize/model/order.models";
import OrderItemModel from "../db/sequelize/model/order-item.models";
import CustomerModel from "../db/sequelize/model/customer.models";
import OrderItem from "../../domain/entity/order_item";

export default class OrderRepository {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            })),
        },
        {
            include: [{
                model: OrderItemModel,
            }]
        });
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update({ 
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            })),
    },
    {
        where: {
        id: entity.id,
        },
    });
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({ 
            where: { id }, 
            include: [{ model: OrderItemModel }]
        });
                if (!orderModel) {
            throw new Error("Order not found");
        }

        const items = orderModel.items.map((item: any) => 
            new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        );

        return new Order(orderModel.id, orderModel.customer_id, items);
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: [{ model: OrderItemModel }]
        });

        return orderModels.map((orderModel: any) => {
            const items = orderModel.items.map((item: any) =>
                new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
            );
            return new Order(orderModel.id, orderModel.customer_id, items);
        });
    }
}
