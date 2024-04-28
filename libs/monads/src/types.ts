export type Lazy<T> = () => T;

export type Refinement<A, B extends A> = (a: A) => a is B;
