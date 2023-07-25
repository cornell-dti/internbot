import { currentUser } from "@clerk/nextjs";
import prisma from "../../lib/clients/prisma";
import GatedComponents from "@/components/gated";

const getHasDashboardAccess = async () => {
    const checkIfUserHasAccess = async (email: string) =>
        (await prisma.user.findFirst({
            where: {
                email: email,
            },
        }))
            ? true
            : false;

    const emails = (await currentUser())?.emailAddresses;

    if (!emails) {
        return false;
    }

    for (const email of emails) {
        const hasAccess = await checkIfUserHasAccess(email.emailAddress);
        if (hasAccess) {
            return true;
        }
    }

    return false;
};

const Dashboard = async () => {
    const hasAccess = await getHasDashboardAccess();

    if (!hasAccess) {
        return <div>Access denied to Dashboard.</div>;
    }

    return (
        <div>
            Dashboard
            <GatedComponents />
        </div>
    );
};

export default Dashboard;
