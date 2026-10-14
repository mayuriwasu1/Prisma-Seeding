const { prisma } = require("./config");
async function filterdata() {
    const result = await prisma.user.findMany({
        orderBy: [
            {
                age: "desc",
            }
        ],

    });
    console.log(result)
}
filterdata()
