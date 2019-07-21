//tslint:disable member-ordering max-classes-per-file

class Wrapper<C> {
    public tracker = 0;

    constructor(protected collection: C) { }

    protected log() {
        this.tracker = (this.tracker + 1) % (1 << 10);
    }
}

export class WrapperSet<K> extends Wrapper<Set<K>> {
    constructor() {
        super(new Set());
    }

    get size() {
        const val = this.tracker;
        return this.collection.size;
    }

    public has(k: K) {
        const val = this.tracker;
        return this.collection.has(k);
    }

    public forEach(handler: (v1: K, v2: K, set: Set<K>) => void) {
        const val = this.tracker;
        this.collection.forEach(handler);
    }

    public entries() {
        const val = this.tracker;
        return this.collection.entries();
    }

    public keys() {
        const val = this.tracker;
        return this.collection.keys();
    }

    public values() {
        const val = this.tracker;
        return this.collection.values();
    }

    public add(...values: K[]) {
        values.forEach(v => this.collection.add(v));
        this.log();
    }

    public clear() {
        this.collection.clear();
        this.log();
    }

    public delete(...values: K[]) {
        values.forEach(this.collection.delete.bind(this.collection));
        this.log();
    }
}

export class WrapperMap<K, V> extends Wrapper<Map<K, V>> {
    constructor() {
        super(new Map());
    }

    get size() {
        const val = this.tracker;
        return this.collection.size;
    }

    public has(k: K) {
        const val = this.tracker;
        return this.collection.has(k);
    }

    public forEach(handler: (v: V, k: K, map: Map<K, V>) => void) {
        const val = this.tracker;
        this.collection.forEach(handler);
    }

    public entries() {
        const val = this.tracker;
        return this.collection.entries();
    }

    public keys() {
        const val = this.tracker;
        return this.collection.keys();
    }

    public values() {
        const val = this.tracker;
        return this.collection.values();
    }

    public get(k: K) {
        const val = this.tracker;
        return this.collection.get(k);
    }

    public set(k: K, v: V) {
        this.collection.set(k, v);
        this.log();
    }

    public clear() {
        this.collection.clear();
        this.log();
    }

    public delete(...values: K[]) {
        values.forEach(this.collection.delete.bind(this.collection));
        this.log();
    }
}
