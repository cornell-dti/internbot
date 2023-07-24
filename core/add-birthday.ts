import prisma from "../lib/prisma";

export const addUserOrUpdateBirthday = async (
    email: string,
    birthday: Date
): Promise<any> => {
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (!existingUser) {
        console.log("User not found with this email:", email);
        return null;
    } else {
        return prisma.user.update({
            where: { id: existingUser.id },
            data: {
                birthday,
            },
        });
    }
};
