let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	const tweet_array = runkeeper_tweets.map(t => new Tweet(t.text, t.created_at));
  	writtenTweets = tweet_array.filter(t => t.written);
	
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const box = document.getElementById("textFilter");
	const count = document.getElementById("searchCount");
	const text = document.getElementById("searchText");
	const table = document.getElementById("tweetTable");

	box.addEventListener("input", function () {
		const query = box.value.toLowerCase();
		const results = writtenTweets.filter(t => t.writtenText.toLowerCase().includes(query));

		count.textContent = results.length;
		text.textContent = query;
		table.innerHTML = "";

		for (let i = 0; i < results.length; i++) {
			const t = results[i];
			const row = document.createElement("tr");
			row.innerHTML = `
				<th scope="row">${i + 1}</th>
				<td>${t.activityType}</td>
				<td>${t.writtenText}</td>
			`;
			table.appendChild(row);
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});