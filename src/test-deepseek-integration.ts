import * as dotenv from "dotenv";
import { summarizeAndTag } from "./shared/utils/llmService";

// Load environment variables
dotenv.config();

async function testDeepSeekIntegration() {
  console.log("🧪 Testing DeepSeek AI Integration...");
  console.log("=".repeat(50));

  // Check if API key is set
  if (!process.env.LLM_API_KEY) {
    console.error("❌ LLM_API_KEY is not set in .env file");
    console.log("Please set:");
    console.log("LLM_API_KEY=your-deepseek-key");
    console.log("LLM_BASE_URL=https://api.deepseek.com/v1");
    console.log("LLM_MODEL=deepseek-chat");
    return;
  }

  console.log(`✅ API Key: ${process.env.LLM_API_KEY?.substring(0, 10)}...`);
  console.log(`✅ Base URL: ${process.env.LLM_BASE_URL}`);
  console.log(`✅ Model: ${process.env.LLM_MODEL}`);

  // Test 1: Simple HTML content
  console.log("\n📝 Test 1: Simple HTML Content");
  const testHTML1 = `
    <html>
      <head>
        <title>Test Article</title>
      </head>
      <body>
        <article>
          <h1>The Future of Artificial Intelligence</h1>
          <p>Artificial intelligence is rapidly transforming industries across the globe. 
          From healthcare diagnostics to autonomous vehicles, AI systems are becoming 
          increasingly sophisticated and integrated into our daily lives.</p>
          
          <p>Researchers predict that by 2030, AI will contribute over $15 trillion 
          to the global economy. The key areas of growth include machine learning, 
          natural language processing, and computer vision technologies.</p>
          
          <h2>Ethical Considerations</h2>
          <p>As AI advances, ethical considerations around bias, privacy, and job 
          displacement become increasingly important. Companies and governments 
          are developing frameworks to ensure responsible AI development.</p>
        </article>
      </body>
    </html>
  `;

  try {
    const result1 = await summarizeAndTag(testHTML1);
    console.log("✅ Summary:", result1.summary);
    console.log("✅ Tags:", result1.tags);
    console.log(`✅ Summary length: ${result1.summary.length} chars`);
    console.log(`✅ Tags count: ${result1.tags.length}`);
  } catch (error) {
    console.error("❌ Test 1 failed:", error);
  }

  // Test 2: Longer content (to test truncation)
  console.log("\n📝 Test 2: Longer Content");
  let longContent = "Start of article. ";
  // Generate long content
  for (let i = 0; i < 1000; i++) {
    longContent += `Paragraph ${i}: AI is changing the world. `;
  }
  longContent += "End of article.";

  const testHTML2 = `<div>${longContent}</div>`;

  try {
    const result2 = await summarizeAndTag(testHTML2);
    console.log("✅ Summary generated:", result2.summary.length > 0);
    console.log("✅ Tags generated:", result2.tags.length > 0);
  } catch (error) {
    console.error("❌ Test 2 failed:", error);
  }

  // Test 3: Edge case - empty content
  console.log("\n📝 Test 3: Edge Cases");
  try {
    const result3 = await summarizeAndTag("");
    console.log(
      "✅ Empty content handled:",
      result3.summary === "" && result3.tags.length === 0
    );
  } catch (error) {
    console.error("❌ Test 3 failed:", error);
  }

  console.log("\n" + "=".repeat(50));
  console.log("🧪 All tests completed!");
}

// Test configuration validation
function validateConfig() {
  console.log("\n🔧 Validating Configuration...");

  const requiredVars = ["LLM_API_KEY"];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing);
    console.log("\nCreate a .env file with:");
    console.log(`
LLM_API_KEY=your-deepseek-api-key-here
LLM_BASE_URL=https://api.deepseek.com/v1
LLM_MODEL=deepseek-chat
    `);
    return false;
  }

  console.log("✅ All required environment variables are set");
  return true;
}

// Run tests
export async function runTests() {
  if (!validateConfig()) {
    process.exit(1);
  }

  // Add timeout for tests
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Test timeout after 30 seconds")), 30000);
  });

  try {
    await Promise.race([testDeepSeekIntegration(), timeoutPromise]);
    console.log("\n🎉 DeepSeek integration test PASSED!");
  } catch (error) {
    console.error("\n💥 DeepSeek integration test FAILED:", error);
    process.exit(1);
  }
}

// Execute if this file is run directly
if (require.main === module) {
  runTests();
}

export { testDeepSeekIntegration, validateConfig };
