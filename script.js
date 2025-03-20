const cachedData =
    JSON.parse(localStorage.getItem("user_emoji_collections")) || [];
const mood = document.querySelector(".mood");
const moodTimeline = document.getElementById("mood-timeline");
const calendarView = document.getElementById("calendar-view");
let allData = [...cachedData];

async function displayEmojis() {
    const fetchMood = await fetch("./emojis.json");
    const data = await fetchMood.json();

    data.forEach((emoji) => {
        const li = document.createElement("li");
        li.innerText = emoji.emoji;
        li.setAttribute("aria-label", emoji.name);
        li.classList.add(
            "text-4xl",
            "cursor-pointer",
            "transition",
            "transform",
            "hover:scale-125",
        );
        mood.appendChild(li);
        li.addEventListener("click", (e) => handleEmojiClick(e, emoji));
    });
}

function handleEmojiClick(event, emoji) {
    const name = emoji.name;
    const currentDate = new Date();
    allData = allData.filter((mood) => {
        return (
            new Date(mood.currentDate).toDateString() !==
            currentDate.toDateString()
        );
    });
    allData.push({ name, emoji: emoji.emoji, currentDate });
    localStorage.setItem("user_emoji_collections", JSON.stringify(allData));
    toastr.success(`Mood Today: ${name} ${emoji.emoji}`);
    renderTimeline();
    renderCalendar();
}

function renderTimeline() {
    moodTimeline.innerHTML = allData
        .map((entry) => {
            const date = new Date(entry.currentDate);
            return `<li>${date.toDateString()} - ${entry.name} ${
                entry.emoji
            }</li>`;
        })
        .join("");
}

function renderCalendar() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    const day = document.querySelector(".calendar-dates");
    const currdate = document.querySelector(".calendar-current-date");
    const prenexIcons = document.querySelectorAll(".calendar-navigation span");

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const manipulate = () => {
        let dayone = new Date(year, month, 1).getDay();
        let lastdate = new Date(year, month + 1, 0).getDate();
        let dayend = new Date(year, month, lastdate).getDay();
        let monthlastdate = new Date(year, month, 0).getDate();
        let lit = "";

        for (let i = dayone; i > 0; i--) {
            lit += `<li class="inactive p-4 w-18 h-18 text-xl text-gray-400">${
                monthlastdate - i + 1
            }</li>`;
        }

        for (let i = 1; i <= lastdate; i++) {
            let isToday =
                i === date.getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()
                    ? "bg-blue-500 text-white p-4 font-semibold w-18 h-18 text-xl text-center  rounded-lg"
                    : "bg-black text-white p-4 hover:bg-gray-600 transition w-18 h-18 text-xl text-center duration-200 rounded-lg";

            const savedMoods =
                JSON.parse(localStorage.getItem("user_emoji_collections")) ||
                [];
            const emoji =
                savedMoods.find(
                    (m) =>
                        new Date(m.currentDate).toDateString() ===
                        new Date(year, month, i).toDateString(),
                )?.emoji || "";

            lit += `<li class="${isToday} p-2 cursor-pointer">${i} ${emoji}</li>`;
        }

        for (let i = dayend; i < 6; i++) {
            lit += `<li class="inactive text-gray-500">${i - dayend + 1}</li>`;
        }

        currdate.innerText = `${months[month]} ${year}`;
        day.innerHTML = lit;
    };

    manipulate();

    prenexIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
            month = icon.id === "calendar-prev" ? month - 1 : month + 1;

            if (month < 0 || month > 11) {
                date = new Date(year, month, new Date().getDate());
                year = date.getFullYear();
                month = date.getMonth();
            } else {
                date = new Date();
            }

            manipulate();
        });
    });
}

renderCalendar();
displayEmojis();
renderTimeline();
