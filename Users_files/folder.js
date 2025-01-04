const fs = require('fs');
const path = require('path');

// Function to generate random content
function getRandomContent() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 20) + 10; // Random length between 10 and 30
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

// Main logic
let fileCounter = 1; // To track file numbering

for (let folderIndex = 1; folderIndex <= 20; folderIndex++) {
  const folderName = `folder${folderIndex}`;
  
  // Create the folder
  fs.mkdirSync(folderName, { recursive: true });

  // Create two files per folder with sequential names
  for (let i = 0; i < 2; i++) {
    const fileName = `file${fileCounter}.txt`;
    const filePath = path.join(folderName, fileName);
    const content = getRandomContent();
    fs.writeFileSync(filePath, content, 'utf8');
    fileCounter++; // Increment the file number
  }
}

console.log('Folders and sequential files with random content created successfully!');
