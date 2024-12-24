console.log("special.js");

cur_date = new Date();

const html_style = document.documentElement.style;

let special_dates = [
    {   // new year
        "start": {"month": 1, "day": 1},
        "end": {"month": 1, "day": 1},
        "border_color": "#ecde69",
        "link_color": "#f0ef19",
        "back_img": "url('/resources/images/special/snow.gif')"
    },
    { // chinese new year
        "start": {"month": 1, "day": 28},
        "end": {"month": 2, "day": 4},
        "border_color": "#ecde69",
        "link_color": "#f0ef19",
        "back_img": "url('/resources/images/special/red_pattern.png')"
    },
    {   // winter
        "start": {"month": 12, "day": 1},
        "end": {"month": 12, "day": 30},
        "border_color": "#7d8bdb",
        "link_color": "#97d6ed",
        "back_img": "url('/resources/images/special/snow.gif')"
    },
    {   // new year
        "start": {"month": 12, "day": 31},
        "end": {"month": 12, "day": 31},
        "border_color": "#ecde69",
        "link_color": "#f0ef19",
        "back_img": "url('/resources/images/special/snow.gif')"
    }
]

special_dates.forEach(special => {
    date_start = new Date(cur_date.getFullYear(), special.start.month - 1, special.start.day);
    date_end = new Date(cur_date.getFullYear(), special.end.month - 1, special.end.day + 1);

    if (date_start.valueOf() <= cur_date.valueOf() && date_end.valueOf() >= cur_date.valueOf()) {
        html_style.setProperty("--border-color", special.border_color);
        html_style.setProperty("--link-color", special.link_color);
        html_style.setProperty("--back-img", special.back_img)
    } 

});
