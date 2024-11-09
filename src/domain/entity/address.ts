export default class Address {
    _street: string = "";
    _city: string = "";
    _zip: string = "";
    _number: number = 0;

    constructor(street: string, city: string, zip: string, number: number){
        this._street = street;
        this._city = city;
        this._zip = zip;
        this._number = number;

        this.validate();
    }

    get street(): string {
        return this._street;
    }

    get city(): string {
        return this._city;
    }
    
        
    get zip(): string {
        return this._zip;
    }

    get number(): number {
        return this._number;
    }
    


    validate(){
        if(this._street.length === 0){
            throw new Error("Street is required");
        }
        if(this._number === 0){
            throw new Error("Number is required");
        }
        if(this._city.length === 0){
            throw new Error("City is required");
        }
        if(this._zip.length === 0){
            throw new Error("Zip is required");
        }
    }
    toString(){
        return `${this._street}, ${this._number}, ${this._zip}, ${this._city}`
    }
}