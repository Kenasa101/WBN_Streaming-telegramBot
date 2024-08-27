const EUROSTREAMING_API_BASE_URL = "https://eurostreaming-api.cloud.matteosillitti.it";
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
        URL = EUROSTREAMING_API_BASE_URL + "/search?q=" + search + "&page=" + CURRENT_PAGE;
    }
        
    fetch(URL).then(function (response) {
        return response.json();
    }).then(function (data) {
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
        shows.shows.forEach(show => {
            const card = `
                <div class="flex flex-col items-center show-card" data-path="${show.path}">
                    <img src="${show.image}" alt="${show.title}"
                        class="w-32 h-48 object-cover rounded-lg">
                    <p class="text-center text-sm mt-2">${show.title}</p>
                 </div>
            `;
            $("#shows-list").append(card);
        });

        $("#loader").addClass("hidden");
    }).catch(function (error) {
        console.log("Error", error);
        $("#loader").addClass("hidden");
        $("#error").removeClass("hidden");
        errorAlert(error.message);

    });
}

function openShow(path) {
    $("#loader").removeClass("hidden");

    fetch(EUROSTREAMING_API_BASE_URL + "/show?path=" + path).then(function (response) {
        return response.json();
    }).then(function (data) {
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

        $("#show-title").text(show.title);
        $("#show-description").text(show.description);
        $("#show-banner").attr("src", show.image);

        $("#season-selector").empty();
        show.seasons.forEach(season => {
            $("#season-selector").append(`<option value="${season.season}">Season ${season.season}</option>`);
        });

        $("#episode-list").empty();
        show.seasons[0].episodes.forEach(episode => {
            $("#episode-list").append(`
                <div class="flex flex-row items-center justify-between p-2 border-b border-gray-200">
                    <p class="text-sm">${episode.title}</p>
                    <p class="text-sm">${episode.episodeNumber}</p>

                    <button class="font-bold py-1 px-2 rounded-full">
                        Watch
                    </button>
        
                </div>

            `);
        });




        // Hide shows list
        $("#show-div").addClass("hidden");

        // Show show-episodes-div
        $("#show-episodes-div").removeClass("hidden");


        // hide loader
        $("#loader").addClass("hidden");

    }).catch(function (error) {
        console.log("Error", error);
        $("#loader").addClass("hidden");
        $("#error").removeClass("hidden");
        errorAlert(error.message);

    });
}
 

$(document).ready(function () {
    console.log("ready!");
    loadShows();

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