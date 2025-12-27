import { SupabaseClient } from "@supabase/supabase-js"

/**
 * Extracts the relative storage path from a full Supabase Storage public URL.
 * Example:
 * Input: https://.../storage/v1/object/public/portfolio-assets/certificates/abc.webp
 * Output: certificates/abc.webp
 */
export function getStoragePathFromUrl(fullUrl: string, bucketName: string = "portfolio-assets"): string | null {
    if (!fullUrl) return null

    try {
        const url = new URL(fullUrl)
        // The path usually looks like /storage/v1/object/public/{bucketName}/{path/to/file}
        // We want {path/to/file}

        // Check if it's a standard Supabase URL structure
        const pathParts = url.pathname.split(`/${bucketName}/`)
        if (pathParts.length > 1) {
            return pathParts[1] // Return everything after the bucket name
        }

        // Fallback? If logic varies, we might need regex. 
        // But for now, let's assume valid Supabase URLs.

        return null
    } catch (e) {
        console.error("Error parsing storage URL:", e)
        return null
    }
}

/**
 * Deletes a file from the specified bucket using its full public URL.
 * Handles path extraction internally.
 */
export async function deleteImageFromStorage(
    supabase: SupabaseClient,
    imageUrl: string,
    bucketName: string = "portfolio-assets"
) {
    if (!imageUrl) return

    const storagePath = getStoragePathFromUrl(imageUrl, bucketName)
    if (!storagePath) {
        console.warn("Could not extract storage path from URL:", imageUrl)
        return
    }

    const { error } = await supabase.storage
        .from(bucketName)
        .remove([storagePath])

    if (error) {
        console.error("Error deleting file from storage:", error)
        throw error
    }
}
