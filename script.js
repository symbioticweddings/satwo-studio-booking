
// SATWO STUDIO BOOKING SYSTEM 2027
// Version 0.3 - Interactive Time Slot Grid

const settings = {
    normalPrice: 160,
    rayaPrice: 210,
    includedPax: 8,
    extraPaxPrice: 15,
    maxPax: 15,
    sessionDuration: 20,
    slotInterval: 30,
    openingTime: 9 * 60,
    closingTime: 23 * 60 + 30,
    breakStart: 18 * 60,
    breakEnd: 20 * 60,

    // Temporary demo dates
    startDate: "2027-02-08",
    endDate: "2027-03-19",
    rayaDates: [
        "2027-03-10",
        "2027-03-11"
    ]
};

const deco = document.getElementById("deco");
const date = document.getElementById("date");
const time = document.getElementById("time");
const pax = document.getElementById("pax");
const timeSlots = document.getElementById("time-slots");

const summaryDeco = document.getElementById("summary-deco");
const summaryDate = document.getElementById("summary-date");
const summaryTime = document.getElementById("summary-time");
const summaryPax = document.getElementById("summary-pax");

const basePrice = document.getElementById("base-price");
const extraPrice = document.getElementById("extra-price");
const totalPrice = document.getElementById("total-price");

date.min = settings.startDate;
date.max = settings.endDate;

// Format currency

function formatMoney(amount) {
    return "RM" + amount.toFixed(2);
}

// Malay time format

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;

    let period;

    if (hours === 0) {
        period = "tengah malam";
    } else if (hours < 12) {
        period = "pagi";
    } else if (hours === 12) {
        period = "tengah hari";
    } else if (hours < 19) {
        period = "petang";
    } else {
        period = "malam";
    }

    return (hours % 12 || 12) + ":" +
        String(mins).padStart(2, "0") +
        " " + period;
}

// Internal 24-hour format

function formatTimeValue(minutes) {
    return String(Math.floor(minutes / 60))
        .padStart(2, "0") + ":" +
        String(minutes % 60).padStart(2, "0");
}

// Malay date format

function formatDate(value) {
    if (!value) return "Belum dipilih";

    return new Date(value + "T00:00:00")
        .toLocaleDateString("ms-MY", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

// Generate interactive time slots

function generateSlots() {

    timeSlots.innerHTML = "";
    time.value = "";

    if (!deco.value || !date.value ||
        !date.checkValidity()) {

        timeSlots.innerHTML = `
            <p class="slot-placeholder">
                Sila pilih dekorasi dan tarikh dahulu.
            </p>
        `;

        return;
    }

    // Slot legend

    const legend = document.createElement("div");

    legend.className = "slot-legend";

    legend.innerHTML = `
        <span>
            <i class="legend-dot"></i>
            Slot kosong
        </span>
        <span>
            <i class="legend-dot selected"></i>
            Dipilih
        </span>
        <span>
            <i class="legend-dot booked"></i>
            Penuh
        </span>
    `;

    timeSlots.appendChild(legend);

    // Session groups

    const groups = [
        {
            title: "Sesi pagi",
            start: 9 * 60,
            end: 12 * 60
        },
        {
            title: "Sesi tengah hari",
            start: 12 * 60,
            end: 13 * 60,
            className: "midday"
        },
        {
            title: "Sesi petang",
            start: 13 * 60,
            end: 18 * 60
        },
        {
            title: "Sesi malam",
            start: 20 * 60,
            end: 23 * 60 + 30
        }
    ];

    groups.forEach((group, index) => {

        // Studio break notice

        if (index === 3) {

            const breakBox =
                document.createElement("div");

            breakBox.className = "slot-break";

            breakBox.innerHTML = `
                <strong>Waktu rehat studio</strong>
                <span>
                    6:00 petang – 8:00 malam
                </span>
            `;

            timeSlots.appendChild(breakBox);
        }

        const section =
            document.createElement("div");

        const heading =
            document.createElement("div");

        heading.className = "slot-group-title";
        heading.textContent = group.title;

        section.appendChild(heading);

        const grid = document.createElement("div");

        grid.className = "slot-grid";

        if (group.className) {
            grid.classList.add(group.className);
        }

        // Create slot buttons

        for (
            let minutes = group.start;
            minutes + settings.slotInterval <= group.end;
            minutes += settings.slotInterval
        ) {

            const button =
                document.createElement("button");

            button.type = "button";
            button.className = "slot-button";

            button.textContent = formatTime(minutes);
            button.dataset.time = formatTimeValue(minutes);

            button.setAttribute("aria-pressed", "false");

            button.addEventListener("click", () => {

                document.querySelectorAll(".slot-button")
                    .forEach(slot => {
                        slot.classList.remove("active");
                        slot.setAttribute(
                            "aria-pressed", "false"
                        );
                    });

                button.classList.add("active");

                button.setAttribute(
                    "aria-pressed", "true"
                );

                time.value = button.dataset.time;

                updateSummary();
            });

            grid.appendChild(button);
        }

        section.appendChild(grid);
        timeSlots.appendChild(section);
    });

    const note = document.createElement("p");

    note.className = "booking-note";

    note.textContent =
        "Setiap sesi fotografi berdurasi 20 minit.";

    timeSlots.appendChild(note);
}

// Calculate booking price

function calculatePrice() {

    const guestCount = Number(pax.value);

    const isRaya =
        settings.rayaDates.includes(date.value);

    const sessionPrice = isRaya
        ? settings.rayaPrice
        : settings.normalPrice;

    const additionalGuests = Math.max(
        0,
        guestCount - settings.includedPax
    );

    const additionalPrice =
        additionalGuests * settings.extraPaxPrice;

    const total = sessionPrice + additionalPrice;

    basePrice.textContent =
        formatMoney(sessionPrice);

    extraPrice.textContent =
        formatMoney(additionalPrice);

    totalPrice.textContent =
        formatMoney(total);

    summaryPax.textContent =
        guestCount + " orang";
}

// Update booking summary

function updateSummary() {

    summaryDeco.textContent =
        deco.value || "Belum dipilih";

    summaryDate.textContent =
        date.checkValidity()
            ? formatDate(date.value)
            : "Tarikh tidak sah";

    if (time.value) {

        const [hours, minutes] =
            time.value.split(":").map(Number);

        const start = hours * 60 + minutes;

        summaryTime.textContent =
            formatTime(start) + " – " +
            formatTime(start + settings.sessionDuration);

    } else {

        summaryTime.textContent =
            "Belum dipilih";
    }

    document.querySelectorAll(".select-button")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.deco === deco.value
            );
        });

    calculatePrice();
}

// Collection selection

document.querySelectorAll(".select-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            deco.value = button.dataset.deco;

            generateSlots();
            updateSummary();

            document.getElementById("booking")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });
    });

// Event listeners

deco.addEventListener("change", () => {
    generateSlots();
    updateSummary();
});

date.addEventListener("change", () => {
    generateSlots();
    updateSummary();
});

pax.addEventListener("change", updateSummary);

// Initialize prototype

generateSlots();
updateSummary();

console.log("SATWO Studio V0.3 Ready");
