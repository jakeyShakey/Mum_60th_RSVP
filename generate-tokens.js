/**
 * Token Generator for Caroline's 60th Birthday RSVP
 *
 * This script generates unique random tokens for guest invitations.
 * Run with: node generate-tokens.js
 *
 * The tokens will be displayed in the console, one per line,
 * ready to copy/paste into your Google Sheet.
 */

import { writeFileSync } from 'fs';

function generateBulkTokens(count) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function generateToken(length = 12) {
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  // Ensure uniqueness by using a Set
  const uniqueTokens = new Set();
  while (uniqueTokens.size < count) {
    uniqueTokens.add(generateToken());
  }

  return Array.from(uniqueTokens);
}

// ============================================
// CONFIGURATION
// ============================================
// Change this number to match your guest count
const GUEST_COUNT = 60; // Adjust as needed

console.log('='.repeat(60));
console.log('🎉 Caroline\'s 60th Birthday - Token Generator 🎉');
console.log('='.repeat(60));
console.log(`\nGenerating ${GUEST_COUNT} unique tokens...\n`);

// Generate tokens
const tokens = generateBulkTokens(GUEST_COUNT);

console.log('✅ Tokens generated successfully!');
console.log(`\nTotal tokens: ${tokens.length}`);
console.log('\n' + '='.repeat(60));
console.log('COPY THE TOKENS BELOW (one per line):');
console.log('='.repeat(60) + '\n');

// Output tokens - one per line for easy copy/paste into Google Sheets
tokens.forEach((token, index) => {
  console.log(token);
});

console.log('\n' + '='.repeat(60));
console.log('📋 INSTRUCTIONS:');
console.log('='.repeat(60));
console.log('1. Copy all the tokens above (from first to last)');
console.log('2. Open your Google Sheet');
console.log('3. Click on cell A2 (first row after header)');
console.log('4. Paste the tokens');
console.log('5. They should fill down column A, one token per row');
console.log('='.repeat(60) + '\n');

// Also save to a file for backup
const filename = `tokens-${new Date().toISOString().split('T')[0]}.txt`;
writeFileSync(filename, tokens.join('\n'));
console.log(`✅ Tokens also saved to: ${filename}`);
console.log('\n');
