import prisma from "../lib/prisma";

export async function main() {
    const response = await Promise.all([
        // Populate initial...
    ]);
    console.log(response);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
