class IDGenerator {
    private idGen = 0;

    get nextID() {
        return this.idGen++;
    }
}

const IDGen = new IDGenerator();

export { IDGen as IDGenerator };
