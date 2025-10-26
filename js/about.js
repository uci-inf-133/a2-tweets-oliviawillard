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

	// count categories
	let completed = 0, live = 0, achieve = 0, misc = 0;
	for (const t of tweet_array) {
		const s = t.source;
		if (s == 'completed_event') {
			completed++;
		} else if (s == 'live_event') {
			live++;
		} else if (s == 'achievement') {
			achieve++;
		} else {
			misc++;
		}
	}

	// percentage helper function
	function percentageHelper(n, d) {
		return math.format((n / d) * 100, {notation: 'fixed', precision: 2}) + '%';
	}

	// update counts
	for (const el of document.querySelectorAll('.completedEvents')) el.innerText = completed;
	for (const el of document.querySelectorAll('.liveEvents')) el.innerText = live;
	for (const el of document.querySelectorAll('.achievements')) el.innerText = achieve;
	for (const el of document.querySelectorAll('.miscellaneous')) el.innerText = misc;
	
	// update percents
	for (const el of document.querySelectorAll('.completedEventsPct')) el.innerText = percentageHelper(completed, numTweets);
	for (const el of document.querySelectorAll('.liveEventsPct')) el.innerText = percentageHelper(live, numTweets);
	for (const el of document.querySelectorAll('.achievementsPct')) el.innerText = percentageHelper(achieve, numTweets);
	for (const el of document.querySelectorAll('.miscellaneousPct')) el.innerText = percentageHelper(misc, numTweets);

	// get written tweets info
	const completedTweets = tweet_array.filter(t => t.source == 'completed_event');
	const writtenCompleted = completedTweets.filter(t => t.written).length;

	for (const el of document.querySelectorAll('.completedEvents')) el.innerText = completedTweets.length;
	for (const el of document.querySelectorAll('.written'))         el.innerText = writtenCompleted;
	for (const el of document.querySelectorAll('.writtenPct'))      el.innerText = percentageHelper(writtenCompleted, completedTweets.length);	

	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});