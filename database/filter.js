const { prisma } = require("./config");
async function filterdata() {
    const result = await prisma.user.findMany({
        where: {
            OR: [
                {
                    email: {
                        endsWith: "gmail.com",
                    },
                },
                { email: { endsWith: "company.com" } },
            ],
            NOT: {
                email: {
                    endsWith: "example.com",
                },
            },
        },
        select: {
            age: true,
        },
    });

    //    const result = await prisma.user.findMany({
    //     where: {
    //             age: {
    //                 gt: 30,
    //             },
    //     },
    // });

    console.log(result)
}
filterdata()


