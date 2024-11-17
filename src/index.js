import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import cors from 'cors';
import { resolvers } from './resolvers/index.js';  // Note the .js extension
import { prisma } from './context.js';       // Note the .js extension
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = readFileSync(
  join(__dirname, 'schema.graphql'),
  'utf8'
);

async function startServer() {
  const app = express();

  // Basic middleware
  app.use(cors({
    origin: '*',
    credentials: true
  }));

  // Important: File upload middleware must come BEFORE Apollo middleware
  app.use(
    graphqlUploadExpress({
      maxFieldSize: 50000000, // 50 MB
      maxFiles: 1
    })
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    cache: 'bounded',
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return error;
    }
  });

  await server.start();

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async () => ({
        prisma
      })
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`
🚀 Server ready at http://localhost:${PORT}/graphql
📁 Uploads available at http://localhost:${PORT}/uploads
    `);
  });
}

startServer().catch(console.error);

export { startServer };
