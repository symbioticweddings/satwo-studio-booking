
// SATWO STUDIO BOOKING SYSTEM 2027
// Version 0.3 - Interactive Time Slot Grid

const settings = {
    normalPrice: 160,
    rayaPrice: 220,
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
function updatePaxOptions() {
  const isKlasik = deco.value === "Klasik";
  const maxPax = isKlasik ? 25 : 15;

  Array.from(pax.options).forEach((option) => {
    option.disabled = Number(option.value) > maxPax;
    option.hidden = Number(option.value) > maxPax;
  });

  if (Number(pax.value) > maxPax) {
    pax.value = String(maxPax);
  }
}
const timeSlots = document.getElementById("time-slots");

const firstSlotCompact =
    document.getElementById("first-slot-compact");

const firstSlotSelectedTime =
    document.getElementById("first-slot-selected-time");

const editFirstSlotBtn =
    document.getElementById("edit-first-slot");

function collapseFirstSlot() {
    if (!time.value) return;

    const [hours, minutes] = time.value.split(":").map(Number);
    const start = hours * 60 + minutes;

    firstSlotSelectedTime.textContent =
        formatTime(start) + " – " +
        formatTime(start + settings.sessionDuration);

    timeSlots.hidden = true;
    firstSlotCompact.hidden = false;
}

function expandFirstSlot() {
    timeSlots.hidden = false;
    firstSlotCompact.hidden = true;
}

editFirstSlotBtn.addEventListener("click", () => {
    expandFirstSlot();
});

// Extra slot elements
const extraSlotSection =
  document.getElementById("extra-slot-section");

const addSlotBtn =
  document.getElementById("add-slot-btn");

const extraSlotContainer =
  document.getElementById("extra-slot-container");

const extraTimeSlots =
  document.getElementById("extra-time-slots");

// Masa slot kedua
let extraSlotTime = "";
let hasExtraSlot = false;
function resetExtraSlot() {
  extraSlotTime = "";
  hasExtraSlot = false;

  extraSlotContainer.hidden = true;
  extraTimeSlots.innerHTML = "";

  addSlotBtn.textContent = "+ Tambah Slot";
}
// Paparkan butang tambah slot apabila dekorasi dan tarikh dipilih
function updateExtraSlotSection() {
  const ready = Boolean(
    deco.value && date.value && date.checkValidity()
  );

  extraSlotSection.hidden = !ready;
}

// Buka atau tutup pilihan slot kedua
addSlotBtn.addEventListener("click", () => {
  if (!deco.value || !date.value || !time.value) {
    alert("Sila pilih dekorasi, tarikh dan masa slot pertama dahulu.");
    return;
  }

  if (hasExtraSlot) {
    resetExtraSlot();
  } else {
    hasExtraSlot = true;
      generateExtraTimeSlots();
    extraSlotContainer.hidden = false;
    addSlotBtn.textContent = "− Buang Slot Tambahan";
      collapseFirstSlot();
  }

  updateSummary();
});
const summaryDeco = document.getElementById("summary-deco");
const summaryDate = document.getElementById("summary-date");
const summaryTime = document.getElementById("summary-time");
const summaryPax = document.getElementById("summary-pax");

const basePrice = document.getElementById("base-price");
const extraPrice = document.getElementById("extra-price");
const totalPrice = document.getElementById("total-price");

date.min = settings.startDate;
date.max = settings.endDate;
function generateExtraTimeSlots() {
  extraTimeSlots.innerHTML = "";
  extraSlotTime = "";

  if (!time.value) return;

  const selectedTime = time.value;

  timeSlots.querySelectorAll(".slot-button").forEach(slot => {
    const slotTime = slot.dataset.time;

    // Jangan benarkan masa yang sama dengan Slot 1
    if (slotTime === selectedTime || slot.disabled) return;

    const button = document.createElement("button");

    button.type = "button";
    button.className = "slot-button";
    button.textContent = slot.textContent;
    button.dataset.time = slotTime;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      extraTimeSlots.querySelectorAll(".slot-button").forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      extraSlotTime = slotTime;
      updateSummary();
    });

    extraTimeSlots.appendChild(button);
  });
}
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

                timeSlots.querySelectorAll(".slot-button")
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

// Kosongkan pilihan slot kedua jika masa sama
if (extraSlotTime === time.value) {
  extraSlotTime = "";

  extraTimeSlots.querySelectorAll(".slot-button")
    .forEach(slot => {
      slot.classList.remove("active");
      slot.setAttribute("aria-pressed", "false");
    });
}

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

    const slotCount = hasExtraSlot && extraSlotTime ? 2 : 1;
    document.getElementById("summary-slot-count").textContent =
    (time.value ? slotCount : 0) + " slot";

const totalSessionPrice = sessionPrice * slotCount;

const total = totalSessionPrice + additionalPrice;


    extraPrice.textContent =
        formatMoney(additionalPrice);

    totalPrice.textContent =
        formatMoney(total);

    summaryPax.textContent =
    guestCount + " orang";

basePrice.textContent =
    formatMoney(totalSessionPrice) +
    " (" + slotCount + " slot)";
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

    const extraTimeSummary =
    document.getElementById("summary-extra-time");

if (extraTimeSummary) {
    const extraRow = extraTimeSummary.closest(".summary-row");

    if (hasExtraSlot && extraSlotTime) {
        const [h, m] = extraSlotTime.split(":").map(Number);
        const extraStart = h * 60 + m;

        extraTimeSummary.textContent =
            formatTime(extraStart) + " – " +
            formatTime(extraStart + settings.sessionDuration);

        extraRow.style.display = "";
    } else {
        extraTimeSummary.textContent = "Belum dipilih";
        extraRow.style.display = "none";
    }
}

calculatePrice();
updateExtraSlotSection();

if (document.getElementById("continue-booking")) {
    updateContinueButton();
}
}

// Collection selection

document.querySelectorAll(".select-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            deco.value = button.dataset.deco;
            resetExtraSlot();
updatePaxOptions();
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
  resetExtraSlot();
  updatePaxOptions();
  generateSlots();
  updateSummary();
});

date.addEventListener("change", () => {
  resetExtraSlot();
  generateSlots();
  updateSummary();
});
function updatePaxOptions() {
  const maxPax = deco.value === "Klasik" ? 25 : 15;

  // Paparkan pilihan pax mengikut dekorasi
  Array.from(pax.options).forEach(option => {
    const count = Number(option.value);
    option.hidden = count > maxPax;
    option.disabled = count > maxPax;
  });

  // Reset kepada 8 orang jika melebihi kapasiti
  if (Number(pax.value) > maxPax) {
    pax.value = "8";
  }

  // Tukar nota mengikut dekorasi
  const note = document.getElementById("pax-limit-note");

  if (deco.value === "Klasik") {
    note.textContent =
      " Klasik: maksimum 25 orang dengan 2 slot.";
  } else if (deco.value === "Minimal") {
    note.textContent =
      " Minimal: maksimum 15 orang.";
  } else {
    note.textContent = "";
  }
}
pax.addEventListener("change", updateSummary);

// Initialize prototype

// Initialize prototype


console.log("SATWO Studio V0.3 Ready");


// Customer booking navigation

const continueBookingBtn =
    document.getElementById("continue-booking");

const customerStep =
    document.getElementById("customer-step");

const backToBookingBtn =
    document.getElementById("back-to-booking");

function updateContinueButton() {

    const guestCount = Number(pax.value);

    const secondSlotReady =
        hasExtraSlot && !!extraSlotTime;

    const maxGuests =
        deco.value === "Klasik" && secondSlotReady
        ? 25 : 15;

    const ready =
        !!deco.value &&
        !!date.value &&
        date.checkValidity() &&
        !!time.value &&
        guestCount > 0 &&
        guestCount <= maxGuests &&
        (!hasExtraSlot || secondSlotReady);

    continueBookingBtn.disabled = !ready;
}

continueBookingBtn.addEventListener("click", () => {

    updateContinueButton();

    if (continueBookingBtn.disabled) return;

    customerStep.hidden = false;

    customerStep.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

backToBookingBtn.addEventListener("click", () => {

    customerStep.hidden = true;

    document.getElementById("booking")
        .scrollIntoView({
            behavior: "smooth"
        });
});

updatePaxOptions();
generateSlots();
updateSummary();
updateExtraSlotSection();
updateContinueButton();
// Customer form validation

const customerForm = customerStep.querySelector("form");
const paymentBtn = document.getElementById("continue-payment");

const nameInput = customerForm.querySelector('input[type="text"]');
const phoneInput = customerForm.querySelector('input[type="tel"]');
const emailInput = document.getElementById("customer-email");

function validateCustomerForm() {

    const validName =
        nameInput.value.trim().length >= 2;

    const phone =
        phoneInput.value.replace(/[\s-]/g, "");

    const validPhone =
        /^\+?[0-9]{8,15}$/.test(phone);

    const validEmail =
        emailInput.value.trim() !== "" &&
        emailInput.checkValidity();

    paymentBtn.disabled =
        !(validName && validPhone && validEmail);
}

customerForm.addEventListener("input", validateCustomerForm);

customerForm.addEventListener("submit", (event) => {
    event.preventDefault();
});

validateCustomerForm();

// Payment deposit calculation

const paymentStep =
    document.getElementById("payment-step");

const backToCustomerBtn =
    document.getElementById("back-to-customer");

const depositPerSlot = 50;

function updatePaymentSummary() {

    calculatePrice();

    const slotCount =
        hasExtraSlot && extraSlotTime ? 2 : 1;

    const bookingTotal = Number(
        totalPrice.textContent.replace(/[^0-9.]/g, "")
    );

    const deposit = slotCount * depositPerSlot;
    const balance = bookingTotal - deposit;

    document.getElementById("payment-slots")
        .textContent = slotCount + " sesi";

    document.getElementById("payment-total")
        .textContent = formatMoney(bookingTotal);

    document.getElementById("payment-deposit")
        .textContent = formatMoney(deposit);

    document.getElementById("payment-balance")
        .textContent = formatMoney(balance);
}

paymentBtn.addEventListener("click", () => {

    validateCustomerForm();
    updateContinueButton();

    if (paymentBtn.disabled ||
        continueBookingBtn.disabled) return;

    updatePaymentSummary();

    customerStep.hidden = true;
    paymentStep.hidden = false;

    paymentStep.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

backToCustomerBtn.addEventListener("click", () => {

    paymentStep.hidden = true;
    customerStep.hidden = false;

    customerStep.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});
// Refresh payment summary when booking changes

pax.addEventListener("change", () => {
    updateSummary();
    updatePaymentSummary();
});
// Terms and Conditions

const termsDialog = document.querySelector("dialog.terms-modal");
const openTermsBtn = document.getElementById("open-terms");
const closeTermsBtn = document.getElementById("close-terms");
const agreeTerms = document.getElementById("agree-terms");
const payDepositBtn = document.getElementById("pay-deposit");

openTermsBtn.addEventListener("click", () => {
    termsDialog.showModal();
});

closeTermsBtn.addEventListener("click", () => {
    termsDialog.close();
});

function updateDepositButton() {
    payDepositBtn.disabled = !agreeTerms.checked;
}

agreeTerms.addEventListener("change", updateDepositButton);

backToCustomerBtn.addEventListener("click", () => {
    agreeTerms.checked = false;
    updateDepositButton();
});

updateDepositButton();
// Booking confirmation simulation

const confirmationStep =
    document.getElementById("confirmation-step");

const finishBookingBtn =
    document.getElementById("finish-booking");

payDepositBtn.addEventListener("click", () => {

    validateCustomerForm();
    updateContinueButton();

    if (!agreeTerms.checked ||
        paymentBtn.disabled ||
        continueBookingBtn.disabled) return;

    updateSummary();
    updatePaymentSummary();

    const reference =
        "DEMO-" + Date.now().toString().slice(-8);

    document.getElementById("confirmation-ref")
        .textContent = reference;

    document.getElementById("confirmation-name")
        .textContent = nameInput.value.trim();

    document.getElementById("confirmation-deco")
        .textContent = deco.value;

    document.getElementById("confirmation-date")
        .textContent = summaryDate.textContent;

    document.getElementById("confirmation-time")
        .textContent = summaryTime.textContent;

    document.getElementById("confirmation-pax")
        .textContent = pax.value + " orang";

    const extraRow =
        document.getElementById("confirmation-extra-row");

    const extraTime =
        document.getElementById("confirmation-extra-time");

    extraRow.hidden = !(hasExtraSlot && extraSlotTime);

    if (hasExtraSlot && extraSlotTime) {

        const [hours, minutes] =
            extraSlotTime.split(":").map(Number);

        const start = hours * 60 + minutes;

        extraTime.textContent =
            formatTime(start) + " – " +
            formatTime(start + settings.sessionDuration);

    } else {
        extraTime.textContent = "-";
    }

    document.getElementById("confirmation-total")
        .textContent =
        document.getElementById("payment-total").textContent;

    document.getElementById("confirmation-deposit")
        .textContent =
        document.getElementById("payment-deposit").textContent;

    document.getElementById("confirmation-balance")
        .textContent =
        document.getElementById("payment-balance").textContent;

    paymentStep.hidden = true;
    confirmationStep.hidden = false;

    confirmationStep.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

finishBookingBtn.addEventListener("click", () => {
    window.location.reload();
});
