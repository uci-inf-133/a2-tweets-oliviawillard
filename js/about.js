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
	
	// get distinct number of tweets
	const numTweets = tweet_array.length;
	document.getElementById("numberTweets").innerText = numTweets;


	// find smallest and largest date
	const dateList = tweet_array.map(tweet => new Date(tweet.time));
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

	const firstDate = earliestDate.toLocaleDateString("en-US", {dateStyle: "full"});
	const lastDate = latestDate.toLocaleDateString("en-US", {dateStyle: "full"});

	document.getElementById("firstDate").innerText = firstDate;
	document.getElementById("lastDate").innerText = lastDate;

	console.log("Earliest tweet:", firstDate);
	console.log("Latest tweet:", lastDate);



	// 4 event category percentage and counts
	let completedEvents = 0;
	let liveEvents = 0;
	let achievementEvents = 0;
	let miscEvents = 0;
	for (const t of tweet_array) {
		const s = t.source;
		if (s == 'completed_event') {
			completedEvents++;
		} else if (s == 'live_event') {
			liveEvents++;
		} else if (s == 'achievement') {
			achievementEvents++;
		} else {
			miscEvents++;
		}
	}

	// percentage helper function
	function percentageHelper(n, d) {
		return ((n / d) * 100).toFixed(2) + '%';
	}

	function updateEventData(eventName, eventValue) {
		const elements = document.querySelectorAll(eventName);
		for (let el of elements) {
			el.innerText = eventValue;
		}
	}

	// update counts
	updateEventData(".completedEvents", completedEvents);
	updateEventData(".liveEvents", liveEvents);
	updateEventData(".achievements", achievementEvents);
	updateEventData(".miscellaneous", miscEvents);
	
	// update percents
	updateEventData(".completedEventsPct", percentageHelper(completedEvents, numTweets));
	updateEventData(".liveEventsPct", percentageHelper(liveEvents, numTweets));
	updateEventData(".achievementsPct", percentageHelper(achievementEvents, numTweets));
	updateEventData(".miscellaneousPct", percentageHelper(miscEvents, numTweets));

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