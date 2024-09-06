function errorAlert(message) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
    window.Telegram.WebApp.showAlert("Error: " + message);
}

let CURRENT_PAGE = 1;
function loadShows(search = "") {
    $("#loader").removeClass("hidden");
    // Empty the container
    $("#shows-list").empty();
    let URL = EUROSTREAMING_API_BASE_URL + "/shows/" + CURRENT_PAGE;
    if (search !== "") {
        CURRENT_PAGE = 1;
        URL =
            EUROSTREAMING_API_BASE_URL +
            "/search?q=" +
            search +
            "&page=" +
            CURRENT_PAGE;
    }

    fetch(URL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.status_code !== 200) {
                if (data.status_code === 401) {
                    $("#unauthorized").removeClass("hidden");
                }
                console.log("Error", error);
                $("#loader").addClass("hidden");
                $("#error").removeClass("hidden");
                errorAlert(error.message);

                return;
            }

            const shows = data.details;
            const maxPages = shows.maxPages;

            // Pagination
            if (CURRENT_PAGE === 1) {
                $("#shows-prev").addClass("hidden");
            } else {
                $("#shows-prev").removeClass("hidden");
            }

            if (CURRENT_PAGE === maxPages) {
                $("#shows-next").addClass("hidden");
            } else {
                $("#shows-next").removeClass("hidden");
            }

            console.log("maxPages", maxPages);
            console.log("CURRENT_PAGE", CURRENT_PAGE);

            $("#shows-page").val(CURRENT_PAGE);
            $("#shows-total-pages").text(maxPages);

            // For every show create a card and append it to the containe
            shows.shows.forEach((show) => {
                const card = `
                <div class="flex flex-col items-center show-card" data-path="${show.path}">
                    <div class="relative w-32 h-48">
                        <!-- Skeleton loader -->
                        <div class="absolute inset-0 bg-gray-300 animate-pulse rounded-lg skeleton"></div>
                        <!-- Immagine -->
                        <img src="${show.image}" alt="${show.title}" loading="lazy"
                            class="w-32 h-48 object-cover rounded-lg opacity-0 transition-opacity duration-500"
                            onload="this.classList.remove('opacity-0'); this.previousElementSibling.remove();">
                    </div>
                    <p class="text-center text-sm mt-2">${show.title}</p>
                </div>
                `;
                $("#shows-list").append(card);
            });
            

            $("#loader").addClass("hidden");
        })
        .catch(function (error) {
            console.log("Error", error);
            $("#loader").addClass("hidden");
            $("#error").removeClass("hidden");
            errorAlert(error.message);
        });
}

function watchEpisode(episode) {
    $("#watch-episode-title").text(episode.episodeNumber + " - " + episode.title);
    $("#watch-episode-links").empty();
    episode.urls.forEach((link) => {
        $("#watch-episode-links").append(`
            <a href="${link.url}" target="_blank" class="text-blue-500 hover:underline">${link.name}</a><br>
        `);
    });

    $("#watch-episode-modal").removeClass("hidden");

    // Close modal
    $("#watch-episode-close").click(function () {
        $("#watch-episode-modal").addClass("hidden");
    });
}

function appendEpisodes(episodes) {
    $("#episode-list").empty();
    episodes.forEach((episode) => {
        $("#episode-list").append(`
            <div class="flex flex-row items-center justify-between p-2">
                <p class="text-sm">${episode.episodeNumber}</p>
                <p class="text-sm">${episode.title}</p>

                <button class="watch-episode-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-7 text-color">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                    </svg>
                </button>               
            </div>
            <hr class="my-2">
        `);
    });

    $(".watch-episode-btn").off("click");
    $(".watch-episode-btn").click(function () {
        const episodeIndex = $(".watch-episode-btn").index(this);
        watchEpisode(episodes[episodeIndex]);
    });
}

function openShow(path) {
    $("#loader").removeClass("hidden");

    fetch(EUROSTREAMING_API_BASE_URL + "/show?path=" + path)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.status_code !== 200) {
                if (data.status_code === 401) {
                    $("#unauthorized").removeClass("hidden");
                }
                console.log("Error", error);
                $("#loader").addClass("hidden");
                $("#error").removeClass("hidden");
                errorAlert(error.message);

                return;
            }

            const show = data.details;
            console.log("Show", show);

            // Go up to the top of the page
            window.scrollTo(0, 0);

            $("#show-title").text(show.title);
            $("#show-description").text(show.description);
            $("#show-banner").attr("src", show.image);

            $("#season-selector").empty();
            show.seasons.forEach((season) => {
                let index = show.seasons.indexOf(season);
                $("#season-selector").append(
                    `<option value="${index}">${season.season}</option>`
                );
            });

            // Handle season change
            $("#season-selector").off("change");
            $("#season-selector").change(function () {
                const seasonIndex = parseInt($(this).val());
                appendEpisodes(show.seasons[seasonIndex].episodes);
            });

            // Append episodes of first season
            appendEpisodes(show.seasons[0].episodes);

            // Hide shows list
            $("#show-div").addClass("hidden");

            // Show show-episodes-div
            $("#show-episodes-div").removeClass("hidden");

            // hide loader
            $("#loader").addClass("hidden");

            // Show back button
            window.Telegram.WebApp.BackButton.show();
            // Handle back button click
            window.Telegram.WebApp.BackButton.onClick(() => {
                $("#show-div").removeClass("hidden");
                $("#show-episodes-div").addClass("hidden");
                window.Telegram.WebApp.BackButton.hide();
            });

        })
        .catch(function (error) {
            console.log("Error", error);
            $("#loader").addClass("hidden");
            $("#error").removeClass("hidden");
            errorAlert(error.message);
        });
}

$(document).ready(function () {
    console.log("ready!");
    loadShows();

    window.Telegram.WebApp.expand();

    window.Telegram.WebApp.ready();

    // Button click events
    $("#shows-prev").click(function () {
        $("#shows-list").empty();
        CURRENT_PAGE--;
        loadShows();
    });

    $("#shows-next").click(function () {
        $("#shows-list").empty();
        CURRENT_PAGE++;
        loadShows();
    });

    // Handle value change of contenteditable element on enter
    $("#shows-page").keypress(function (e) {
        if (e.which === 13) {
            const page = parseInt($("#shows-page").val());
            if (page > 0) {
                CURRENT_PAGE = page;
                $("#shows-list").empty();
                loadShows();
            }
        }
    });

    // search
    $("#search").keypress(function (e) {
        if (e.which === 13) {
            const search = $("#search").val();
            if (search !== "") {
                CURRENT_PAGE = 1;
                $("#shows-list").empty();
                loadShows(search);
            }
        }
    });

    // close keyboard when touch outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#shows-page").length) {
            $("#shows-page").blur();
        }
    });

    // Show card handle
    $(document).on("click", ".show-card", function () {
        const path = $(this).data("path");
        openShow(path);
    });
});

const TG_INIT_DATA = window.Telegram.WebApp.initData;
// Convert key=val  to {key: val}
const TG_INIT_DATA_DICT = TG_INIT_DATA.split("&").reduce((acc, curr) => {
    const [key, val] = curr.split("=");
    acc[key] = val;
    return acc;
}, {});

const TG_INIT_HASH = TG_INIT_DATA_DICT.hash;