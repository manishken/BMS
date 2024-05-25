Frontend Installation Steps - 

This is a Next.js project bootstrapped with create-next-app.

Getting Started
First, run the development server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

This project uses next/font to automatically optimize and load Inter, a custom Google Font.

Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.
Learn Next.js - an interactive Next.js tutorial.
You can check out the Next.js GitHub repository - your feedback and contributions are welcome!

Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.


Backend Installation steps - 
Instructions for developer:
-> Setting-up the database:-

Clone this repository in your local system

open command line in VS code and write the following commands:

python3 -m venv .venv

source env/bin/activate

pip install fastapi uvicorn sqlalchemy pymysql

Install mysql workbench https://dev.mysql.com/downloads/workbench/

Import the database (.sql file) which i will be sending in the slack

for reference (https://www.geeksforgeeks.org/how-to-import-and-export-data-to-database-in-mysql-workbench/)

Now everything is in place and we can run the database through fastapi by writing the line below in command line:

python -m uvicorn src.main:app --reload

open any browser and enter: http://127.0.0.1:8000/docs#/
