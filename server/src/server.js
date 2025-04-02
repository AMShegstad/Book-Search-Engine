import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const app = express();

// Create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo server and Express
const startServer = async () => {
  await server.start();
  
  // Apply middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Apply GraphQL middleware
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      // Get the user token from the headers
      const token = req.headers.authorization || '';
      
      // Add auth context if needed
      return { token };
    },
  }));
  
  // Test endpoint to verify server is running
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });
  
  // In development mode, allow CORS for client dev server
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Vite default port
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
    });
  }
  
  // Serve client build files in production
  if (process.env.NODE_ENV === 'production') {
    // First look in dist (Vite production build)
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    
    // For SPA client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`🌍 API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

// Try to connect to MongoDB but start server regardless
try {
  // Initialize the server regardless of DB connection status
  startServer();
  
  // Log when DB connects successfully
  db.once('open', () => {
    console.log('MongoDB connected successfully!');
  });
  
  // Log DB connection errors
  db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    console.log('Server running without database connection');
  });
} catch (error) {
  console.error('Server startup error:', error);
}
