# Prisma Seeding, Filtering, Sorting, and Pagination

## 1. Seeding

### What is Seeding?

Seeding is the process of inserting an initial batch of data into a database, typically after the database tables and schema have been created.

### Why Do We Need Seeding?

1. **Development and Testing:** Developers need realistic data to build and test application features without manually entering data every time.
2. **Required Baseline Data:** Some data is essential for the application to function, such as user roles (`admin`, `user`), countries, currencies, and default settings.
3. **Faster Onboarding:** A new developer can clone the repository, run the seed script, and immediately get a working, populated database instead of starting from scratch.
4. **Consistent Environments:** Seeding helps developers create predictable initial datasets, making it easier to reproduce bugs and test application behavior.
5. **Demo and Practice:** Sample data makes it easier to demonstrate application features without entering records manually.

### How Do We Add Data to the Database?

**Ask students:** If we want to insert multiple users into our database, how would we do it?

We have already learned how to create a record using Prisma.

```js
await prisma.user.create({
  data: {
    name: "Rahul",
    email: "rahul@example.com",
    age: 22
  }
});
```

We can use the same approach in a seed script. For multiple records, we can use `createMany()`.

```js
await prisma.user.createMany({
  data: [
    {
      name: "Rahul",
      email: "rahul@example.com",
      age: 22
    },
    {
      name: "Priya",
      email: "priya@example.com",
      age: 25
    },
    {
      name: "Aman",
      email: "aman@example.com",
      age: 19
    }
  ]
});
```

### How to Create a Seed Script

Follow these steps to seed the database using Prisma.

1. Create a file named `seed.js` inside the `prisma` directory.
2. Import or initialize Prisma Client using the project's existing configuration.
3. Write the code to insert the initial data.
4. Ensure the Prisma Client is disconnected after the script finishes.
5. Configure the seed command in the Prisma configuration file, if required by the installed Prisma version.
6. Execute the seed script using the Prisma CLI.

**Example project structure:**

```text
project/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── prisma7.config.ts
├── package.json
└── ...
```

### Example: `prisma/seed.js`

The following example assumes the project already has a Prisma Client setup exported from `config.js`.

```js
const { prisma } = require("../config");

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Rahul",
        email: "rahul@example.com",
        age: 22
      },
      {
        name: "Priya",
        email: "priya@example.com",
        age: 25
      },
      {
        name: "Aman",
        email: "aman@example.com",
        age: 19
      }
    ]
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Note:** Adjust the import path according to your project's structure and Prisma Client setup. The email values must be unique because the `User` model defines `email` as a unique field.

### Running the Seed Script

Once the seed script is configured, execute:

```bash
npx prisma db seed
```

This command runs the configured seed script.

**Important:** Running the script repeatedly with the same unique email addresses may cause a unique constraint error. For repeatable seeding, consider using `upsert()` or another strategy to handle existing records.

### In-Class Question

You are building a student management application with a `Student` model containing `id`, `name`, `email`, and `age`.

Write a seed script that inserts at least five students into the database.

Requirements:
- Use `createMany()`.
- Ensure all email addresses are unique.
- Print a success message after the records are inserted.
- Disconnect Prisma Client when the script finishes.

---

## 2. Filtering

### What Is Filtering?

Filtering allows us to retrieve only the records that satisfy specific conditions.

For example:
- Find users whose age is less than 20.
- Find users whose email contains `gmail.com`.
- Find users whose name is exactly `Rahul`.
- Find users who satisfy multiple conditions simultaneously.

In Prisma, we use the `where` property inside queries such as `findMany()`.

### Basic Syntax

```js
const result = await prisma.user.findMany({
  where: {
    // Add filtering conditions here
  }
});

console.log(result);
```

### 1. `equals` — Exact Match

Use `equals` to retrieve records whose field matches a specific value.

**Example:** Find all users whose name is exactly `"Rahul"`.

```js
const result = await prisma.user.findMany({
  where: {
    name: {
      equals: "Rahul"
    }
  }
});

console.log(result);
```

For simple equality checks, we can also write:

```js
const result = await prisma.user.findMany({
  where: {
    name: "Rahul"
  }
});
```

### 2. `not` — Excluding a Value

The `not` operator excludes records matching a particular value.

**Example:** Find users whose age is not 25.

```js
const result = await prisma.user.findMany({
  where: {
    age: {
      not: 25
    }
  }
});

console.log(result);
```

### 3. `lt` — Less Than

The `lt` operator retrieves records where a numeric value is less than the specified value.

**Example:** Find users younger than 20.

```js
const result = await prisma.user.findMany({
  where: {
    age: {
      lt: 20
    }
  }
});

console.log(result);
```

Here, users aged 19 are included, but users aged 20 are excluded.

### 4. `lte` — Less Than or Equal To

The `lte` operator retrieves records whose value is less than or equal to the specified value.

**Example:** Find users aged 25 or younger.

```js
const result = await prisma.user.findMany({
  where: {
    age: {
      lte: 25
    }
  }
});

console.log(result);
```

**Difference between `lt` and `lte`:**

- `lt: 25` means less than 25.
- `lte: 25` means less than or equal to 25.

### 5. `contains` — Matching Part of a String

The `contains` operator checks whether a string field contains a particular substring.

**Example:** Find users whose email contains `"gmail.com"`.

```js
const result = await prisma.user.findMany({
  where: {
    email: {
      contains: "gmail.com"
    }
  }
});

console.log(result);
```

For case-insensitive matching, supported string filters can use `mode: "insensitive"`.

```js
const result = await prisma.user.findMany({
  where: {
    email: {
      contains: "GMAIL.COM",
      mode: "insensitive"
    }
  }
});
```

### 6. `AND` — Combining Multiple Conditions

The `AND` operator retrieves records only when all specified conditions are satisfied.

**Example:** Find users whose email contains `"gmail.com"` and whose age is less than 20.

```js
const result = await prisma.user.findMany({
  where: {
    AND: [
      {
        email: {
          contains: "gmail.com"
        }
      },
      {
        age: {
          lt: 20
        }
      }
    ]
  }
});

console.log(result);
```

Both conditions must be true for a user to appear in the result.

For these conditions, Prisma also allows a simpler syntax:

```js
const result = await prisma.user.findMany({
  where: {
    email: {
      contains: "gmail.com"
    },
    age: {
      lt: 20
    }
  }
});
```

### Filtering Documentation

- [Prisma filtering and sorting guide](https://www.prisma.io/docs/orm/v7/prisma-client/queries/filtering-and-sorting)
- [Prisma Client filter conditions and operators](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#filter-conditions-and-operators)

---

## 3. Sorting

### What Is Sorting?

Sorting arranges database records in a particular order based on one or more fields.

For example:
- Arrange users from youngest to oldest.
- Arrange users from oldest to youngest.
- Arrange users alphabetically by name.

In Prisma, we use the `orderBy` property to sort records.

### 1. Ascending Order — `asc`

**Example:** Display users from youngest to oldest.

```js
const result = await prisma.user.findMany({
  orderBy: {
    age: "asc"
  }
});

console.log(result);
```

If the ages are 19, 22, and 25, the records appear in that order.

### 2. Descending Order — `desc`

**Example:** Display users from oldest to youngest.

```js
const result = await prisma.user.findMany({
  orderBy: {
    age: "desc"
  }
});

console.log(result);
```

If the ages are 19, 22, and 25, the records appear in the order 25, 22, and 19.

### Sorting by Name

To arrange users alphabetically:

```js
const result = await prisma.user.findMany({
  orderBy: {
    name: "asc"
  }
});

console.log(result);
```

To reverse the order:

```js
const result = await prisma.user.findMany({
  orderBy: {
    name: "desc"
  }
});

console.log(result);
```

---

## 4. Combining Filtering and Sorting

We can use `where` and `orderBy` together to filter records and sort the matching results.

**Example:** Find users younger than 30 and display them from oldest to youngest.

```js
const result = await prisma.user.findMany({
  where: {
    age: {
      lt: 30
    }
  },
  orderBy: {
    age: "desc"
  }
});

console.log(result);
```

**How does it work?**

1. `where` filters users whose age is less than 30.
2. `orderBy` sorts the matching users by age in descending order.
3. `findMany()` returns the resulting records.

### Another Example

Find users whose email contains `"gmail.com"` and sort them alphabetically by name.

```js
const result = await prisma.user.findMany({
  where: {
    email: {
      contains: "gmail.com"
    }
  },
  orderBy: {
    name: "asc"
  }
});

console.log(result);
```

---

## 5. Pagination

### What Is Pagination?

Pagination divides a large set of records into smaller groups, allowing an application to display a limited number of records at a time.

For example, an application may have 1,000 users. Instead of displaying all 1,000 users on one page, it can display 10 users per page.

Pagination is commonly used in:
- Product listings
- User directories
- Student dashboards
- Search results
- Activity feeds

Prisma supports pagination using `skip` and `take`.

### 1. `take` — Limit the Number of Records

The `take` property specifies how many records to retrieve.

**Example:** Retrieve only the first five users.

```js
const result = await prisma.user.findMany({
  take: 5
});

console.log(result);
```

This returns at most five users.

### 2. `skip` — Skip Records

The `skip` property specifies how many records to skip before retrieving results.

**Example:** Skip the first five users and retrieve the remaining records.

```js
const result = await prisma.user.findMany({
  skip: 5
});

console.log(result);
```

### 3. Using `skip` and `take` Together

**Example:** Retrieve five users, starting after the first five records.

```js
const result = await prisma.user.findMany({
  skip: 5,
  take: 5
});

console.log(result);
```

If the records are ordered consistently, this retrieves the next group of five users.

### 4. Implementing Page Numbers

Suppose:
- Each page displays five users.
- Page 1 should show users 1–5.
- Page 2 should show users 6–10.
- Page 3 should show users 11–15.

We can calculate `skip` using:

`skip = (page - 1) * limit`

Where:
- `page` is the requested page number.
- `limit` is the number of records per page.

**Example:** Retrieve page 2 with five users per page.

```js
const page = 2;
const limit = 5;

const result = await prisma.user.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: {
    id: "asc"
  }
});

console.log(result);
```

Here, `skip` is 5 and `take` is 5, so the query retrieves the next five records according to the specified order.

Using `orderBy` provides a consistent record order when navigating between pages. If the sorting field can contain duplicate values, adding a unique field such as `id` as a secondary sort can make the order more predictable.

---

## 6. Practice Exercise

Use the `User` model:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  age   Int?
}
```

Write Prisma queries for the following requirements:

1. Find users older than 25.
2. Find users whose email contains `"gmail.com"`.
3. Find users whose age is less than or equal to 30.
4. Find users whose name is not `"Rahul"`.
5. Find users younger than 30 and sort them from oldest to youngest.
6. Find users whose email contains `"gmail.com"` and sort them alphabetically by name.
7. Retrieve the first five users in ascending order of ID.
8. Retrieve the second page of users when each page contains five records.
9. Find users aged 25 or younger, sort them by age in ascending order, and return the first three.
10. Implement pagination using variables for `page` and `limit`.

**Expected learning outcome:** Students should be able to populate a database with seed data and retrieve records using filtering, sorting, and pagination in Prisma Client.