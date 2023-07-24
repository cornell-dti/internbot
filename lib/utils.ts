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

/**
 * Fisher-Yates shuffle algorithm.
 * @param array - The array to be shuffled
 * @returns - The shuffled array
 */
export const shuffleInPlace = <T>(array: T[]) => {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
};

/**
 * Use Array.map with an async callback function.
 * @param array - The array to be mapped
 * @param callbackfn - The async callback function
 * @returns - The mapped array
 */
const mapAsync = async <T, U>(
    array: T[],
    callbackfn: (value: T, index: number, array: T[]) => Promise<U>
): Promise<U[]> => {
    return Promise.all(array.map(callbackfn));
};

/**
 * Use Array.filter with an async callback function.
 * @param array - The array to be filtered
 * @param callbackfn - The async callback function
 * @returns - The filtered array
 */
const filterAsync = async <T>(
    array: T[],
    callbackfn: (value: T, index: number, array: T[]) => Promise<boolean>
): Promise<T[]> => {
    const filterMap = await mapAsync(array, callbackfn);
    return array.filter((value, index) => filterMap[index]);
};

/**
 * Take a List and convert it into a Set of unique values (returned as a List), removing duplicates according to a predicate.
 * @param list - The list to be converted
 * @param pred - The predicate to be used to determine uniqueness.
 * @returns - The Set (as a List)
 */
export const listToSet = <T>(list: T[], pred: (x: T, y: T) => boolean) =>
    list.reduce(
        (acc, curr) => (acc.some((x) => pred(x, curr)) ? acc : [...acc, curr]),
        [] as T[]
    );

/**
 * Take a List and return a List of random, unique pairings, such that each element is paired with exactly one other element.
 * In the event that the list has an odd number of elements, one element will be left unpaired and not included in the result.
 *
 * The function takes an optional predicate to determine whether two elements are identical (should return true if they are),
 * as well as an optional, possibly async predicate to determine whether two elements are compatible,
 * and finally a boolean to determine whether the list should be shuffled before pairing.
 *
 * This feels like a LeetCode problem..
 *
 * @param list - The list to be paired
 * @param identity - The predicate to be used to determine identity (true if identical)
 * @param pred - The predicate to be used to determine compatibility (true if compatible)
 * @param shuffle - Whether the list should be shuffled before pairing
 * @returns - The list of pairings
 */
export const pairList = async <T>(
    list: T[],
    identity: (x: T, y: T) => boolean = () => false,
    pred: (x: T, y: T) => Promise<boolean> = () => Promise.resolve(true),
    shuffle = true
) => {
    const shuffled = shuffle ? shuffleInPlace(list) : list;
    const pairs = [] as [T, T][];

    const helper = async (list: T[]) => {
        if (list.length <= 1) return;

        const [first, ...rest] = list;
        const [second, ...others] = await filterAsync(
            rest,
            async (x) => await pred(first, x)
        );

        if (second) {
            pairs.push([first, second]);
            const remainder = listToSet([...rest, ...others], identity);
            helper(remainder);
        } else {
            helper(rest);
        }
    };

    await helper(shuffled);

    return pairs;
};
