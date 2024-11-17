import { createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import path from 'path'
import { GraphQLError } from 'graphql'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

export const processUpload = async (upload) => {
  try {
    
    await mkdir(UPLOAD_DIR, { recursive: true })
    const uploadObject = await upload
    const fileDetails = 'file' in uploadObject ? uploadObject.file : uploadObject
    const { filename, mimetype, createReadStream } = fileDetails

    console.log('Upload details:', {
      hasCreateReadStream: !!createReadStream,
      filename,
      mimetype,
    })

    // Validate upload
    if (!createReadStream || !filename) {
      throw new GraphQLError('Invalid upload provided - missing required fields')
    }

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${filename}`
    const filePath = path.join(UPLOAD_DIR, uniqueFilename)

    console.log('Starting file write to:', filePath)

    return new Promise((resolve, reject) => {
      const stream = createReadStream()
      const writeStream = createWriteStream(filePath)

      // Add error handlers for both streams
      stream.on('error', (error) => {
        console.error('Read stream error:', error)
        reject(new GraphQLError(`File upload stream failed: ${error.message}`))
      })

      writeStream.on('error', (error) => {
        console.error('Write stream error:', error)
        reject(new GraphQLError(`File write failed: ${error.message}`))
      })

      writeStream.on('finish', () => {
        console.log('File write completed:', uniqueFilename)
        resolve(`/uploads/${uniqueFilename}`)
      })

      // Pipe the file data
      stream.pipe(writeStream)
    })
  } catch (error) {
    console.error('Upload processing error:', error)
    throw new GraphQLError(
      error instanceof Error ? error.message : 'File upload failed'
    )
  }
}
