import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Banyan - Financial Literacy Platform for Teens'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to right bottom, #10b981, #14b8a6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>🌿 Banyan</div>
        <div style={{ fontSize: 40, textAlign: 'center', maxWidth: 900 }}>
          Where Future Millionaires Start Their Journey
        </div>
        <div style={{ fontSize: 24, marginTop: 30, opacity: 0.9 }}>
          Learn • Earn • Invest • Grow
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 