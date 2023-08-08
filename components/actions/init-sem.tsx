import Help from "@/components/ui/help";
import { exec as execNewSem } from "@/core/new-semester";

const InitSem = () => {
    const initNewSem = async () => {
        "use server";
        await execNewSem();
    };

    return (
        <form className='flex flex-row gap-4' action={initNewSem}>
            <button
                type='submit'
                className='border-2 border-red-600 text-red-600 bg-white hover:bg-gray-200 transition-all font-semibold py-2 px-4 rounded'
            >
                Initiate New Semester
            </button>
            <Help
                text='Populate the database with the latest data from Slack,
                    and create a new semester based on the current time.'
            />
        </form>
    );
};

export default InitSem;
