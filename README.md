## Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/)
* [pnpm](https://pnpm.io/installation)
* [Docker](https://www.docker.com/) & Docker Compose

## Getting Started

Follow these steps to set up the project locally.

### 1. Installation

Clone the repository and install the root dependencies.

```bash
git clone https://github.com/adity1729/drawingcanva.git
cd drawingcanva
pnpm install
````

### 2\. Start Services

Start the database container using Docker Compose.

```bash
docker compose up -d
```

> **Note:** The `-d` flag runs the container in detached mode (background).

### 3\. Database Setup

Navigate to the database package to configure the environment and schema.

```bash
cd packages/db
```

**Configure Environment Variables:**

Create a `.env` file:

```bash
touch .env
```

Open the `.env` file and add your database connection string:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/mydb?schema=public"
```

**Migrate and Generate Client:**

Once the environment is set, push the schema to the database and generate the Prisma client.

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4\. Running the Application

Navigate back to the project root and start the development server.

```bash
cd ../..
pnpm install
pnpm run dev
```

The application should now be running.