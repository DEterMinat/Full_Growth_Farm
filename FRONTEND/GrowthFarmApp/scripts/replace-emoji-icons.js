const fs = require('fs');
const path = require('path');

// Emoji to MaterialIcons mapping
const emojiToIcon = {
  '🌱': 'eco',
  '🏠': 'home', 
  '🌾': 'grass',
  '🏪': 'store',
  '👤': 'person',
  '🎤': 'mic',
  '🤖': 'smart-toy',
  '📝': 'edit',
  '🔔': 'notifications',
  '🔒': 'lock',
  '💳': 'payment',
  '🌙': 'dark-mode',
  '🌐': 'language',
  '📊': 'analytics',
  '❓': 'help',
  '💬': 'support',
  '⭐': 'star-rate',
  '📄': 'description',
  '🚪': 'logout',
  '✏️': 'edit',
  '👨‍🌾': 'person',
  '💚': 'favorite',
  '💧': 'water-drop',
  '📈': 'trending-up',
  '🛰️': 'satellite',
  '🌧️': 'cloud',
  '🔋': 'battery-alert',
  '🌡️': 'thermostat',
  '🌽': 'grain',
  '🫘': 'agriculture',
  '↑': 'arrow-upward',
  '↓': 'arrow-downward',
  '›': 'chevron-right',
  '✕': 'close',
  '⏳': 'hourglass-empty',
  '📤': 'send',
  '🗑️': 'delete',
  '☰': 'menu',
  '⚙️': 'settings',
  '🛒': 'shopping-cart'
};

// Icon size mapping based on context
const getIconSize = (iconName, context) => {
  if (context.includes('header') || context.includes('Header')) return 24;
  if (context.includes('avatar') || context.includes('Avatar')) return 40;
  if (context.includes('crop') || context.includes('Crop')) return 24;
  if (context.includes('tab') || context.includes('Tab')) return 20;
  if (context.includes('menu') || context.includes('Menu')) return 20;
  if (context.includes('button') || context.includes('Button')) return 18;
  return 20; // default
};

// Color mapping based on context
const getIconColor = (iconName, context) => {
  if (context.includes('active') || context.includes('Active')) return '#4CAF50';
  if (context.includes('white') || context.includes('White')) return 'white';
  if (context.includes('error') || context.includes('Error')) return '#f44336';
  if (context.includes('warning') || context.includes('Warning')) return '#FF9800';
  return '#666'; // default
};

function replaceEmojiInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if MaterialIcons is already imported
    if (!content.includes('MaterialIcons from \'@expo/vector-icons/MaterialIcons\'')) {
      // Add import after the last import statement
      const importRegex = /^import.*from.*[;]/gm;
      const imports = content.match(importRegex);
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertPosition = lastImportIndex + lastImport.length;
        content = content.slice(0, insertPosition) + 
                 '\nimport MaterialIcons from \'@expo/vector-icons/MaterialIcons\';' +
                 content.slice(insertPosition);
        modified = true;
      }
    }
    
    // Replace emoji icons in JSX
    for (const [emoji, iconName] of Object.entries(emojiToIcon)) {
      const emojiRegex = new RegExp(`<Text[^>]*>${emoji}</Text>`, 'g');
      const matches = content.match(emojiRegex);
      
      if (matches) {
        for (const match of matches) {
          // Extract style from the Text element
          const styleMatch = match.match(/style=\{([^}]+)\}/);
          const style = styleMatch ? styleMatch[1] : 'styles.icon';
          
          // Determine size and color based on context
          const size = getIconSize(iconName, style);
          const color = getIconColor(iconName, style);
          
          const replacement = `<MaterialIcons name="${iconName}" size={${size}} color="${color}" style={${style}} />`;
          content = content.replace(match, replacement);
          modified = true;
        }
      }
    }
    
    // Replace emoji in icon property definitions
    for (const [emoji, iconName] of Object.entries(emojiToIcon)) {
      const iconPropRegex = new RegExp(`icon:\\s*['"]${emoji}['"]`, 'g');
      if (content.match(iconPropRegex)) {
        content = content.replace(iconPropRegex, `icon: '${iconName}'`);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceEmojiInFile(fullPath);
    }
  }
}

// Start processing from the app directory
const appDir = path.join(process.cwd(), '..');
console.log('🚀 Starting emoji to MaterialIcons conversion...');
processDirectory(appDir);
console.log('✨ Conversion complete!');
