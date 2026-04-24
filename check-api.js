const axios = require('axios');

async function checkApi() {
  try {
    const res = await axios.get('http://localhost:5000/api/sections', {
      headers: { 'x-sector-id': '5f18779c-d03c-42b1-8948-7f2fb5b17516' }
    });
    console.log('API returned sections:', res.data.length);
    if (res.data.length > 0) {
      console.log('Sample section:', res.data[0]);
    }
  } catch (err) {
    console.error('API Error:', err.message);
  }
}

checkApi();
