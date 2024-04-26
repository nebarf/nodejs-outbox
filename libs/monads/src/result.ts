interface Match<T, E, U> {
  success: (value: T) => U;
  failure: (value: E) => U;
}

interface ResultShape<T, E> {
  match<U>(matchPattern: Match<T, E, U>): U;

  map<U>(mapper: (value: T) => U): ResultShape<U, E>;

  mapFailure<F>(mapper: (failure: E) => F): ResultShape<T, F>;

  chain<U>(mapper: (value: T) => ResultShape<U, E>): ResultShape<U, E>;

  orElse<F>(mapper: (failure: E) => ResultShape<T, F>): ResultShape<T, F>;
}

class SuccessImpl<T, E> implements ResultShape<T, E> {
  constructor(readonly value: T) {}

  match<U>(matchPattern: Match<T, E, U>): U {
    return matchPattern.success(this.value);
  }

  map<U>(mapper: (value: T) => U): ResultShape<U, E> {
    return success(mapper(this.value));
  }

  mapFailure<F>(_mapper: (failure: E) => F): ResultShape<T, F> {
    return success(this.value);
  }

  chain<U>(mapper: (value: T) => ResultShape<U, E>): ResultShape<U, E> {
    return mapper(this.value);
  }

  orElse<F>(_mapper: (failure: E) => ResultShape<T, F>): ResultShape<T, F> {
    return success(this.value);
  }
}

class FailureImpl<T, E> implements ResultShape<T, E> {
  constructor(readonly failure: E) {}

  match<U>(matchPattern: Match<T, E, U>): U {
    return matchPattern.failure(this.failure);
  }

  map<U>(_mapper: (value: T) => U): ResultShape<U, E> {
    return failure(this.failure);
  }

  mapFailure<F>(mapper: (failure: E) => F): ResultShape<T, F> {
    return failure(mapper(this.failure));
  }

  chain<U>(_mapper: (value: T) => ResultShape<U, E>): ResultShape<U, E> {
    return failure(this.failure);
  }

  orElse<F>(mapper: (failure: E) => ResultShape<T, F>): ResultShape<T, F> {
    return mapper(this.failure);
  }
}

export type Result<T, E> = SuccessImpl<T, E> | FailureImpl<T, E>;

export function success<T, E>(value: T): Result<T, E> {
  return new SuccessImpl(value);
}

export function failure<T, E>(value: E): Result<T, E> {
  return new FailureImpl(value);
}

export function isSuccess<T, E>(
  result: ResultShape<T, E>,
): result is SuccessImpl<T, E> {
  return result instanceof SuccessImpl;
}

export function isFailure<T, E>(
  result: ResultShape<T, E>,
): result is FailureImpl<T, E> {
  return result instanceof FailureImpl;
}
