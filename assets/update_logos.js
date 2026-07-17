const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let count = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  // We only want to replace the footer logo. The footer logo is inside a div.lg:col-span-4 space-y-4 typically, 
  // but to be safe, we can match the specific footer SVG HTML string.
  
  // Replace h-8 w-8 with h-10 w-10 text-primary dark:text-secondary for the footer SVG
  // Also inject animate-pulse
  // And change text-lg font-bold to text-lg md:text-xl font-bold
  
  // Footer SVG has class="h-8 w-8 text-secondary"
  // Let's do a replace with a regex targeting the footer logo area.
  // We can look for '<svg class="h-8 w-8 text-secondary"' and the following span.
  
  content = content.replace(
    /<a href="index\.html" class="flex items-center space-x-2 rtl:space-x-reverse">\s*<svg class="h-8 w-8 text-secondary"/g,
    '<a href="index.html" class="flex items-center space-x-2 rtl:space-x-reverse">\n            <svg class="h-10 w-10 text-primary dark:text-secondary"'
  );
  
  content = content.replace(
    /<path d="M72 25L75 32L82 35L75 38L72 45L69 38L62 35L69 32L72 25Z" fill="#00A86B" \/>/g,
    '<path d="M72 25L75 32L82 35L75 38L72 45L69 38L62 35L69 32L72 25Z" fill="#00A86B" class="animate-pulse" />'
  );

  content = content.replace(
    /<span class="text-lg font-bold tracking-tight text-white">CleanPro/g,
    '<span class="text-lg md:text-xl font-bold tracking-tight text-white">CleanPro'
  );

  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    console.log('Updated', f);
    count++;
  }
});

console.log('Total files updated:', count);
