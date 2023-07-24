/**
 * Declaratively let a value be defined in a function.
 * @param x - The value to be defined
 * @param f - The function to be called with the value
 * @returns The result of the function.
 */
export const fLetIn = <T, U>(x: T, f: (x: T) => U): U => {
    return f(x);
};

/**
 * Declaratively let a value be defined in a function, and assert its non-nullability.
 * Syntactically allows for "let x = _ in ..." syntax, similar to OCaml.
 * @param x - The value to be defined
 * @param f - The function to be called with the value
 * @returns The result of the function.
 */
export const fLetDefIn = <T, U>(x: T | null | undefined, f: (x: T) => U): U =>
    x === null || x === undefined
        ? (() => {
              throw new Error("Value must not be null or undefined");
          })()
        : f(x);

/**
 * Imperatively let a value be defined in a function, and assert its non-nullability.
 * @param value - The value to be defined
 * @returns The value, asserted to be non-null.
 */
export const oDefIn = <T>(value: T): NonNullable<T> =>
    value === null || value === undefined
        ? (() => {
              throw new Error("Provided value is null or undefined");
          })()
        : (value as NonNullable<T>);
