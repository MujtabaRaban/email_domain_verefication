import 'dotenv/config';
import { serve } from 'bun';
import { routes } from './routes';
import { PORT, APP_BASE_URL } from './config';

// Start server
serve({ 
  fetch: routes.fetch, 
  port: PORT,
  // Add error handling
  error(error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

console.log(`Server running at ${APP_BASE_URL}`);