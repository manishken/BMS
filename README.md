
# Movie Ticket Booking System

Brief description of what the project does and its purpose.

## Table of Contents
- [Introduction](#introduction)
- [Frontend Installation Steps](#frontend-installation-steps)
- [Backend Installation Steps](#backend-installation-steps)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Learn More](#learn-more)
- [License](#license)

## Introduction
Provide a detailed description of the project, including the motivation behind it, the problem it aims to solve, and any relevant background information.

## Frontend Installation Steps
This is a Next.js project bootstrapped with `create-next-app`.

### Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to automatically optimize and load Inter, a custom Google Font.

## Backend Installation Steps

### Setting up the database:

1. Clone this repository to your local system.

2. Open a command line in VS Code and run the following commands to set up a virtual environment and install dependencies:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
   pip install fastapi uvicorn sqlalchemy pymysql
   ```

3. Install MySQL Workbench from [here](https://dev.mysql.com/downloads/workbench/).

4. Import the database (.sql file) which will be provided via Slack. For reference, see [how to import and export data in MySQL Workbench](https://www.geeksforgeeks.org/how-to-import-and-export-data-to-database-in-mysql-workbench/).

5. Now everything is in place, and you can run the backend server using FastAPI by executing:

   ```bash
   python -m uvicorn src.main:app --reload
   ```

6. Open any browser and enter: [http://127.0.0.1:8000/docs#/](http://127.0.0.1:8000/docs#/).

## Usage
Instructions on how to use the project, explaining any specific steps to follow for both frontend and backend.

## Project Structure
Overview of the project directory structure. For example:

```
yourproject/
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       └── page.tsx
│   ├── package.json
│   ├── ...
├── backend/
│   ├── src/
│   │   └── main.py
│   ├── ...
├── README.md
└── ...
```

## Learn More
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License
```
MIT License

Copyright (c) [YEAR] [YOUR NAME OR YOUR ORGANIZATION]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
