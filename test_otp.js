async function testOtp() {
  const url = 'https://xusdodnunvtttbuzbacw.supabase.co/auth/v1/otp';
  const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1c2RvZG51bnZ0dHRidXpiYWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTk1MjIsImV4cCI6MjA5ODA3NTUyMn0.XJYNZYwf7aLzxhsw802CUaZIrwt2VMCXjFQ7sIL8Css';
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': apikey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: '+233501234567' })
    });
    
    const status = res.status;
    const text = await res.text();
    console.log('Status:', status);
    console.log('Body:', text);
  } catch(e) {
    console.error(e);
  }
}

testOtp();
