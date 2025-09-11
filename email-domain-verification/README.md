# email-domain-verification

application for email domain verification with user authentication, built with Bun runtime and Resend email service.

Features

· User registration with email verification
· Domain validation for email addresses
· Secure authentication flow
· PostgreSQL database integration
· Email sending via Resend API

Prerequisites

Before running this application, make sure you have:

· Bun installed on your system
· An account at Resend.com for email API
· An account at Neon Console for PostgreSQL database

# i already provided .env.example , so you can use it for .env

Installation

1. Clone the repository:

bash
git clone <your-repo-url>
cd email-domain-verification


1. Install dependencies:

bash
bun install


1. Set up environment variables:
   · Create a .env file in the root directory
   · Add your Resend API key and Neon database connection string:


RESEND_API_KEY=your_resend_api_key_here
DATABASE_URL=your_neon_connection_string_here
CODE_HASH_SECRET=your_secret_code_here
APP_BASE_URL= your_app_base_url_here
BETTER_AUTH_SECRET="d1569ca982152ae25b66403efada99853e285019a1af6b4ac5985a56b9853705"
BETTER_AUTH_URL="http://localhost:3000" # Your APP URL



Getting Your API Keys

Resend API Key

1. Sign up at Resend.com
2. Navigate to the API Keys section in your dashboard
3. Create a new API key and copy it to your .env file


Neon Database Connection

1. Sign up at Neon Console
2. Create a new project
3. In the Dashboard, find your connection string under Connection Details
4. Copy the connection string to your .env file

Running the Application

1. Start the server:

bash
bun --watch run src/server/index.ts


1. Alternatively, navigate to the project directory and run:

bash
cd email-domain-verification
bun --watch run src/server/index.ts


1. Open your web browser and go to:
   · Sign-up 
   · Sign-in 

Usage

# important note :   since we are using the free version we can't create a domain that allow us to use any email with edu but we can use the one that we create an account with in resend.com by add it on the Audience -->add contacts --> paste this : onboarding@resend.dev .

# - use this email for the test zkr0ftjjml@ohm.edu.pl    // since we can only use the one that used in resend.com 

1. Sign Up:
   · Visit the sign-up page
   · Enter a valid email address
   · The system will verify the domain and send a verification email
   . you can see a row created in db through noen console under table aduit_events for tracking the flow ,verification_codes for    tracking the sent codes. 

2. Sign In:
   · Visit the sign-in page                                                      
   · Enter your registered email address that you created in resend.com         
   · The system will validate your email and authenticate you
   . the email will be added under emails table if the process success
         

