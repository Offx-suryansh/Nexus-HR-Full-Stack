# Nexus HR — Full-Stack Employee Management System

Nexus HR combines the HTML/CSS/JavaScript dashboard and the Spring Boot REST API in one repository. Spring Boot serves the frontend and API from the same origin, so the deployed app does not need a separately configured frontend API URL or production CORS setup.

## Technology

- Java 21
- Spring Boot
- Spring Data JPA / Hibernate
- MySQL
- HTML, CSS and JavaScript
- Chart.js and Lucide (loaded from CDNs)

## Project structure

```text
Nexus-HR-Full-Stack/
├── src/main/java/com/lamrin/EmployeeSystem/
│   ├── controller/
│   ├── entity/
│   ├── repository/
│   └── EmployeeSystemApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── static/
│       ├── index.html
│       ├── css/
│       ├── js/
│       └── pages/
├── pom.xml
├── Dockerfile
├── render.yaml
└── .env.example
```

## Run locally in VS Code

Requirements: JDK 21, Maven 3.9+ and MySQL Server.

1. Create a MySQL database:

   ```sql
   CREATE DATABASE employee_management;
   ```

2. Set the database environment variables in your terminal. Use your own local MySQL password; do not put it in GitHub.

   Windows PowerShell:

   ```powershell
   $env:DB_URL="jdbc:mysql://localhost:3306/employee_management?useSSL=false&serverTimezone=UTC"
   $env:DB_USERNAME="root"
   $env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
   ```

   macOS/Linux:

   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/employee_management?useSSL=false&serverTimezone=UTC"
   export DB_USERNAME="root"
   export DB_PASSWORD="YOUR_MYSQL_PASSWORD"
   ```

3. Open this folder in VS Code and run:

   ```bash
   mvn spring-boot:run
   ```

4. Open `http://localhost:8080`.

The app's frontend and API run on the same port. API routes are `/emp` and `/departments`.

## Push this project to GitHub

Create a new empty GitHub repository, for example `Nexus-HR-Full-Stack`. Open this project folder in VS Code, open Terminal, and run:

```bash
git init
git add .
git commit -m "Prepare Nexus HR full-stack application"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/Nexus-HR-Full-Stack.git
git push -u origin main
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username. Do not upload `.env` files, passwords, database dumps, or real employee data.

## Deploy on Render

This repository includes a Dockerfile and `render.yaml` for a Render Web Service.

1. Push this repository to GitHub.
2. Create a managed MySQL database with a MySQL hosting provider. Render's built-in managed database is PostgreSQL, not MySQL, so use an external MySQL provider unless you intentionally migrate the project to PostgreSQL.
3. Create a Render Web Service and connect this GitHub repository. Choose the Docker runtime (or use the included Blueprint configuration).
4. In the service's Environment settings, add:
   - `DB_URL`: full JDBC URL supplied by your MySQL provider, beginning with `jdbc:mysql://`
   - `DB_USERNAME`: database username
   - `DB_PASSWORD`: database password
5. Deploy. Render will provide an HTTPS URL such as `https://your-service.onrender.com`.
6. Test the home page, `/emp`, and `/departments` before sharing the demo.

Do not use a local `localhost` database URL in Render. The deployed service cannot access your personal computer's MySQL server.

## Connect your own domain

The simplest setup is to use a dedicated subdomain for this app, for example:

`nexus-hr.suryanshsharma.runs-at.dev`

In Render, open the service's **Settings → Custom Domains**, add that hostname, and follow the exact DNS record instructions Render displays. Add the required CNAME record in the DNS manager for `runs-at.dev` (or ask whoever manages that domain to add it). Wait for DNS and HTTPS certificate provisioning, then use the verified HTTPS hostname as the portfolio Live Demo URL.

A URL path such as `suryanshsharma.runs-at.dev/nexus-hr/` cannot be pointed to a different hosting provider using DNS alone. It requires a reverse proxy or routing support from the provider hosting your portfolio domain. The dedicated subdomain avoids that complication and leaves your existing portfolio untouched.

## Before publishing

- Rotate the database password that was present in the earlier backend archive.
- Use a new, dedicated database account with only the permissions this app needs.
- Use dummy employee records in a public demo.
- The current project does not include user authentication or role-based access. Anyone who can reach the API may be able to create, edit, or delete records. Do not use real or confidential employee information until authentication and authorization are added.
- `spring.jpa.hibernate.ddl-auto=update` is retained for this student project. For a production system, use database migrations and a reviewed schema-change process.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/emp` | List employees |
| GET | `/emp/{id}` | Get one employee |
| POST | `/emp` | Create employee |
| PUT | `/emp/{id}` | Update employee |
| DELETE | `/emp/{id}` | Delete employee |
| GET | `/departments` | List departments |
| POST | `/departments` | Create department |
| PUT | `/departments/{id}` | Update department |
| DELETE | `/departments/{id}` | Delete department |
