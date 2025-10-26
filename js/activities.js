function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const completed = tweet_array.filter(t => t.source == "completed_event"); 
	const counts = {}; 
	for (const t of completed) { 
		const type = t.activityType; 
		const distance = t.distance; 
		if (counts[type]) { 
			counts[type] += 1; 
		} else { counts[type] = 1; 
		} 
	} 
	
	const numActivities = Object.keys(counts).length; 
	document.getElementById("numberActivities").textContent = numActivities; 
	
	const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]); 
	document.getElementById("firstMost").textContent = sorted[0][0]; 
	document.getElementById("secondMost").textContent = sorted[1][0]; 
	document.getElementById("thirdMost").textContent = sorted[2][0];
	
	let longestActivity = "";
	let shortestActivity = "";
	let longestDistance = 0;
	let shortestDistance = Infinity;

	for (const t of completed) {
		const activity = t.activityType;
		const distance = t.distance;

		if (distance > longestDistance) {
			longestDistance = distance;
			longestActivity = activity;
		}

		if (distance < shortestDistance && distance > 0) {
			shortestDistance = distance;
			shortestActivity = activity;
		}

		document.getElementById("longestActivityType").textContent = longestActivity;
		document.getElementById("shortestActivityType").textContent = shortestActivity;
	}

	let weekdayTotal = 0, weekdayCount = 0, weekendTotal = 0, weekendCount = 0;

	for (const t of completed) {
		const day = t.time.getDay();
		if (day == 0 || day == 6) {
			weekendTotal += t.distance;
			weekendCount++;
		} else {
			weekdayTotal += t.distance;
			weekdayCount++;
		}
	}

	const avgWeekday = weekdayCount ? weekdayTotal / weekdayCount : 0;
	const avgWeekend = weekendCount ? weekendTotal / weekendCount : 0;

	document.getElementById("weekdayOrWeekendLonger").textContent = avgWeekend > avgWeekday ? "weekends" : "weekdays";

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});