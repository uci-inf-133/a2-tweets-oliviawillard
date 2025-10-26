class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const txt = this.text.toLowerCase().replace(/\s+/g, ' ').trim();

        if (txt.includes("just completed") || txt.includes("finished") || 
            txt.includes("posted")) {
            return "completed_event";
        }

        if (txt.includes("achieved") || txt.includes("set a goal") || 
            txt.includes("fastest") || txt.includes("new record") || 
            txt.includes("longest")) {
            return "achievement";
        }

        if (txt.includes("watch") || txt.includes("right now") || 
            txt.includes("live")) {
            return "live_event";
        }

        
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        const txt = this.text
            .replace(/#runkeeper/gi, "")
            .replace(/https?:\/\/\S+/g, "")
            .trim();
        
        if (txt.startsWith("Just completed a") && txt.endsWith("Check it out!")) {
            return false;
        }

        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.text
            .replace(/#runkeeper/gi, "")
            .replace(/https?:\/\/\S+/g, "")
            .trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}