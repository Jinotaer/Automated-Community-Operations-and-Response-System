/**
 * Upload image to Cloudinary
 * Returns the secure URL of the uploaded image
 */
export async function uploadToCloudinary(file) {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      console.warn('Missing Cloudinary configuration')
      return { success: false, error: 'Cloudinary not configured' }
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Upload from base64 string to Cloudinary
 */
export async function uploadBase64ToCloudinary(base64String) {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      console.warn('Missing Cloudinary configuration')
      return { success: false, error: 'Cloudinary not configured' }
    }

    const formData = new FormData()
    formData.append('file', base64String)
    formData.append('upload_preset', uploadPreset)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return { success: false, error: error.message }
  }
}
