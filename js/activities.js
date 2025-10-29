function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	// Part 2.1

	// activity distribution
	let completedTweets = tweet_array.filter(t => t.source == "completed_event"); 
	const counts = {}; 
	const removeList = ['mtn', 'nordic', 'chair', 'mysports', 'circuit', 'activity'];
	
	completedTweets = completedTweets.filter(t => !removeList.includes(t.activityType));
	for (const t of completedTweets) { 
		const type = t.activityType; 
		if (counts[type]) { 
			counts[type] += 1; 
		} else { 
			counts[type] = 1; 
		} 
	} 
	
	// get number of activities
	const numActivities = Object.keys(counts).length; 
	document.getElementById("numberActivities").textContent = numActivities; 
	
	// get top 3 activities
	let firstAct = "";
	let secondAct = "";
	let thirdAct = "";

	let firstCount = 0;
	let secondCount = 0;
	let thirdCount = 0;

	for (let activity in counts) {
		let count = counts[activity];
		if (count > firstCount) {
			thirdAct = secondAct;
			thirdCount = secondCount;
			secondAct = firstAct;
			secondCount = firstCount;
			firstAct = activity;
			firstCount = count;
		} else if (count > secondCount) {
			thirdAct = secondAct;
			thirdCount = secondCount;
			secondAct = activity;
			secondCount = count;
		} else if (count > thirdCount) {
			thirdAct = activity;
			thirdCount = count;
		}
	}

	document.getElementById("firstMost").textContent = firstAct; 
	document.getElementById("secondMost").textContent = secondAct; 
	document.getElementById("thirdMost").textContent = thirdAct;
	

	// Part 2.2

	// get activity with longest and shortest distance
	const top3 = [firstAct, secondAct, thirdAct];
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	let perActivityDay = [];
	for (const t of completedTweets) {
		if (top3.includes(t.activityType) && t.distance > 0) {
			const dayName = days[t.time.getDay()];
			perActivityDay.push({
				activity: t.activityType,
				day: dayName,
				distance: t.distance
			});
		}
	}

	console.log("help", perActivityDay);

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let countData = [];
	for (let activity in counts) {
		countData.push({
			activity: activity,
			count: counts[activity]
		});
	}
	console.log("countData", countData);

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values": countData},
	  	//TODO: Add mark and encoding
	  "mark" : "bar",
	  "encoding": {
		"x": { 
			"field": "activity", 
			"type": "nominal", 
			"sort": "-y", 
			"title": "Activity" },
		"y": { 
			"field": "count", 
			"type": "quantitative", 
			"title": "Tweet Count" },
  		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});


	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	const distanceVis = {
	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	"data": { "values": perActivityDay },
	"mark": "point",
	"encoding": {
		"x": { 
			"field": "day", 
			"type": "ordinal", 
			"sort": days, 
			"title": "time (day)" },
		"y": { 
			"field": "distance", 
			"type": "quantitative", 
			"title": "distance" },
		"color": { "field": "activity", "type": "nominal", "title": "activity" }
	}
	};

	const distanceVisAggregated = {
	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	"data": { "values": perActivityDay },
	"mark": "point",
	"encoding": {
		"x": { 
			"field": "day", 
			"type": "ordinal", 
			"sort": days, 
			"title": "time (day)" },
		"y": { 
			"aggregate": "mean", 
			"field": "distance", 
			"type": "quantitative", 
			"title": "distance" },
		"color": { "field": "activity", "type": "nominal", "title": "activity" }
	}
	};
	
	vegaEmbed('#distanceVis', distanceVis, { actions: false });
	
	const meanGraph = document.getElementById('distanceVisAggregated');
	const pointGraph = document.getElementById('distanceVis');

	// graph buttons
	document.getElementById('aggregate').addEventListener('click', function() {
		if (meanGraph.style.display === 'none') {
			vegaEmbed('#distanceVisAggregated', distanceVisAggregated, { actions: false });
			meanGraph.style.display = '';
			pointGraph.style.display = 'none';
			this.textContent = 'Show all activities';
		} else {
			pointGraph.style.display = '';
			meanGraph.style.display = 'none';
			this.textContent = 'Show means';
		}
	}); 

	// hard code values
	document.getElementById('longestActivityType').textContent = 'bike'; 
	document.getElementById('shortestActivityType').textContent = 'walk';  
	document.getElementById('weekdayOrWeekendLonger').textContent = 'weekends'; 
}
//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});