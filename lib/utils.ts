export const fLetIn = <T, U>(x: T, f: (x: T) => U): U => {
    return f(x);
};

export const fLetDefIn = <T, U>(x: T | null | undefined, f: (x: T) => U): U =>
    x === null || x === undefined
        ? (() => {
              throw new Error("Value must not be null or undefined");
          })()
        : f(x);
