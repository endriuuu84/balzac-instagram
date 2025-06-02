// Simple Leonardo.ai API Test
require('dotenv').config();
const axios = require('axios');

async function testLeonardoSimple() {
  const apiKey = process.env.LEONARDO_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No Leonardo API key found');
    return;
  }
  
  console.log('🚀 Testing Leonardo.ai API...\n');
  
  try {
    // Simple generation request
    const response = await axios.post(
      'https://cloud.leonardo.ai/api/rest/v1/generations',
      {
        prompt: "Delicious Italian pasta carbonara, professional food photography, elegant restaurant presentation",
        modelId: "ac614f96-1082-45bf-be9d-757f2d31c174", // DreamShaper v7
        width: 512,
        height: 512,
        num_images: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Generation started!');
    console.log('Generation ID:', response.data.sdGenerationJob.generationId);
    
    // Wait and check status
    const generationId = response.data.sdGenerationJob.generationId;
    console.log('\n⏳ Waiting for generation to complete...');
    
    let attempts = 0;
    while (attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await axios.get(
        `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );
      
      const generation = statusResponse.data.generations_by_pk;
      
      if (generation.status === 'COMPLETE') {
        console.log('\n✅ Generation complete!');
        console.log('🖼️  Image URL:', generation.generated_images[0].url);
        console.log('📊 Credits used:', generation.generated_images[0].imageToVideo);
        break;
      }
      
      attempts++;
      process.stdout.write('.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLeonardoSimple();