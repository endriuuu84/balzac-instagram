// Test Instagram Posting
require('dotenv').config();
const axios = require('axios');

async function testInstagramPost() {
  // Check if we have required env variables
  if (!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || !process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
    console.log('❌ Mancano le credenziali Instagram nel file .env');
    console.log('\n📋 Hai bisogno di:');
    console.log('- INSTAGRAM_BUSINESS_ACCOUNT_ID');
    console.log('- FACEBOOK_PAGE_ACCESS_TOKEN');
    console.log('\nSegui la guida in setup-instagram/instagram-setup-guide.md');
    return;
  }

  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  
  // Test post data
  const testPost = {
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1080&h=1080&fit=crop', // Food image
    caption: `🍝 Test automatico dal Balzac Bistrot Modena!
    
La nostra automazione Instagram è attiva ✨

#BalzacBistrot #ModenaFood #TestAutomation`
  };
  
  console.log('🚀 Testing Instagram post...\n');
  console.log('📸 Image:', testPost.imageUrl);
  console.log('📝 Caption:', testPost.caption);
  console.log('\n');
  
  try {
    // Step 1: Create media container
    console.log('📤 Step 1: Creating media container...');
    
    const createMediaResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${businessAccountId}/media`,
      {
        image_url: testPost.imageUrl,
        caption: testPost.caption,
        access_token: accessToken
      }
    );
    
    const mediaContainerId = createMediaResponse.data.id;
    console.log('✅ Media container created:', mediaContainerId);
    
    // Wait a bit for processing
    console.log('⏳ Waiting for media processing...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Publish the media
    console.log('📤 Step 2: Publishing to Instagram...');
    
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${businessAccountId}/media_publish`,
      {
        creation_id: mediaContainerId,
        access_token: accessToken
      }
    );
    
    console.log('✅ POST PUBLISHED SUCCESSFULLY!');
    console.log('📱 Post ID:', publishResponse.data.id);
    console.log('\n🎉 Instagram automation is working!');
    console.log('Check your Instagram profile to see the post.');
    
  } catch (error) {
    console.error('❌ Error posting to Instagram:');
    
    if (error.response?.data) {
      console.error('Error details:', error.response.data);
      
      // Common error explanations
      if (error.response.data.error?.code === 190) {
        console.log('\n⚠️  Token expired or invalid. You need to:');
        console.log('1. Generate a new token from Facebook Developer Console');
        console.log('2. Update .env file with new token');
      } else if (error.response.data.error?.code === 100) {
        console.log('\n⚠️  Invalid parameter. Check:');
        console.log('1. Image URL is publicly accessible');
        console.log('2. Business Account ID is correct');
        console.log('3. You have proper permissions');
      }
    } else {
      console.error(error.message);
    }
    
    console.log('\n📚 Troubleshooting guide: setup-instagram/instagram-setup-guide.md');
  }
}

// Add helper to check current permissions
async function checkPermissions() {
  if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
    console.log('❌ No access token found in .env');
    return;
  }
  
  console.log('\n🔍 Checking token permissions...\n');
  
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/me/permissions`,
      {
        params: {
          access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
        }
      }
    );
    
    console.log('✅ Current permissions:');
    response.data.data.forEach(perm => {
      console.log(`- ${perm.permission}: ${perm.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking permissions:', error.response?.data || error.message);
  }
}

// Run test
console.log('🚀 BALZAC INSTAGRAM AUTOMATION TEST\n');

// Check if user wants to check permissions first
if (process.argv[2] === '--check-permissions') {
  checkPermissions();
} else {
  testInstagramPost();
  console.log('\n💡 Tip: Run with --check-permissions to verify token permissions');
}