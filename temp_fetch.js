const https = require('https');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }}, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const urls = [
    "https://www.alamy.com/stock-photo/diwali-sweets.html?pseudoid=0164624A-6980-4D42-84CD-9687E4BC9BDB",
    "https://www.shutterstock.com/image-photo/diwali-sweets-arranged-plate-diya-flowers-1219832641",
    "https://www.dreamstime.com/photos-images/diwali-lamps-indian-sweets.html"
  ];

  for (let url of urls) {
    try {
      const html = await fetchHTML(url);
      const match = html.match(/https:\/\/[^"'\s]*\.jpg/);
      if (match) console.log(match[0]);
      else console.log("No jpg found for", url);
    } catch(e) {
      console.log("Error:", e.message);
    }
  }
}
run();
