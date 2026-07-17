const fs = require('fs');

const desktopPattern = /<button class=\"dir-toggle-btn flex items-center space-x-1 px-2 py-1\.5 rounded-lg border border-slate-200 text-xs font-semibold\">\s*<span class=\"dir-toggle-text\">LTR<\/span>\s*<i data-lucide=\"languages\" class=\"w-3 h-3\"><\/i>\s*<\/button>/g;
const desktopReplacement = `<button class=\"lang-toggle-btn p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors\" title=\"Translate\">
        <i data-lucide=\"languages\" class=\"w-4 h-4\"></i>
      </button>
      <button class=\"dir-toggle-btn px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors\" title=\"Toggle Layout Direction\">
        <span class=\"dir-toggle-text\">LTR</span>
      </button>`;

const mobilePattern = /<button class=\"dir-toggle-btn flex-grow flex items-center justify-between px-3 py-2\.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors\">\s*<span>Layout Direction<\/span>\s*<span class=\"flex items-center gap-1\">\s*<span class=\"dir-toggle-text text-xs text-primary dark:text-secondary font-bold\">LTR<\/span>\s*<i data-lucide=\"languages\" class=\"w-4 h-4 text-slate-400\"><\/i>\s*<\/span>\s*<\/button>/g;
const mobileReplacement = `<button class=\"lang-toggle-btn p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors\" title=\"Translate\">
      <i data-lucide=\"languages\" class=\"w-5 h-5\"></i>
    </button>
    <button class=\"dir-toggle-btn flex-grow flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors\" title=\"Toggle Layout Direction\">
      <span>Layout Direction</span>
      <span class=\"flex items-center gap-1\">
        <span class=\"dir-toggle-text text-xs text-primary dark:text-secondary font-bold\">LTR</span>
      </span>
    </button>`;

const authFloatingPattern = /<button class=\"dir-toggle-btn flex items-center gap-1 px-3 py-1\.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold\" title=\"Toggle Layout Direction\">\s*<span class=\"dir-toggle-text\">LTR<\/span>\s*<i data-lucide=\"languages\" class=\"w-4 h-4\"><\/i>\s*<\/button>/g;
const authFloatingReplacement = `<button class=\"lang-toggle-btn p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors\" title=\"Translate\">
      <i data-lucide=\"languages\" class=\"w-4 h-4\"></i>
    </button>
    <button class=\"dir-toggle-btn flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors\" title=\"Toggle Layout Direction\">
      <span class=\"dir-toggle-text\">LTR</span>
    </button>`;

const otherFloatingPattern = /<button class=\"dir-toggle-btn flex items-center space-x-1 px-3 py-1\.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold\" title=\"Toggle Layout Direction\">\s*<span class=\"dir-toggle-text\">LTR<\/span>\s*<i data-lucide=\"languages\" class=\"w-4 h-4\"><\/i>\s*<\/button>/g;
const otherFloatingReplacement = `<button class=\"lang-toggle-btn p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors\" title=\"Translate\">
            <i data-lucide=\"languages\" class=\"w-4 h-4\"></i>
          </button>
          <button class=\"dir-toggle-btn flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors\" title=\"Toggle Layout Direction\">
            <span class=\"dir-toggle-text\">LTR</span>
          </button>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content
    .replace(desktopPattern, desktopReplacement)
    .replace(mobilePattern, mobileReplacement)
    .replace(authFloatingPattern, authFloatingReplacement)
    .replace(otherFloatingPattern, otherFloatingReplacement);
  if(content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated ' + f);
    count++;
  }
});
console.log('Total files updated: ' + count);
