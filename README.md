# 🛫 Travel Insurance Integration Hub

**Live Demo**: https://notoolsnocraft.github.io/Travel-Insurance-Integration-Hub/

## Built for Understanding API focussed roles in the Travel Insurance industry.

**Demo Flow**: Form → Central Gateway → Internal Policy + 3 External Partners (REST/SOAP/SFTP) → Admin Dashboard

**Skills Demonstrated**:

- Product Requirements: `docs/PRD.pdf`
- Postman tests: `docs/postman-collection.json` 
- ELK-style monitoring dashboard

**Tech Stack**: Vanilla JS, Chart.js, GitHub Pages, Postman


## ❓ Why Different Protocols? (REST vs SOAP vs SFTP)

**This is enterprise reality** - you **can't control** what protocols partners expose:

| Partner | Protocol | Why They Use It | Real-World Example |
|---------|----------|-----------------|-------------------|
| **Internal Policy** | **REST/JSON** | Modern, lightweight, your team's choice | New microservices architecture |
| **Allianz** | **REST API** | Public API, developer-friendly, JSON standard | Most modern insurance APIs |
| **AXA** | **SOAP/XML** | **Enterprise legacy** (10+ yrs old), banking-grade security | 70% of Fortune 500 still run SOAP |
| **Generali** | **SFTP** | **Batch/nightly processing**, no real-time API | Traditional insurers uploading CSV files |

### **Why Not All REST?**
✅ REST = Fast, modern, scalable (your preference)
❌ SOAP = Legacy systems you MUST integrate (AXA's 15-yr-old platform)
❌ SFTP = Partners without APIs (Generali only does file drops)
