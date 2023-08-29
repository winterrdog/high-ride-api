export class MockUserModel {
    constructor() {}

    static find = jest.fn();
    static findOne = jest.fn();
    static findById = jest.fn();
    // ... add other mock methods as needed
}

export class MockRideModel extends MockUserModel {
    // consider override constructor
    constructor() {
        super();
    }

    static findByIdAndUpdate = jest.fn();
}
