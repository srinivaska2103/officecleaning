const fs = require('fs');

const desktopPattern = /<button class=\"lang-toggle-btn [^\"]*\" title=\"Translate\">\s*<i data-lucide=\"languages\" [^\>]*><\/i>\s*<\/button>\s*/g;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(desktopPattern, '');
  
  if(content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated ' + f);
    count++;
  }
});
console.log('Total files updated: ' + count);
