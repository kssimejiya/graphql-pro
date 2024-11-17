import { GraphQLError } from 'graphql';

export const processJsonUpload = async (upload) => {
  try {
    // Wait for the upload promise to resolve
    const uploadObject = await upload;
    
    // Get file details
    const fileDetails = 'file' in uploadObject ? uploadObject.file : uploadObject;
    const { filename, createReadStream } = fileDetails;

    // Validate file type
    if (!filename.toLowerCase().endsWith('.json')) {
      throw new GraphQLError('Only JSON files are allowed');
    }

    return new Promise((resolve, reject) => {
      let fileContent = '';
      const stream = createReadStream();

      // Handle stream errors
      stream.on('error', (error) => {
        console.error('Read stream error:', error);
        reject(new GraphQLError(`File upload failed: ${error.message}`));
      });

      // Read the content as string
      stream.on('data', (chunk) => {
        fileContent += chunk.toString();
      });

      stream.on('end', () => {
        try {
          // Parse and validate JSON
          const jsonContent = JSON.parse(fileContent);
          resolve(jsonContent);
        } catch (error) {
          reject(new GraphQLError('Invalid JSON content'));
        }
      });
    });
  } catch (error) {
    console.error('JSON processing error:', error);
    throw new GraphQLError(
      error instanceof Error ? error.message : 'Failed to process JSON'
    );
  }
};

// Commented out version with file system operations
/*
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { FileUpload } from 'graphql-upload-minimal';
import { GraphQLError } from 'graphql';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const processJsonUpload = async (upload) => {
  try {
    // Create uploads directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Wait for the upload promise to resolve
    const uploadObject = await upload;

    // Get file details, handling both potential structures
    const fileDetails = 'file' in uploadObject ? uploadObject.file : uploadObject;
    const { filename, createReadStream } = fileDetails;

    // Validate file type
    if (!filename.toLowerCase().endsWith('.json')) {
      throw new GraphQLError('Only JSON files are allowed');
    }

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${filename}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    console.log('Starting JSON file write to:', filePath);

    return new Promise((resolve, reject) => {
      let fileContent = '';
      const stream = createReadStream();
      const writeStream = createWriteStream(filePath);

      // Add error handlers
      stream.on('error', (error) => {
        console.error('Read stream error:', error);
        reject(new GraphQLError(`File upload stream failed: ${error.message}`));
      });

      writeStream.on('error', (error) => {
        console.error('Write stream error:', error);
        reject(new GraphQLError(`File write failed: ${error.message}`));
      });

      // Read the content as string
      stream.on('data', (chunk) => {
        fileContent += chunk.toString();
      });

      stream.on('end', async () => {
        // Validate JSON content
        try {
          const jsonContent = JSON.parse(fileContent);
          writeStream.end(fileContent, () => {
            console.log('JSON file write completed:', uniqueFilename);
            resolve({
              filePath: `/uploads/${uniqueFilename}`,
              jsonContent
            });
          });
        } catch (error) {
          reject(new GraphQLError('Invalid JSON content'));
        }
      });

      // Pipe the file data
      stream.pipe(writeStream);
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    throw new GraphQLError(
      error instanceof Error ? error.message : 'File upload failed'
    );
  }
};
*/