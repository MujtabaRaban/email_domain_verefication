# email-domain-verification

A Node.js application for email domain verification with user authentication, built with Bun runtime and Resend email service.

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

1. Sign Up:
   · Visit the sign-up page
   · Enter a valid email address
   · The system will verify the domain and send a verification email
2. Sign In:
   · Visit the sign-in page
   · Enter your registered email address that you created in resend.com          # little note since we are using the free version we can't create a domain that allow us to use any email with edu but we can use the one that we create an account with in resend.com by add it on the Audience -->add contacts --> paste this : onboarding@resend.dev .

   · The system will validate your email and authenticate you

Project Structure


email-domain-verification/
├── src/
│   │── db/
│   |   └── index.ts      # initialize a neon client 
│   |   └── schema.ts     # create the tables              
│   |
|   |
|   ├── server/ 
│       │── routes/ 
│       |   └── index.ts                    # Mount the API routes
|       |   └── emailRoutes.ts              # implement the email API routes
|       |   └── verificationRoutes.ts       # implement the verificatio API routes
|       |
|       │── services/
│       |   └── auditService.ts             # implement the log event 
|       |   └── emailService.ts             
|       |   └── verificationService.ts      
|       |
│       │── utils/
│       |   └── crypto.ts                   # implement the hashcode 
|       |   └── rateLimit.ts                
|       |   └── validation.ts              
|       |
|       └── config.ts                      
|       └── index.ts                        # Start the server
│   
|── drizzle/                                #intract with the database, provide type safety 
│   
└── .env.example
└── bun.lock  
└── driszzle.config.ts                      
├── .env                     
├── package.json              
└── README.md
└── tsconfig.json                 


Support

If you encounter any issues:

1. Ensure all API keys and database connection strings are correctly set
2. Verify that Bun is properly installed
3. Check that all dependencies are installed with bun install