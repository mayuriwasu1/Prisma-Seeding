const { prisma } = require("./config");
async function filterdata() {
    const result = await prisma.user.findMany({
        skip: 3,
        take: 4,
    });
    console.log(result)
}
filterdata()
