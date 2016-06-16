# toth3-overlay
The main broadcast assets for [Tip of the Hats 2015](http://tipofthehats.org/).

This is a [NodeCG](http://github.com/nodecg/nodecg) bundle. It cannot be run on its own, it has to be run as part of an existing NodeCG installation. Please see NodeCG's documentation for installation and setup instructions before continuing with toth3-overlay setup.

# Demo
[Click here](https://youtu.be/Z4-qaya5-0Y) to watch a video explaining the function and purpose of this graphics package.

## Installation
1. Install NodeCG (don't forget to run `npm install` from your the root of your NodeCG installation directory after you have installed it! This is what installs all of NodeCG's dependencies, which are required.)
2. Clone toth3-overlay to `nodecg/bundles/toth3-overlay`
3. Create `nodecg/cfg/toth3-overlay.json`. This is the config file.

## Configuration
The config lives at `nodecg/cfg/toth3-overlay.json`. The config is required for the "now playing" and Twitter graphics. It is also required to receive live donations, but chances are that you don't have your own instance of the [Games Done Quick donation tracker](https://github.com/uraniumanchor/sda-donation-tracker-2) running, so you don't need to worry about that.

If you don't have Twitter or Last.fm API credentials, you must make them before attempting to use the "now playing" and Twitter graphics. Check their developer sites for more info on how to register.
```
{
    "donationKey": "yourDonationKey",
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
    }
}
```

## Usage
Start up NodeCG. By default, the dashboard can be accessed from `http://localhost:9090/`. Of course, if you have edited your NodeCG config, then that may no longer be the url from which you can access the dashboard. Adjust accordingly.

After you've confirmed that the dashboard is loading correctly, you can access the graphics from `http://localhost:9090/view/toth3-overlay` and `http://localhost:9090/view/toth3-overlay/dotafortress.html`. Both of these graphics are 1080p60 and can be added to OBS, Xsplit, or CasparCG as browser sources with that resolution and framerate.

## Credits
- [Alex "Lange" Van Camp](http://alexvan.camp/) - Developer and Designer
- [Anthony "Airon" Oetzmann](http://aironaudio.weebly.com/) - Sound Design
