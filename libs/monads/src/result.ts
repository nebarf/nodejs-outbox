interface Match<T, E, U> {
  success: (value: T) => U;
  failure: (value: E) => U;
}

interface ResultBaseline<T, E> {
  readonly tag: 'success' | 'failure';

  match<U>(matchPattern: Match<T, E, U>): U;

  map<U>(mapper: (value: T) => U): ResultBaseline<U, E>;

  mapFailure<F>(mapper: (failure: E) => F): ResultBaseline<T, F>;

  chain<U>(mapper: (value: T) => ResultBaseline<U, E>): ResultBaseline<U, E>;

  orElse<F>(mapper: (failure: E) => ResultBaseline<T, F>): ResultBaseline<T, F>;
}

class Success<T, E> implements ResultBaseline<T, E> {
  readonly tag = 'success';

  constructor(readonly value: T) {}

  match<U>(matchPattern: Match<T, E, U>): U {
    return matchPattern.success(this.value);
  }

  map<U>(mapper: (value: T) => U): ResultBaseline<U, E> {
    return success(mapper(this.value));
  }

  mapFailure<F>(_mapper: (failure: E) => F): ResultBaseline<T, F> {
    return success(this.value);
  }

  chain<U>(mapper: (value: T) => ResultBaseline<U, E>): ResultBaseline<U, E> {
    return mapper(this.value);
  }

  orElse<F>(
    _mapper: (failure: E) => ResultBaseline<T, F>,
  ): ResultBaseline<T, F> {
    return success(this.value);
  }
}

class Failure<T, E> implements ResultBaseline<T, E> {
  readonly tag = 'failure';

  constructor(readonly failure: E) {}

  match<U>(matchPattern: Match<T, E, U>): U {
    return matchPattern.failure(this.failure);
  }

  map<U>(_mapper: (value: T) => U): ResultBaseline<U, E> {
    return failure(this.failure);
  }

  mapFailure<F>(mapper: (failure: E) => F): ResultBaseline<T, F> {
    return failure(mapper(this.failure));
  }

  chain<U>(_mapper: (value: T) => ResultBaseline<U, E>): ResultBaseline<U, E> {
    return failure(this.failure);
  }

  orElse<F>(
    mapper: (failure: E) => ResultBaseline<T, F>,
  ): ResultBaseline<T, F> {
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
