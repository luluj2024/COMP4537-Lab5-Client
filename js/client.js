
const API_BASE_URL = "https://backend.example.com";

class PatientClient {
    constructor() {
        this.pageTitle = document.getElementById("pageTitle");
        this.insertTitle = document.getElementById("insertTitle");
        this.insertDescription = document.getElementById("insertDescription");
        this.insertBtn = document.getElementById("insertBtn");

        this.queryTitle = document.getElementById("queryTitle");
        this.queryLabel = document.getElementById("queryLabel");
        this.sqlQuery = document.getElementById("sqlQuery");
        this.submitBtn = document.getElementById("submitBtn");

        this.responseTitle = document.getElementById("responseTitle");
        this.response = document.getElementById("response");
    }

    initializeUI() {
        document.title = STRINGS.pageTitle;

        this.pageTitle.textContent = STRINGS.mainTitle;
        this.insertTitle.textContent = STRINGS.insertTitle;
        this.insertDescription.textContent = STRINGS.insertDescription;
        this.insertBtn.textContent = STRINGS.insertButton;

        this.queryTitle.textContent = STRINGS.queryTitle;
        this.queryLabel.textContent = STRINGS.queryLabel;
        this.sqlQuery.placeholder = STRINGS.queryPlaceholder;
        this.submitBtn.textContent = STRINGS.submitButton;

        this.responseTitle.textContent = STRINGS.responseTitle;
    }

    bindEvents() {
        this.insertBtn.addEventListener("click", () => {
            this.insertPatients();
        });

        this.submitBtn.addEventListener("click", () => {
            this.queryPatients();
        });
    }

    async insertPatients() {
        this.response.textContent = STRINGS.loading;

        try {
            const response = await fetch(
                `${API_BASE_URL}/lab5/api/v1/insert`,
                {
                    method: "POST"
                }
            );

            const data = await response.text();

            if (!response.ok) {
                this.response.textContent =
                    STRINGS.serverError + data;
                return;
            }

            this.displayResponse(data || STRINGS.insertSuccess);

        } catch (error) {
            this.response.textContent =
                STRINGS.networkError + error.message;
        }
    }

    async queryPatients() {
        const sql = this.sqlQuery.value.trim();

        if (!sql) {
            this.response.textContent = STRINGS.emptyQuery;
            return;
        }

        this.response.textContent = STRINGS.loading;

        try {
            const encodedSQL = encodeURIComponent(sql);

            const response = await fetch(
                `${API_BASE_URL}/lab5/api/v1/sql/${encodedSQL}`,
                {
                    method: "GET"
                }
            );

            const data = await response.text();

            if (!response.ok) {
                this.response.textContent =
                    STRINGS.serverError + data;
                return;
            }

            this.displayResponse(data);

        } catch (error) {
            this.response.textContent =
                STRINGS.networkError + error.message;
        }
    }

    displayResponse(data) {
        try {
            const parsedData = JSON.parse(data);
            this.response.textContent =
                JSON.stringify(parsedData, null, 2);
        } catch {
            this.response.textContent = data;
        }
    }
}

const app = new PatientClient();
app.initializeUI();
app.bindEvents();
