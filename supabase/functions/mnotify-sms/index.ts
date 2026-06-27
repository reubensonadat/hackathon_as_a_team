import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MNOTIFY_API_KEY = Deno.env.get('MNOTIFY_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()

    // Supabase Auth SMS Hook Payload
    // Expected structure: { user: { phone: '+233...' }, sms: { otp: '123456' } }
    const phone = payload?.user?.phone
    const otp = payload?.sms?.otp

    if (!phone || !otp) {
      console.error('Missing phone or OTP in payload:', payload)
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
      return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
        status: 500,
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
        sender: "BorlaBoard",
        message: sms_content,
        is_schedule: false,
        schedule_date: ""
      })
    })

    const result = await response.json()
    
    if (result.status === 'success') {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      console.error('mNotify API error:', result)
      return new Response(JSON.stringify({ error: 'Failed to send SMS via mNotify' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (err: any) {
    console.error('Edge Function Error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
