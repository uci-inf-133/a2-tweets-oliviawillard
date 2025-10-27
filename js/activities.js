function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// count how many of each activity there is
	const completed = tweet_array.filter(t => t.source == "completed_event"); 
	const counts = {}; 
	for (const t of completed) { 
		const type = t.activityType; 
		if (counts[type]) { 
			counts[type] += 1; 
		} else { 
			counts[type] = 1; 
		} 
	} 
	
	const numActivities = Object.keys(counts).length; 
	document.getElementById("numberActivities").textContent = numActivities; 
	
	const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]); 
	document.getElementById("firstMost").textContent = sorted[0][0]; 
	document.getElementById("secondMost").textContent = sorted[1][0]; 
	document.getElementById("thirdMost").textContent = sorted[2][0];
	
	// get activity with longest and shortest distance
	const top3 = [sorted[0][0], sorted[1][0], sorted[2][0]];
	const top3Tweets = completed.filter(t => top3.includes(t.activityType) && t.distance > 0);
	
	const totals = {};
	const countsAvg = {};

	let longestActivity = "";
	let shortestActivity = "";
	let longestAvg = 0;
	let shortestAvg = Infinity;

	for (let i = 0; i < top3Tweets.length; i++) {
		const t = top3Tweets[i];
		const act = t.activityType;

		if (!totals[act]) {
			totals[act] = t.distance;
			countsAvg[act] = 1;
		} else {
			totals[act] += t.distance;
			countsAvg[act] += 1;
		}
	}

	for (const act in totals) {
		const avg = totals[act] / countsAvg[act];
		if (avg > longestAvg) {
			longestAvg = avg;
			longestActivity = act;
		}
		if (avg < shortestAvg) {
			shortestAvg = avg;
			shortestActivity = act;
		}
	}
	document.getElementById("longestActivityType").textContent = longestActivity;
	document.getElementById("shortestActivityType").textContent = shortestActivity;


	// weekend or weekday greater?
	let weekdayTotal = 0, weekdayCount = 0, weekendTotal = 0, weekendCount = 0;

	for (const t of top3Tweets) {
		const day = t.time.getDay();
		if (day == 0 || day == 6) {
			weekendTotal += t.distance;
			weekendCount++;
		} else {
			weekdayTotal += t.distance;
			weekdayCount++;
		}
	}

	let avgWeekday = 0, avgWeekend = 0;
	if (weekdayCount > 0) {
		avgWeekday = weekdayTotal / weekdayCount;
	}
	if (weekendCount > 0) {
		avgWeekend = weekendTotal / weekendCount;
	}

	if (avgWeekend > avgWeekday) {
		document.getElementById("weekdayOrWeekendLonger").textContent = "weekends";
	} else {
		document.getElementById("weekdayOrWeekendLonger").textContent = "weekdays";
	}

	console.log("top 3:", top3Tweets);

	

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	const countData = Object.entries(counts).map(([activity, count]) => ({ activity, count }));

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": countData
	  },
	  	//TODO: Add mark and encoding
	  "mark" : "bar",
	  "encoding": {
		"x": { "field": "activity", "type": "nominal", "sort": "-y", "title": "Activity" },
		"y": { "field": "count", "type": "quantitative", "title": "Tweet count" },
		"tooltip": [
		{ "field": "activity", "type": "nominal" },
		{ "field": "count", "type": "quantitative" }
		]
  		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});