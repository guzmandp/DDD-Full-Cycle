import Order from "../../domain/entity/order";
import OrderModel from "../db/sequelize/model/order.models";
import OrderItemModel from "../db/sequelize/model/order-item.models";

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
        }
        );
    }
}

