const { prisma } = require("../database/config");

const createUser = async () => {

    const user = await prisma.user.createMany({
        data: [
            {
                name: "Rahul",
                email: "mayuriwasu68@example.com",
                age: 1000
            }, {
                name: "Zeeshan",
                email: "Zeeshan@example.com",
                age: 1000
            }
        ]
    })

    console.log(user);
    return user;
};

createUser();