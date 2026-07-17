const fs = require('fs');

const desktopPattern = /<a href=\"booknow\.html\" class=\"bg-primary text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg\">Book Now<\/a>/g;
const desktopReplacement = `<a href="login.html" class="bg-secondary text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg">Login</a>\n      <a href="booknow.html" class="bg-primary text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg">Book Now</a>`;

const mobilePattern = /<a href=\"booknow\.html\" class=\"block w-full text-center bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl transition-colors shadow-lg\">Book Now<\/a>/g;
const mobileReplacement = `<a href="login.html" class="block w-full text-center bg-secondary text-white font-bold py-3 rounded-xl">Client Login</a>\n          <a href="booknow.html" class="block w-full text-center bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl transition-colors shadow-lg">Book Now</a>`;

const files = ['aboutus.html', 'contact.html', 'gallery.html', 'home2.html', 'index.html', 'pricing.html', 'services.html'];
let count = 0;
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    let newContent = content
      .replace(desktopPattern, desktopReplacement)
      .replace(mobilePattern, mobileReplacement);
    
    if(content !== newContent) {
      fs.writeFileSync(f, newContent);
      console.log('Reverted ' + f);
      count++;
    }
  }
});
console.log('Total files reverted: ' + count);
