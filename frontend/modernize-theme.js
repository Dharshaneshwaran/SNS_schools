const fs = require('fs');
const path = require('path');

const directories = ['src/components/dashboard', 'src/components/teacher', 'src/components/teacher/sections'];

const replacements = [
  [/bg-white/g, 'bg-[var(--bg-secondary)]'],
  [/bg-slate-50/g, 'bg-[var(--bg-primary)]'],
  [/bg-slate-100/g, 'bg-[var(--bg-muted)]'],
  [/bg-slate-200/g, 'bg-[var(--border)]'],
  [/text-slate-900/g, 'text-[var(--text-primary)]'],
  [/text-slate-800/g, 'text-[var(--text-primary)]'],
  [/text-slate-700/g, 'text-[var(--text-primary)]'],
  [/text-slate-600/g, 'text-[var(--text-secondary)]'],
  [/text-slate-500/g, 'text-[var(--text-secondary)]'],
  [/text-slate-400/g, 'text-[var(--text-muted)]'],
  [/text-slate-300/g, 'text-[var(--text-muted)]'],
  [/border-slate-100/g, 'border-[var(--border)]'],
  [/border-slate-200/g, 'border-[var(--border)]'],
  [/border-slate-50/g, 'border-[var(--border)]'],
  [/divide-slate-100/g, 'divide-[var(--border)]'],
  [/divide-slate-50/g, 'divide-[var(--border)]'],
  [/shadow-sm/g, 'shadow-[var(--card-shadow)]'],
  [/shadow-xl/g, 'shadow-2xl'],
  [/bg-\[#fcfcfb\]/g, 'bg-[var(--bg-primary)]'],
  [/bg-[#FF7F50]/g, 'bg-[var(--accent)]'],
  [/text-[#FF7F50]/g, 'text-[var(--accent)]'],
  [/border-[#FF7F50]/g, 'border-[var(--accent)]'],
  [/shadow-\[#FF7F50\]\/30/g, 'shadow-[var(--accent)]/30'],
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      replacements.forEach(([regex, replacement]) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      });
      
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${dir}/${file}`);
      }
    }
  });
});
