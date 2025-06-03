// Test dei prompt OpenAI ottimizzati con Analytics ROI
const { PromptIntegrationSystem } = require('./prompts/prompt-integration.js');

async function testAdvancedPrompts() {
    console.log('🧪 Testing Advanced OpenAI Prompts with ROI Analytics...\n');
    
    const promptSystem = new PromptIntegrationSystem();
    
    // Test each meal type
    const mealTypes = ['colazione', 'pranzo', 'aperitivo'];
    
    for (const mealType of mealTypes) {
        console.log(`\n🎯 Testing ${mealType.toUpperCase()} prompt...`);
        console.log('=' .repeat(50));
        
        try {
            const startTime = Date.now();
            const result = await promptSystem.generateOptimizedContent(mealType);
            const duration = Date.now() - startTime;
            
            console.log(`✅ Generation completed in ${duration}ms`);
            console.log(`\n📝 Generated Caption:`);
            console.log(`"${result.caption}"`);
            
            console.log(`\n📊 Analytics Integration:`);
            console.log(`   - Strategy: ${result.analytics_data?.hashtag_strategy || 'N/A'}`);
            console.log(`   - ROI Score: ${result.analytics_data?.roi_score || 'N/A'}`);
            console.log(`   - Optimal Time: ${result.analytics_data?.optimal_time || 'N/A'}`);
            console.log(`   - Engagement Prediction: ${result.analytics_data?.engagement_prediction?.level || 'N/A'}`);
            
            console.log(`\n🎛️ Technical Details:`);
            console.log(`   - Model: ${result.model_used || 'N/A'}`);
            console.log(`   - ROI Analytics: ${result.with_roi_analytics ? '✅' : '❌'}`);
            console.log(`   - Fallback: ${result.is_fallback ? '⚠️' : '✅'}`);
            
        } catch (error) {
            console.error(`❌ Error testing ${mealType}:`, error.message);
        }
    }
    
    console.log('\n🚀 Testing batch generation...');
    console.log('=' .repeat(50));
    
    try {
        const startTime = Date.now();
        const batchResult = await promptSystem.generateAllMealTypes();
        const duration = Date.now() - startTime;
        
        console.log(`✅ Batch generation completed in ${duration}ms`);
        console.log(`📊 Summary: ${batchResult.summary.successful}/${batchResult.summary.successful + batchResult.summary.failed} successful`);
        
        Object.entries(batchResult.results).forEach(([mealType, result]) => {
            if (!result.error) {
                console.log(`\n🍽️ ${mealType.toUpperCase()}:`);
                console.log(`   Caption: "${result.caption?.substring(0, 80)}..."`);
                console.log(`   Strategy: ${result.analytics_data?.hashtag_strategy}`);
                console.log(`   ROI: ${result.analytics_data?.roi_score}`);
            } else {
                console.log(`\n❌ ${mealType.toUpperCase()}: ${result.error}`);
            }
        });
        
    } catch (error) {
        console.error('❌ Batch generation error:', error.message);
    }
    
    console.log('\n🏁 Prompt testing completed!');
}

// Run tests
testAdvancedPrompts().catch(console.error);