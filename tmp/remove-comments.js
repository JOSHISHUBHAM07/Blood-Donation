const fs = require('fs');
const path = require('path');

const rootDirs = [
  path.join(__dirname, '..', 'backend'),
  path.join(__dirname, '..', 'frontend', 'src')
];

const extensions = ['.js', '.jsx', '.css', '.html'];

function removeComments(content, ext) {
  if (ext === '.js' || ext === '.jsx') {
    // Remove multi-line comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove single-line comments (careful not to match URLs)
    // Matches // if not preceded by : (simple check for http:// or https://)
    // Also matches // at the start of a line
    content = content.replace(/(^|[^\:])\/\/.*$/gm, '$1');
  } else if (ext === '.css') {
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  } else if (ext === '.html') {
    content = content.replace(/<!--[\s\S]*?-->/g, '');
  }
  return content;
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(fullPath);
      }
    } else {
      const ext = path.extname(fullPath);
      if (extensions.includes(ext)) {
        console.log(`Processing: ${fullPath}`);
        let content = fs.readFileSync(fullPath, 'utf8');
        const cleanedContent = removeComments(content, ext);
        if (content !== cleanedContent) {
          fs.writeFileSync(fullPath, cleanedContent, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  });
}

rootDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walk(dir);
  } else {
    console.error(`Directory not found: ${dir}`);
  }
});
