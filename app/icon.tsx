import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default async function Icon() {
  // Construct the absolute URL for the image in the public folder
  // Note: This might need adjustment based on deployment environment variables
  const imageBaseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000' // Fallback for local development
  const imageUrl = `${imageBaseUrl}/favicon.png`

  return new ImageResponse(
    (
      // Outer container to create the circular mask
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          borderRadius: '50%', // Make the container circular
          overflow: 'hidden',   // Hide the parts of the image outside the circle
          background: 'transparent', // Or set a background color if needed
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt="Favicon" 
          tw="w-full h-full" // Use Tailwind CSS classes via tw prop if needed, or style
          style={{ width: '100%', height: '100%' }} // Ensure image fills the container
        />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
} 