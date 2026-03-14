class IntegrationHub {
    constructor() {
        this.calls = [];
        this.init();
    }

    init() {
        document.getElementById('quoteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.getQuotes();
        });
    }

    async getQuotes() {
        const formData = {
            destination: document.getElementById('destination').value,
            travelDate: document.getElementById('travelDate').value,
            duration: document.getElementById('duration').value
        };

        // Log start
        this.logCall('Central Gateway', 'START', 0);

        try {
            // 1. Internal Policy Check
            const policy = await this.mockInternalPolicy(formData);
            this.logCall('Internal Policy', 'SUCCESS', 120);

            // 2. Parallel External Partner Calls
            const [restQuote, soapQuote, sftpQuote] = await Promise.all([
                this.mockRestPartner(formData),
                this.mockSoapPartner(formData),
                this.mockSftpPartner(formData)
            ]);

            this.logCall('REST Partner', 'SUCCESS', 180);
            this.logCall('SOAP Partner', 'SUCCESS', 250);
            this.logCall('SFTP Partner', 'SUCCESS', 320);
            this.logCall('Central Gateway', 'COMPLETE', 320);

            this.displayResults(policy, restQuote, soapQuote, sftpQuote);
            this.updateDashboard();

        } catch (error) {
            console.error('Integration failed:', error);
            this.logCall('Central Gateway', 'ERROR', 500);
        }
    }

    async mockInternalPolicy(data) {
        return new Promise(resolve => setTimeout(() => {
            resolve({ eligible: true, baseRate: 25, rules: 'EU coverage approved' });
        }, 120));
    }

    async mockRestPartner(data) {
        return new Promise(resolve => setTimeout(() => {
            resolve({ provider: 'Allianz REST API', price: 45, coverage: 'Full medical + trip cancel' });
        }, 180));
    }

    async mockSoapPartner(data) {
        return new Promise(resolve => setTimeout(() => {
            resolve({ 
                provider: 'AXA SOAP Service', 
                price: 52, 
                coverage: 'Premium + baggage delay',
                xmlResponse: true 
            });
        }, 250));
    }

    async mockSftpPartner(data) {
        return new Promise(resolve => setTimeout(() => {
            resolve({ 
                provider: 'Generali SFTP File', 
                price: 38, 
                coverage: 'Basic + emergency assist',
                fileBased: true 
            });
        }, 320));
    }

    displayResults(policy, rest, soap, sftp) {
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('dashboard').classList.remove('hidden');

        const quotesHtml = `
            <div class="quote-card">
                <div class="quote-provider">${rest.provider}</div>
                <div class="quote-price">$${rest.price}</div>
                <div>${rest.coverage}</div>
            </div>
            <div class="quote-card">
                <div class="quote-provider">${soap.provider}</div>
                <div class="quote-price">$${soap.price}</div>
                <div>${soap.coverage}</div>
            </div>
            <div class="quote-card">
                <div class="quote-provider">${sftp.provider}</div>
                <div class="quote-price">$${sftp.price}</div>
                <div>${sftp.coverage}</div>
            </div>
        `;
        document.getElementById('quotes').innerHTML = quotesHtml;
    }

    logCall(service, status, latency) {
        this.calls.push({ 
            timestamp: new Date(), 
            service, 
            status, 
            latency,
            success: status !== 'ERROR'
        });
    }

    updateDashboard() {
        const ctx = document.getElementById('metricsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Internal', 'REST', 'SOAP', 'SFTP'],
                datasets: [{
                    label: 'Latency (ms)',
                    data: this.calls.filter(c => c.success).map(c => c.latency),
                    backgroundColor: ['#007bff', '#17a2b8', '#ffc107', '#6f42c1']
                }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });

        const total = this.calls.length;
        const errors = this.calls.filter(c => !c.success).length;
        const avgLatency = this.calls.reduce((sum, c) => sum + c.latency, 0) / total;

        document.getElementById('totalCalls').textContent = `Total API Calls: ${total}`;
        document.getElementById('errorRate').textContent = `Error Rate: ${((errors/total)*100).toFixed(1)}%`;
        document.getElementById('avgLatency').textContent = `Avg Latency: ${avgLatency.toFixed(0)}ms`;
    }
}

new IntegrationHub();
