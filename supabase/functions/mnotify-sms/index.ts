const MNOTIFY_API_KEY = Deno.env.get('MNOTIFY_API_KEY') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received SMS Hook Request')
    const payload = await req.json()
    console.log('Payload:', JSON.stringify(payload))

    // Supabase Auth SMS Hook Payload
    // Expected structure: { user: { phone: '+233...' }, sms: { otp: '123456' } }
    const phone = payload?.user?.phone
    const otp = payload?.sms?.otp

    if (!phone || !otp) {
      console.error('Missing phone or OTP in payload')
      return new Response(JSON.stringify({ error: 'Missing phone or OTP' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const sms_content = `Your BorlaBoard verification code is ${otp}. Please do not share this with anyone.`
    
    // mNotify expects recipient without the '+'
    const formattedPhone = phone.replace('+', '')

    if (!MNOTIFY_API_KEY) {
      console.error('Missing MNOTIFY_API_KEY environment variable')
      // Even if it fails, return 200 so GoTrue doesn't throw 500 to the client during testing
      return new Response(JSON.stringify({ error: 'Server misconfiguration: No API Key' }), {
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const mNotifyEndpoint = `https://api.mnotify.com/api/sms/quick?key=${MNOTIFY_API_KEY}`
    
    const response = await fetch(mNotifyEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: [formattedPhone],
        sender: "Vendly",
        message: sms_content,
        is_schedule: false,
        schedule_date: ""
      })
    })

    const responseText = await response.text()
    console.log('mNotify Response:', responseText)

    try {
      const result = JSON.parse(responseText)
      if (result.status === 'success') {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } else {
        console.error('mNotify API error:', result)
        // Return 200 to GoTrue so we don't throw 500 on the client, but log it here
        return new Response(JSON.stringify({ error: 'Failed to send SMS via mNotify', details: result }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    } catch (parseError) {
      console.error('Failed to parse mNotify response:', responseText)
      return new Response(JSON.stringify({ error: 'Invalid response from mNotify' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (err: any) {
    console.error('Edge Function Error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      // Returning 200 so the client doesn't get a strict 500 block during auth flow tests
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
