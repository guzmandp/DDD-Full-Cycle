import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.models";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.Address.street,
            city: entity.Address.city,
            zipcode: entity.Address.zip,
            number: entity.Address.number,    
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        });
}

async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
    {
        name: entity.name,
        street: entity.Address.street,
        city: entity.Address.city,
        zipcode: entity.Address.zip,
        number: entity.Address.number,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
    },
    {
        where: {
        id: entity.id,
        },
    }
    );
}

async find(id: string): Promise<Customer> {
    let customerModel;
    try {
    customerModel = await CustomerModel.findOne({
        where: {
        id,
        },
        rejectOnEmpty: true,
    });
    } catch (error) {
        throw new Error("Customer not found");
    }

    const customer = new Customer(id, customerModel.name);
    const address = new Address(
        customerModel.street,
        customerModel.city,
        customerModel.zipcode,
        customerModel.number,
    );
    customer.changeAddress(address);
    return customer;
}

async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();

    const customers = customerModels.map((customerModels) => {
    let customer = new Customer(customerModels.id, customerModels.name);
        customer.addRewardPoints(customerModels.rewardPoints);
    const address = new Address(
        customerModels.street,
        customerModels.city,
        customerModels.zipcode,
        customerModels.number
    );
    customer.changeAddress(address);
    if (customerModels.active) {
        customer.activate();
    }
        return customer;
    });

    return customers;
}
}