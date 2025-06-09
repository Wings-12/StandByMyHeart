# Diary App

[Translate in Japanese](./README.md)

## Screenshots
![image](https://github.com/user-attachments/assets/966717c9-8a6e-42a5-950e-8e3f4a154106)

![image](https://github.com/user-attachments/assets/7b15bde1-b8ea-4103-9a2a-954bdd37593a)

![image](https://github.com/user-attachments/assets/a15bfaa6-a4cb-4168-ae31-a213ddd58c66)


## Overview
This web application allows users to reflect on their day. It features authentication using Next.js and Supabase, and includes a component that visualizes emotional levels (Very Down, Down, Neutral, Upbeat, Very Upbeat). Users can log in to record and review their daily feelings.

## Environment
- Node.js 18.x
- npm 9.x
- Next.js 13.x
- Supabase

## Setup
- After cloning the repository, install dependencies with:
  ```
  npm install
  ```
- Start the Next.js development server:
  ```
  npm run dev
  ```

# Environment Variables Setup

## Local Development
Create a `.env.local` file and set the following environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_PASSWORD=your-db-password
SUPABASE_PROJECT_ID=your-project-id
```

## Production (Netlify)
Configure the following environment variables in Netlify:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

# Notes
- Do not commit `.env.local` files to Git
- Ensure Netlify environment variables are correctly configured for production

# TODO:
1. Set up redirect URLs using environment variables.
1. Verify if Next.js automatically caches static content.
1. Determine if caching database data can reduce operational costs.
1. Change the current mood scale to 10 levels.
1. Integrate with Google Calendar to allow scheduling with time blocks.
