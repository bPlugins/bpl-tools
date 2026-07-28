/**
 * Build a YouTube embed URL from any YouTube share/watch/short URL.
 * Returns the original url untouched when no 11-char video id can be found.
 *
 * @param {string}	url
 * @param {object}	[options]
 * @param {boolean}	[options.autoplay=true]
 * @return {string}
 */
export const getYoutubeEmbedSrc = (url, { autoplay = true } = {}) => {
	const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
	const short = url.match(/youtu\.be\/([^#&?]+)/);
	const id = (match && match[2]?.length === 11) ? match[2] : (short && short[1]?.length === 11 ? short[1] : '');
	return id ? `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1` : url;
};
