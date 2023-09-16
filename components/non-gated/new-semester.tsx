import { exec } from "@/core/new-semester";

export default function PopulateNewSemester() {
    async function action() {
        "use server";
        console.log("Populating new semester...");
        await exec();
    }

    return (
        // @ts-expect-error
        <form action={action}>
            <button type='submit'>Populate Database</button>
        </form>
    );
}
