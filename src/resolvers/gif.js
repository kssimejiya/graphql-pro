import { GraphQLError } from 'graphql';
import { finished } from 'stream/promises';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { Readable } from 'stream';
import { processJsonUpload } from '../utils/uploadGif.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'gifs');
fs.mkdir(UPLOAD_DIR, { recursive: true })
  .catch(error => console.error('Failed to create uploads directory:', error));

export const gifResolvers = {
  Query: {
    gifs: async (_parent, _args, context) => {
      return await context.prisma.gif.findMany({
        include: {
          author: true
        }
      });
    },

    gif: async (_parent, { id }, context) => {
      const gif = await context.prisma.gif.findUnique({
        where: { id },
        include: {
          author: true
        }
      });

      if (!gif) {
        throw new GraphQLError('GIF not found');
      }

      return gif;
    }
  },

  Mutation: {
    createGif: async (_parent, { name, file, authorId }, context) => {
      try {
        console.log('Starting createGif mutation:', { name, authorId });

        // Process and validate the JSON content
        const jsonContent = await processJsonUpload(file);
        console.log('JSON content processed successfully');

        // Create the GIF record with JSON content
        const gif = await context.prisma.gif.create({
          data: {
            name,
            content: jsonContent, // Store JSON directly in the database
            author: {
              connect: { id: authorId }
            }
          },
          include: {
            author: true
          }
        });

        console.log('GIF record created successfully:', gif.id);
        return gif;

      } catch (error) {
        console.error('createGif error:', error);
        throw new GraphQLError(
          error instanceof Error ? error.message : 'Failed to create GIF'
        );
      }
    },

    updateGif: async (_parent, { id, name, content }, context) => {
      const updateData = {};
      if (name) updateData.name = name;
      if (content) updateData.content = content;

      const gif = await context.prisma.gif.update({
        where: { id },
        data: updateData,
        include: {
          author: true
        }
      });

      if (!gif) {
        throw new GraphQLError('GIF not found');
      }

      return gif;
    },

    deleteGif: async (_parent, { id }, context) => {
      try {
        const gif = await context.prisma.gif.delete({
          where: { id }
        });

        return {
          success: true,
          message: 'GIF deleted successfully'
        };
      } catch (error) {
        console.error('Failed to delete GIF:', error);
        return {
          success: false,
          message: 'Failed to delete GIF'
        };
      }
    }
  },

  Gif: {
    author: async (parent, _args, context) => {
      const author = await context.prisma.user.findUnique({
        where: { id: parent.authorId }
      });

      if (!author) {
        throw new GraphQLError('Author not found');
      }

      return author;
    }
  },

  User: {
    gifs: async (parent, _args, context) => {
      return await context.prisma.gif.findMany({
        where: { authorId: parent.id }
      });
    }
  }
};
