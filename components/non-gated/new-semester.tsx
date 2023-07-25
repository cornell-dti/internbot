import { exec } from "@/core/new-semester";

const PopulateNewSemester = () => {
    const action = async () => {
        "use server";
        await exec();
    };

    return (
        // @ts-expect-error
        <form action={action}>
            <button type='submit'>Populate Database</button>
        </form>
    );
};

export default PopulateNewSemester;
