(function () {
	'use strict';

	const tweet = nodecg.Replicant('tweet');

	Polymer({
		is: 'toth-tweet',

		properties: {
			profileUrl: {
				type: String,
				computed: 'computeProfileUrl(screenName)'
			},
			tweetUrl: {
				type: String,
				computed: 'computeTweetUrl(profileUrl, id)'
			}
		},

		computeProfileUrl(screenName) {
			return `https://twitter.com/${screenName}`;
		},

		computeTweetUrl(profileUrl, id) {
			return `${profileUrl}/status/${id}`;
		},

		computePhotoOrPhotos(numPhotos) {
			return numPhotos > 1 ? 'photos' : 'photo';
		},

		computeIndexPlusOne(index) {
			return index + 1;
		},

		ready() {
			tweet.on('change', newVal => {
				if (typeof newVal !== 'object') {
					return;
				}

				this.avatarUrl = newVal.avatarUrl;
				this.name = newVal.name;
				this.screenName = newVal.screenName;
				this.images = newVal.images;
				this.id = newVal.id;
				this.createdAt = newVal.createdAt;
				Polymer.dom(this.$.body).innerHTML = newVal.body;
			});
		}
	});
})();
