interface Match<T, E, U> {
  success: (value: T) => U;
  failure: (value: E) => U;
}

interface ResultBaseline<T, E> {
  readonly tag: 'success' | 'failure';

  match<U>(matchPattern: Match<T, E, U>): U;

  map<U>(mapper: (value: T) => U): Result<U, E>;

  mapFailure<F>(mapper: (failure: E) => F): Result<T, F>;

  chain<U>(mapper: (value: T) => Result<U, E>): Result<U, E>;

  orElse<F>(mapper: (failure: E) => Result<T, F>): Result<T, F>;
}

class Success<T, E> implements ResultBaseline<T, E> {
  readonly tag = 'success';

  constructor(readonly value: T) {}

  match<U>(matchPattern: Match<T, E, U>): U {
    return matchPattern.success(this.value);
  }

  map<U>(mapper: (value: T) => U): Result<U, E> {
    return success(mapper(this.value));
  }

  mapFailure<F>(_mapper: (failure: E) => F): Result<T, F> {
    return success(this.value);
  }

  chain<U>(mapper: (value: T) => Result<U, E>): Result<U, E> {
    return mapper(this.value);
  }

  orElse<F>(_mapper: (failure: E) => Result<T, F>): Result<T, F> {
    return success(this.value);
  }
}

class Failure<T, E> implements ResultBaseline<T, E> {
  readonly tag = 'failure';

  constructor(readonly failure: E) {}

  match<U>(matchPattern: Match<T, E, U>): U {
    return matchPattern.failure(this.failure);
  }

  map<U>(_mapper: (value: T) => U): Result<U, E> {
    return failure(this.failure);
  }

  mapFailure<F>(mapper: (failure: E) => F): Result<T, F> {
    return failure(mapper(this.failure));
  }

  chain<U>(_mapper: (value: T) => Result<U, E>): Result<U, E> {
    return failure(this.failure);
  }

  orElse<F>(mapper: (failure: E) => Result<T, F>): Result<T, F> {
    return mapper(this.failure);
  }
}

export type Result<T, E> = Success<T, E> | Failure<T, E>;

export function success<T, E>(value: T): Result<T, E> {
  return new Success(value);
}

export function failure<T, E>(value: E): Result<T, E> {
  return new Failure(value);
}

export function isSuccess<T, E>(result: Result<T, E>): result is Success<T, E> {
  return result instanceof Success;
}

export function isFailure<T, E>(result: Result<T, E>): result is Failure<T, E> {
  return result instanceof Failure;
}
