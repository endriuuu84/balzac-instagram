// Quick Apify Test for Balzac
require('dotenv').config();
const { ApifyClient } = require('apify');

async function testApifySimple() {
  const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN
  });

  console.log('🚀 Testing Apify Integration...\n');

  try {
    // Test 1: Instagram Profile Scraper
    console.log('📱 Test 1: Fetching Instagram profiles...');
    
    const profileRun = await client.actor('apify/instagram-scraper').call({
      directUrls: [
        'https://www.instagram.com/osteriafrancescana/',
        'https://www.instagram.com/franceschetta58/'
      ],
      resultsType: 'posts',
      resultsLimit: 3
    });

    console.log('✅ Profile scraper started! Run ID:', profileRun.id);
    
    // Wait for completion
    await client.run(profileRun.id).waitForFinish();
    
    // Get results  
    const dataset = await client.run(profileRun.id).dataset();
    const { items: profileItems } = await dataset.listItems();
    
    console.log(`✅ Found ${profileItems.length} posts from competitors`);
    
    // Show sample data
    if (profileItems.length > 0) {
      const samplePost = profileItems[0];
      console.log('\n📊 Sample competitor post:');
      console.log(`   - Caption: ${samplePost.caption?.substring(0, 60)}...`);
      console.log(`   - Likes: ${samplePost.likesCount}`);
      console.log(`   - Comments: ${samplePost.commentsCount}`);
      console.log(`   - Posted: ${new Date(samplePost.timestamp).toLocaleDateString()}`);
    }

    // Test 2: Hashtag search (without # symbol)
    console.log('\n📱 Test 2: Searching Modena food hashtags...');
    
    const hashtagRun = await client.actor('apify/instagram-hashtag-scraper').call({
      hashtags: ['modenafood', 'ristorantimodena'],
      resultsLimit: 5
    });

    console.log('✅ Hashtag scraper started! Run ID:', hashtagRun.id);
    
    // Wait for completion
    await client.run(hashtagRun.id).waitForFinish();
    
    // Get results
    const hashtagDataset = await client.run(hashtagRun.id).dataset();
    const { items: hashtagItems } = await hashtagDataset.listItems();
    
    console.log(`✅ Found ${hashtagItems.length} posts with Modena hashtags`);
    
    // Analyze hashtag trends
    if (hashtagItems.length > 0) {
      const avgEngagement = hashtagItems.reduce((sum, post) => 
        sum + (post.likesCount + post.commentsCount), 0) / hashtagItems.length;
      
      console.log(`\n📈 Hashtag Performance:`);
      console.log(`   - Average engagement: ${Math.round(avgEngagement)} per post`);
      console.log(`   - Top post likes: ${Math.max(...hashtagItems.map(p => p.likesCount))}`);
    }

    console.log('\n✅ Apify integration working perfectly!');
    console.log('💡 Ready to monitor competitors and trends');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Debug info:');
    console.log('- Token exists:', !!process.env.APIFY_API_TOKEN);
    console.log('- Token length:', process.env.APIFY_API_TOKEN?.length);
  }
}

testApifySimple();