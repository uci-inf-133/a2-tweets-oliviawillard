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
	let completed = tweet_array.filter(t => t.source == "completed_event"); 
	const counts = {}; 
	const removeList = ['other', 'mtn', 'nordic', 'chair', 'mysports', 'circuit', 'activity'];
	completed = completed.filter(t => !removeList.includes(t.activityType));
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
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const perActivityDay = completed.filter(t => top3.includes(t.activityType) && t.distance > 0)
							.map(t => ({activity: t.activityType, day: days[t.time.getDay()], distance: t.distance}));

	

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const countData = Object.entries(counts).map(([activity, count]) => ({ activity, count }));
	console.log("countData", countData);

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values": countData},
	  	//TODO: Add mark and encoding
	  "mark" : "bar",
	  "encoding": {
		"x": { "field": "activity", "type": "nominal", "sort": "-y", "title": "Activity" },
		"y": { "field": "count", "type": "quantitative", "title": "Tweet Count" },
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
		"x": { "field": "day", "type": "ordinal", "sort": days, "title": "time (day)" },
		"y": { "field": "distance", "type": "quantitative", "title": "distance" },
		"color": { "field": "activity", "type": "nominal", "title": "activity" }
	}
	};
	//vegaEmbed('#distanceVis', distanceVis, { actions: false });

	const distanceVisAggregated = {
	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	"data": { "values": perActivityDay },
	"mark": "point",
	"encoding": {
		"x": { "field": "day", "type": "ordinal", "sort": days, "title": "time (day)" },
		"y": { "aggregate": "mean", "field": "distance", "type": "quantitative", "title": "distance" },
		"color": { "field": "activity", "type": "nominal", "title": "activity" }
	}
	};
	
	
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
			vegaEmbed('#distanceVis', distanceVis, { actions: false });
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