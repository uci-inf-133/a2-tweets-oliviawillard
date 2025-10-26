function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	
	// get number of tweets
	const numTweets = tweet_array.length;
	document.getElementById("numberTweets").innerText = numTweets;

	const dateList = tweet_array.map(tweet => new Date(tweet.time));

	// find smallest and largest date
	let earliestDate = dateList[0];
	let latestDate = dateList[0];

	for (let i = 1; i < dateList.length; i++) {
		if(dateList[i] < earliestDate) {
			earliestDate = dateList[i];
		}
		if (dateList[i] > latestDate) {
			latestDate = dateList[i];
		}
	}

	const format = { weekday: "long", year: "numeric", month: "long", day: "numeric"};
	const earliestText = earliestDate.toLocaleDateString("en-US", format);
	const latestText = latestDate.toLocaleDateString("en-US", format);

	document.getElementById("firstDate").innerText = earliestText;
	document.getElementById("lastDate").innerText = latestText;

	console.log("Earliest tweet v2:", earliestText);
	console.log("Latest tweet:", latestText);
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});