import prisma from "../lib/clients/prisma";
import { startOfDay } from "date-fns";

export const addUserOrUpdateBirthday = async (
    email: string,
    birthday: Date
): Promise<any> => {
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (!existingUser) {
        return null;
    } else {
        return await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                birthday: startOfDay(birthday),
            },
        });
    }
};
