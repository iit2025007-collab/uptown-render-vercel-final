const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1434389670869-c4176c7576ce?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550614000-4b95d4666008?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485230895905-ef1907e59b65?q=80&w=900&auto=format&fit=crop'
];

async function check() {
  for (const url of urls) {
    await new Promise(resolve => {
      https.get(url, res => {
        console.log(res.statusCode, url);
        resolve();
      }).on('error', () => {
        console.log('Error', url);
        resolve();
      });
    });
  }
}
check();
