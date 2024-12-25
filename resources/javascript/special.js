console.log("special.js");

cur_date = new Date();

const html_style = document.documentElement.style;

// note: if 2 dates overlap, the lower one overrides the higher one
let special_dates = [
    {   // new year
        "start": {"month": 1, "day": 1},
        "end": {"month": 1, "day": 1},
        "border_color": "#ecde69",
        "link_color": "#f0ef19",
        "back_img": "url('/resources/images/special/fireworks.png')"
    },
    { // winter
        "start": {"month": 1, "day": 2},
        "end": {"month": 1, "day": 31},
        "border_color": "#7d8bdb",
        "link_color": "#97d6ed",
        "back_img": "url('/resources/images/special/snow.gif')"
    },
    { // chinese new year
        "start": {"month": 1, "day": 28},
        "end": {"month": 2, "day": 4},
        "border_color": "#ecde69",
        "link_color": "#f0ef19",
        "back_img": "url('/resources/images/special/red_pattern.png')"
    },
    {   // valentines day
        "start": {"month": 2, "day": 14},
        "end": {"month": 2, "day": 14},
        "border_color": "#f7247a",
        "link_color": "#f20f6b",
        "back_img": "url('/resources/images/special/hearts.gif')"
    },
    {   // todo pi day 
        "start": {"month": 3, "day": 14},
        "end": {"month": 3, "day": 14},
        "border_color": "#f7247a",
        "link_color": "#f20f6b",
        "back_img": "url('/resources/images/special/hearts.gif')"
    },
    {   // todo st pats day 
        "start": {"month": 3, "day": 17},
        "end": {"month": 3, "day": 17},
        "border_color": "#f7247a",
        "link_color": "#f20f6b",
        "back_img": "url('/resources/images/special/hearts.gif')"
    },
    {   // todo cherry blossoms (acnl dates)
        "start": {"month": 4, "day": 1},
        "end": {"month": 4, "day": 10},
        "border_color": "#f7247a",
        "link_color": "#f20f6b",
        "back_img": "url('/resources/images/special/hearts.gif')"
    },
    {   // todo gay month
        "start": {"month": 6, "day": 1},
        "end": {"month": 6, "day": 30},
        "border_color": "#f7247a",
        "link_color": "#f20f6b",
        "back_img": "url('/resources/images/special/hearts.gif')"
    },
    {   // todo halloween
        "start": {"month": 10, "day": 31},
        "end": {"month": 10, "day": 31},
        "border_color": "#f7247a",
        "link_color": "#f20f6b",
        "back_img": "url('/resources/images/special/hearts.gif')"
    },
    {   // winter
        "start": {"month": 12, "day": 1},
        "end": {"month": 12, "day": 30},
        "border_color": "#7d8bdb",
        "link_color": "#97d6ed",
        "back_img": "url('/resources/images/special/snow.gif')"
    },
    {   // christmas
        "start": {"month": 12, "day": 19},
        "end": {"month": 12, "day": 26},
        "border_color": "#f52525",
        "link_color": "#f52525",
        "back_img": "url('/resources/images/special/lights.gif')"
    },
    {   // new year
        "start": {"month": 12, "day": 31},
        "end": {"month": 12, "day": 31},
        "border_color": "#ecde69",
        "link_color": "#f0ef19",
        "back_img": "url('/resources/images/special/fireworks.png')"
    }
]

special_dates.forEach(special => {
    date_start = new Date(cur_date.getFullYear(), special.start.month - 1, special.start.day);
    date_end = new Date(cur_date.getFullYear(), special.end.month - 1, special.end.day + 1);

    if (date_start.valueOf() <= cur_date.valueOf() && date_end.valueOf() > cur_date.valueOf()) {
        html_style.setProperty("--border-color", special.border_color);
        html_style.setProperty("--link-color", special.link_color);
        html_style.setProperty("--back-img", special.back_img);
    } 
});
