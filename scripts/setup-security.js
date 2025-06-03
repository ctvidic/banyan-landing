#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔒 Banyan Security Setup\n');

// Generate a secure API secret
function generateApiSecret() {
  return crypto.randomBytes(32).toString('hex');
}

// Check if .env.local exists
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  return fs.existsSync(envPath);
}

// Read .env.local if it exists
function readEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    const env = {};
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return env;
  } catch (error) {
    return {};
  }
}

// Validate environment variables
function validateEnv(env) {
  const issues = [];
  
  // Check required variables
  if (!env.OPENAI_API_KEY) {
    issues.push('❌ OPENAI_API_KEY is missing');
  } else if (!env.OPENAI_API_KEY.startsWith('sk-')) {
    issues.push('⚠️  OPENAI_API_KEY format looks incorrect (should start with sk-)');
  }
  
  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    issues.push('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
  } else if (!env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co')) {
    issues.push('⚠️  NEXT_PUBLIC_SUPABASE_URL format looks incorrect');
  }
  
  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  }
  
  if (!env.API_SECRET) {
    issues.push('❌ API_SECRET is missing (required for request signing)');
  } else if (env.API_SECRET.length < 32) {
    issues.push('⚠️  API_SECRET is too short (should be at least 32 characters)');
  }
  
  return issues;
}

// Main setup function
function setupSecurity() {
  console.log('Checking your security configuration...\n');
  
  const hasEnvFile = checkEnvFile();
  if (!hasEnvFile) {
    console.log('📝 No .env.local file found. Creating a template...\n');
    
    const apiSecret = generateApiSecret();
    const template = `# OpenAI API Configuration (required for bill negotiator feature)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (required for database operations)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Security Configuration
API_SECRET=${apiSecret}

# CORS Configuration (defaults to localhost:3000)
ALLOWED_ORIGIN=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_BILL_NEGOTIATOR=false

# Production Domain (for enhanced CORS validation)
# PRODUCTION_DOMAIN=yourdomain.com
`;
    
    try {
      fs.writeFileSync('.env.local', template);
      console.log('✅ Created .env.local with secure API_SECRET');
      console.log('🔑 Generated API_SECRET:', apiSecret);
      console.log('\n📋 Next steps:');
      console.log('1. Add your OpenAI API key');
      console.log('2. Add your Supabase URL and anon key');
      console.log('3. Set NEXT_PUBLIC_ENABLE_BILL_NEGOTIATOR=true if needed');
      console.log('\n⚠️  Never commit your .env.local file to version control!');
    } catch (error) {
      console.error('❌ Failed to create .env.local:', error.message);
    }
    
    return;
  }
  
  // Validate existing configuration
  const env = readEnvFile();
  const issues = validateEnv(env);
  
  if (issues.length === 0) {
    console.log('✅ Security configuration looks good!\n');
    
    // Check if API_SECRET needs updating
    if (!env.API_SECRET || env.API_SECRET === 'your_random_secret_for_request_signing_at_least_32_chars') {
      const newSecret = generateApiSecret();
      console.log('🔄 Generating new API_SECRET...');
      console.log('🔑 New API_SECRET:', newSecret);
      console.log('\n📝 Add this to your .env.local file:');
      console.log(`API_SECRET=${newSecret}`);
    }
    
    console.log('🛡️  Security features enabled:');
    console.log('   • Request origin validation');
    console.log('   • Enhanced rate limiting');
    console.log('   • Input validation and sanitization');
    console.log('   • Cost controls for voice features');
    console.log('   • Security headers and CORS protection');
    
  } else {
    console.log('⚠️  Issues found with your configuration:\n');
    issues.forEach(issue => console.log(issue));
    
    if (!env.API_SECRET || env.API_SECRET.length < 32) {
      const newSecret = generateApiSecret();
      console.log('\n🔑 Generated secure API_SECRET:', newSecret);
      console.log('📝 Add this to your .env.local file:');
      console.log(`API_SECRET=${newSecret}`);
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('🔒 Banyan Security Setup');
    console.log('\nUsage:');
    console.log('  node scripts/setup-security.js     # Check and setup security');
    console.log('  node scripts/setup-security.js -g  # Generate API secret only');
    console.log('  node scripts/setup-security.js -h  # Show this help');
    console.log('\nThis script helps you:');
    console.log('• Generate secure API secrets');
    console.log('• Validate environment configuration');
    console.log('• Create .env.local template');
    process.exit(0);
  }
  
  if (args.includes('--generate') || args.includes('-g')) {
    const secret = generateApiSecret();
    console.log('🔑 Generated API_SECRET:', secret);
    console.log('\n📝 Add this to your .env.local file:');
    console.log(`API_SECRET=${secret}`);
    process.exit(0);
  }
  
  setupSecurity();
}

module.exports = {
  generateApiSecret,
  validateEnv,
  setupSecurity
}; 