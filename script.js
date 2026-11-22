
// SATWO STUDIO BOOKING SYSTEM 2027
// Version 0.1 - Frontend Prototype

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

    // Demo dates only.
    // Final dates will be configured later.
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

const summaryDeco =
    document.getElementById("summary-deco");

const summaryDate =
    document.getElementById("summary-date");

const summaryTime =
    document.getElementById("summary-time");

const summaryPax =
    document.getElementById("summary-pax");

const basePrice =
    document.getElementById("base-price");

const extraPrice =
    document.getElementById("extra-price");

const totalPrice =
    document.getElementById("total-price");

date.min = settings.startDate;
date.max = settings.endDate;

// Format currency

function formatMoney(amount) {
    return "RM" + amount.toFixed(2);
}

// Format time

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return displayHour + ":" +
        String(mins).padStart(2, "0") +
        " " + period;
}

// Format date

function formatDate(value) {
    if (!value) return "Not selected";

    const selectedDate =
        new Date(value + "T00:00:00");

    return selectedDate.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

// Generate demo time slots

function generateSlots() {
    time.innerHTML = "";

    const placeholder =
        document.createElement("option");

    placeholder.value = "";

    if (!deco.value) {
        placeholder.textContent =
            "Select a collection first";

        time.appendChild(placeholder);
        time.disabled = true;
        return;
    }

    if (!date.value || !date.checkValidity()) {
        placeholder.textContent =
            "Select a valid date first";

        time.appendChild(placeholder);
        time.disabled = true;
        return;
    }

    placeholder.textContent =
        "Select your preferred time";

    time.appendChild(placeholder);
    time.disabled = false;

    for (
        let minutes = settings.openingTime;
        minutes + settings.slotInterval
            <= settings.closingTime;
        minutes += settings.slotInterval
    ) {

        // Skip studio break

        if (
            minutes < settings.breakEnd &&
            minutes + settings.slotInterval
                > settings.breakStart
        ) {
            continue;
        }

        const option =
            document.createElement("option");

        option.value = formatTime(minutes);

        option.textContent =
            formatTime(minutes) + " - " +
            formatTime(
                minutes + settings.sessionDuration
            );

        time.appendChild(option);
    }
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
        guestCount + " pax";
}

// Update booking summary

function updateSummary() {
    summaryDeco.textContent =
        deco.value || "Not selected";

    summaryDate.textContent =
        date.checkValidity()
            ? formatDate(date.value)
            : "Invalid date";

    summaryTime.textContent =
        time.value || "Not selected";

    document.querySelectorAll(".select-button")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.deco === deco.value
            );
        });

    calculatePrice();
}

// Collection selection buttons

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

// Booking form listeners

deco.addEventListener("change", () => {
    generateSlots();
    updateSummary();
});

date.addEventListener("change", () => {
    generateSlots();
    updateSummary();
});

time.addEventListener(
    "change",
    updateSummary
);

pax.addEventListener(
    "change",
    updateSummary
);

// Initialize prototype

generateSlots();
updateSummary();

console.log(
    "SATWO Studio Booking Prototype Ready"
);
