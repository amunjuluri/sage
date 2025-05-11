## Running a Local Postgres Instance

You can run a local Postgres database using Docker:

```bash
docker run --name sage-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sage -p 5432:5432 -d postgres:15
```

This will start a Postgres server accessible at `localhost:5432` with:
- **User:** `postgres`
- **Password:** `postgres`
- **Database:** `sage`

Set your environment variable in a `.env` file at the project root:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sage"
```

## Demo Setup

To prepare the project for a demo with sample data:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run database migrations (if needed):**
   ```bash
   npx prisma migrate deploy
   ```
3. **Seed the database with demo data:**
   ```bash
   npm run db:seed
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo User Credentials

**Students:**
- Email: `student1@university.edu` / Password: `password123`
- Email: `student2@university.edu` / Password: `password123`
- Email: `student3@university.edu` / Password: `password123`

**Teachers:**
- Email: `professor1@university.edu` / Password: `teacher123`
- Email: `professor2@university.edu` / Password: `teacher123`
- Email: `professor3@university.edu` / Password: `teacher123`

### Demo Walkthrough

1. **Student Login:**
   - Log in as a student using the credentials above.
   - Explore the student dashboard, request callbacks, and view knowledge articles.
2. **Teacher Login:**
   - Log in as a teacher using the credentials above.
   - View and manage callback requests, respond to students, and access the knowledge base.
3. **Switch Roles:**
   - Use the login page to switch between student and teacher roles to showcase both perspectives.
