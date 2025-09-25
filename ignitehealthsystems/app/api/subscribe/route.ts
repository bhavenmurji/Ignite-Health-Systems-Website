import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, note } = body

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Prepare data for n8n webhook
    const webhookData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      note: note?.trim() || '',
      timestamp: new Date().toISOString(),
      source: 'website_signup',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    // Forward to n8n webhook
    // Replace this URL with your actual n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/ignite-signup'
    
    const webhookResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    })

    if (!webhookResponse.ok) {
      console.error('n8n webhook failed:', await webhookResponse.text())
      // Still return success to user to avoid exposing internal errors
    }

    // Log the signup (you might want to use a proper logging service)
    console.log('New signup:', {
      email: webhookData.email,
      role: webhookData.role,
      timestamp: webhookData.timestamp
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your interest! We\'ll be in touch soon.',
        redirectUrl: '/thank-you'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}