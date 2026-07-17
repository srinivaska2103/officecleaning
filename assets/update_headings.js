const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let total = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace font weights inside h1, h2, h3, h4, h5, h6 tags
  let newContent = content.replace(/(<h[1-6]\b[^>]*class="[^"]*)\bfont-(bold|extrabold|black)\b([^"]*")/g, '$1font-semibold$3');
  // It's possible the class has multiple font-weights (unlikely, but we can run it multiple times if needed)
  
  if(content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated ' + f);
    total++;
  }
});
console.log('Total files updated: ' + total);
