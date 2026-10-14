const { prisma } = require("./config");

const createUser = async () => {

    const user = await prisma.user.create({
        data: {
            name: "Mayuri Wasu",
            email: "mayuriwasu33@example.com",
            age: 1000
        }
    })

    console.log(user);
    return user;
};

createUser();
