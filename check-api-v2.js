async function check() {
  const res = await fetch('http://localhost:5000/api/sections', {
    headers: { 'x-sector-id': '5f18779c-d03c-42b1-8948-7f2fb5b17516' }
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Count:', data.length);
  if (data.length > 0) console.log('Sample Page:', data[0].page);
}
check();
