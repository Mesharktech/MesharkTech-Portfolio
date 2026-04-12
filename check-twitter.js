const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config({ path: ".env.local" });

async function checkTwitter() {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    const rwClient = client.readWrite;
    const me = await rwClient.v2.me();
    console.log("Authenticated as:", me.data.username);

    const timeline = await rwClient.v2.userTimeline(me.data.id, { max_results: 5 });
    console.log("Latest tweets:");
    for (const tweet of timeline.data.data) {
      console.log(`- [${tweet.created_at || 'Recent'}] ${tweet.text.substring(0, 100)}...`);
    }
  } catch (err) {
    console.error("Error checking Twitter:", err);
  }
}

checkTwitter();
