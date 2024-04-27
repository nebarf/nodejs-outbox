interface Match<A, B> {
  some: (val: A) => B;
  none: () => B;
}

export interface OptionBaseline<T> {
  tag: 'some' | 'none';

  match<U>(matchPattern: Match<T, U>): U;

  map<U>(mapper: (value: T) => U): Option<U>;

  chain<U>(mapper: (value: T) => Option<U>): Option<U>;
}

class Some<T> implements OptionBaseline<T> {
  tag: 'some';

  constructor(readonly value: T) {}

  match<U>(matchPattern: Match<T, U>): U {
    return matchPattern.some(this.value);
  }

  map<U>(mapper: (value: T) => U): Option<U> {
    return some(mapper(this.value));
  }

  chain<U>(mapper: (value: T) => Option<U>): Option<U> {
    return mapper(this.value);
  }
}

class None<T> implements OptionBaseline<T> {
  tag: 'none';

  match<U>(matchPattern: Match<T, U>): U {
    return matchPattern.none();
  }

  map<U>(_mapper: (value: T) => U): Option<U> {
    return none();
  }

  chain<U>(_mapper: (value: T) => Option<U>): Option<U> {
    return none();
  }
}

export type Option<T> = Some<T> | None<T>;

export function some<T>(value: T): Option<T> {
  return new Some(value);
}

export function none<T = never>(): Option<T> {
  return new None();
}

export function isSome<T>(option: Option<T>): option is Some<T> {
  return option instanceof Some;
}

export function isNone<T>(option: Option<T>): option is None<T> {
  return option instanceof None;
}

export function fromNullish<T>(
  value: T | null | undefined,
): Option<NonNullable<T>> {
  return typeof value === 'undefined' || value === null ? none() : some(value);
}
