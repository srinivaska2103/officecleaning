const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/<svg class="h-10 w-10 text-primary dark:text-secondary"/g, '<svg class="h-10 w-10 text-secondary"');
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated ' + f);
    count++;
  }
});
console.log('Total files updated: ' + count);
