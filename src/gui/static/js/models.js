class StreamingService {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }

    static fromJSON(json) {
        return new StreamingService(json.name, json.url);
    }
}

class Episode {
    constructor(episodeNumber, title, urls = []) {
        this.episodeNumber = episodeNumber;
        this.title = title;
        this.urls = urls;
    }

    addUrl(streamingService) {
        this.urls.push(streamingService);
    }

    static fromJSON(json) {
        const urls = json.urls ? json.urls.map(url => StreamingService.fromJSON(url)) : [];
        return new Episode(json.episodeNumber, json.title, urls);
    }
}

class Season {
    constructor(season, episodes = []) {
        this.season = season;
        this.episodes = episodes;
    }

    addEpisode(episode) {
        this.episodes.push(episode);
    }

    static fromJSON(json) {
        const episodes = json.episodes ? json.episodes.map(episode => Episode.fromJSON(episode)) : [];
        return new Season(json.season, episodes);
    }
}

class Show {
    constructor(title, url = null, image = null, description = null, seasons = [], status = false) {
        this.title = title;
        this.url = url;
        this.image = image;
        this.description = description;
        this.seasons = seasons;
        this.status = status;
    }

    addSeason(season) {
        this.seasons.push(season);
    }

    updateStatus(status) {
        this.status = status;
    }

    static fromJSON(json) {
        const seasons = json.seasons ? json.seasons.map(season => Season.fromJSON(season)) : [];
        return new Show(json.title, json.url, json.image, json.description, seasons, json.status);
    }
}

class ShowsResponse {
    constructor(shows = [], maxPages, status = false) {
        this.shows = shows;
        this.maxPages = maxPages;
        this.status = status;
    }

    addShow(show) {
        this.shows.push(show);
    }

    updateStatus(status) {
        this.status = status;
    }

    static fromJSON(json) {
        const shows = json.shows ? json.shows.map(show => Show.fromJSON(show)) : [];
        return new ShowsResponse(shows, json.maxPages, json.status);
    }
}

export { ShowsResponse, Show, Season, Episode, StreamingService };