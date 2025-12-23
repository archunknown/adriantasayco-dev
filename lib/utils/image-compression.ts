import imageCompression from 'browser-image-compression';

export async function compressImage(file: File) {
    const options = {
        maxSizeMB: 0.3, // Máximo 300KB
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/webp' as string, // Forzamos formato WebP
    };

    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error('Error comprimiendo imagen:', error);
        return file;
    }
}