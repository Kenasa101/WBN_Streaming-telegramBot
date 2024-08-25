const EUROSTREAMING_API_BASE_URL = "https://eurostreaming-api.cloud.matteosillitti.it";
function errorAlert(message) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
    window.Telegram.WebApp.showAlert("Error: " + message);
}
CURRENT_PAGE = 0;
function loadShows(page = 1) {
    $("#loader").show();
    // Empty the container
    $("#shows-list").empty();

    fetch(EUROSTREAMING_API_BASE_URL + "/shows/" + page).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.status_code !== 200) {
            if (data.status_code === 401) {
                $("#unauthorized").show();
            }
            console.log("Error", data.message);
            errorAlert(data.message);

            $("#loader").hide();

            return;
        }

        CURRENT_PAGE = page;
   
        const shows = data.details;
        const maxPages = shows.maxPages;
        console.log(shows);
        // For every show create a card and append it to the containe
        shows.shows.forEach(show => {
            const card = `
                <div class="flex flex-col items-center">
                    <img src="${show.image}" alt="${show.title}"
                        class="w-32 h-48 object-cover rounded-lg">
                    <p class="text-center text-sm mt-2">${show.title}</p>
                 </div>
            `;
            $("#shows-list").append(card);
        });

        // Pagination
        if (CURRENT_PAGE > 0) {
            $("#shows-next").show();
        } else {
            $("#shows-prev").hide();
        }

        if (CURRENT_PAGE < maxPages - 1) {
            $("#shows-prev").show();
        }

        // Button click events
        $("#shows-prev").click(function () {
            $("#shows-list").empty();
            loadShows(CURRENT_PAGE - 1);
        });

        $("#shows-next").click(function () {
            $("#shows-list").empty();
            loadShows(CURRENT_PAGE + 1);
        });

        $("#shows-pages").val(`${CURRENT_PAGE + 1}/${maxPages}`);

        // Handle value change
        $("#shows-pages").change(function () {
            const value = $(this).val();
            const page = parseInt(value.split("/")[0]);
            loadShows(page - 1);
        });

        $("#loader").hide();

    });
}

$(document).ready(function () {
    console.log("ready!");
    loadShows();

    window.Telegram.WebApp.ready();

});

const TG_INIT_DATA = window.Telegram.WebApp.initData;
// Convert key=val  to {key: val}
const TG_INIT_DATA_DICT = TG_INIT_DATA.split("&").reduce((acc, curr) => {
    const [key, val] = curr.split("=");
    acc[key] = val;
    return acc;
}, {});

const TG_INIT_HASH = TG_INIT_DATA_DICT.hash;