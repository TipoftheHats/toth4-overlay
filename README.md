# toth4-overlay
The main broadcast assets for [Tip of the Hats 2016](http://tipofthehats.org/).

This is a [NodeCG](http://github.com/nodecg/nodecg) bundle. It cannot be run on its own, it has to be run as part of an existing NodeCG installation. Please see NodeCG's documentation for installation and setup instructions before continuing with toth4-overlay setup.

# Demo
[Click here](https://youtu.be/F0xGN-aSytA) to watch a video explaining the function and purpose of this graphics package.

## Installation
1. Install NodeCG (don't forget to run `npm install` and `bower install` from your the root of your NodeCG installation directory after you have installed it! This is what installs all of NodeCG's dependencies, which are required.)
2. Clone toth4-overlay to `nodecg/bundles/toth4-overlay`
3. Create `nodecg/cfg/toth4-overlay.json`. This is the config file.

## Configuration
The config lives at `nodecg/cfg/toth4-overlay.json`. The config is required many asepects of toth4-overlay's functionality. 
It is also required to receive live donations, but chances are that you don't have your own instance of the [Games Done Quick donation tracker](https://github.com/GamesDoneQuick/donation-tracker) running, so you don't need to worry about that.

To receive donations from an instance of the GDQ Donation Tracker, you'll need to set up an instance of [donation-socket-repeater](https://github.com/TipoftheHats/donation-socket-repeater).
We had to make this little program because we were behind a very restrictive firewall at the venue where ToTH2016 was held,
and having the tracker send donations directly to us via HTTP POSTS wasn't a viable approach. Instead, the donations are
sent to this little server app running off-site, which then establishes a websocket connection to the graphics running on-site,
which does not need any special firewall rules or port forwarding.

`useMockData` pulls from [Lange](https://github.com/Lange)'s dropbox with some placeholder data. Feel free to examine the code 
([1](https://github.com/TipoftheHats/toth4-overlay/blob/932bdbe87392c16d43140620e07c81d23447ecdd/extension/bids.js#L41), 
[2](https://github.com/TipoftheHats/toth4-overlay/blob/932bdbe87392c16d43140620e07c81d23447ecdd/extension/completed-challenges.js#L23)) 
and edit to point to whatever URL you want so you can set up your own mock data.

If you don't have Twitter or Last.fm API credentials, you must make them before attempting to use the "now playing" and 
Twitter graphics. Check their developer sites for more info on how to register.
```
{
	"useMockData": true,
	"donationSocketUrl": "the.address.of.your.instance.of.donation-socket-repeater",
	"twitter": {
		"consumerKey": "yourConsumerKey",
		"consumerSecret": "yourConsumerSecret",
		"accessTokenKey": "yourAccessTokenKey",
		"accessTokenSecret": "yourAccessTokenSecret"
	},
	 "lastfm": {
		"targetAccount": "yourLastfmAccount",
		"apiKey": "yourApiKey",
		"secret": "yourSecret"
	},
	"scraptf": {
		"apiKey": "yourScrapTFAPIKey (talk to Geel if you need one)",
		"fundraiserId": "yourScrapTFFundraiseID (talk to Geel about making a fundraiser)"
	},
	"x32": {
		"address": "your.behringer.x32.ip",
		"techDirectorMicChannel": 14,
		"floorManagerMicChannel": 16,
		"couchMixBus": 1,
		"hostMixBus": 3,
		"player1MixBus": 9,
		"player2MixBus": 11,
		"player3MixBus": 13,
		"player4MixBus": 15
	}
}
```

## Usage
Start up NodeCG. By default, the dashboard can be accessed from `http://localhost:9090/`. Of course, 
if you have edited your NodeCG config, then that may no longer be the url from which you can access the dashboard. 
Adjust accordingly.

After you've confirmed that the dashboard is loading correctly, you can access the graphics from 
`http://localhost:9090/graphics/toth4-overlay` and `http://localhost:9090/graphics/toth4-overlay/dotafortress.html`. 
Both of these graphics are 1080p60 and can be added to OBS or vMix as browser sources with that resolution and framerate.

## Credits
- [Alex "Lange" Van Camp](http://alexvan.camp/) - Developer & Designer
- [Chris Hanel](http://chrishanel.com/) - Developer & Designer
- [Erin "erynn" B.](https://github.com/erynnb) - Developer
- [Anthony "Airon" Oetzmann](http://aironaudio.weebly.com/) - Sound Design
