const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content
    .replace(/<a href=\"login\.html\" class=\"bg-secondary text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg\">Login<\/a>\r?\n?\s*/g, '')
    .replace(/<a href=\"login\.html\" class=\"block w-full text-center bg-secondary text-white font-bold py-3 rounded-xl\">Client Login<\/a>\r?\n?\s*/g, '');
  
  if(content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated ' + f);
    count++;
  }
});
console.log('Total files updated: ' + count);
