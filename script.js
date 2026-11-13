
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

const result = document.getElementById("result");
const rateInfo = document.getElementById("rateInfo");
const status = document.getElementById("status");

async function convertCurrency() {
    const amount = Number(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Check the entered amount
    if (!amountInput.value.trim() || !Number.isFinite(amount) || amount <= 0) {
        status.textContent = "Please enter a valid amount greater than zero.";
        result.textContent = "--";
        rateInfo.textContent = "";
        return;
    }

    // Handle same currency conversion
    if (from === to) {
        result.textContent = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: to
        }).format(amount);

        rateInfo.textContent = `1 ${from} = 1 ${to}`;
        status.textContent = "Conversion completed successfully!";
        return;
    }

    try {
        convertBtn.disabled = true;
        convertBtn.textContent = "Converting...";
        status.textContent = "Fetching the latest available exchange rate...";
        result.textContent = "--";

        // Fetch exchange rate from the API
        const apiURL =
            `https://api.frankfurter.dev/v2/rate/${from}/${to}`;

        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Unable to fetch exchange rates.");
        }

        const data = await response.json();

        // Calculate converted amount
        const convertedAmount = amount * data.rate;

        // Format the result based on target currency
        const formattedResult = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: to,
            maximumFractionDigits: 2
        }).format(convertedAmount);

        result.textContent = formattedResult;

        rateInfo.textContent =
            `1 ${from} = ${data.rate.toFixed(4)} ${to}`;

        status.textContent =
            `Rate date: ${data.date} | Conversion successful!`;

    } catch (error) {
        result.textContent = "--";
        rateInfo.textContent = "";
        status.textContent =
            "Something went wrong. Please check your internet connection or currencies.";
        console.error("Conversion error:", error);

    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = "Convert Currency →";
    }
}

// Convert when the button is clicked
convertBtn.addEventListener("click", convertCurrency);

// Swap the selected currencies
swapBtn.addEventListener("click", () => {
    const previousFrom = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = previousFrom;

    convertCurrency();
});

// Press Enter to convert
amountInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        convertCurrency();
    }
});

// Show the first conversion when the page loads
window.addEventListener("DOMContentLoaded", convertCurrency);
