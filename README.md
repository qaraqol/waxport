# **Waxport**

Waxport is a tool designed to **export WAX blockchain transfer history into a CSV file**. This makes it simple to track, analyze, and manage transactions for **accounting**, **tax purposes**, or **personal records**.

---

## **Features**

- **Export WAX Transactions**: Extract detailed transfer history in a CSV format.
- **Key Details Included**:
  - **Date and Time** of the transaction (UTC).
  - **Transaction ID**.
  - **Sender** and **Recipient** addresses.
  - **Amount Transferred**.
  - **Memo**.
  - **Transaction Status**.
- **Advanced Filters**:
  - Filter by **specific token symbol**.
  - Filter by **specific sender/receiver accounts**.

---

## **Usage**

### **Does Waxport Support Multiple Accounts?**

Waxport currently supports exporting transactions for **one account at a time**.  
To export data for multiple accounts, simply repeat the process for each account separately.

### **How to Use Waxport**

1. **Enter your WAX account name.**
2. **Select the number of transactions** you want to export.
3. **Click on "Export"**:
   - The tool processes your request and generates a CSV file.
4. **Download the CSV file**:
   - Save the file to your device when prompted.

---

## **Getting Started**

To set up and run Waxport locally, follow the steps below:

### **Installation**

1. Ensure you have **Bun** or **Node** installed. (Visit [Bun’s Official Website](https://bun.sh) for installation instructions.)
2. Clone the repository:
   ```bash
   git clone https://github.com/your-username/waxport.git
   cd waxport
   ```
3. You can use Qaraqol's Token API without an API key or use Pinax Token API
   You need an API key from Pinax Token API and their URL in your .env file
   You also need to specify the download limit for token amount.
   ```
        API_URL=https://wax.api.pinax.network/v1/account/transfers //For Pinax
        API_URL=https://wax-token.qaraqol.com/account/transfers //For Qaraqol
        API_KEY=XXXXXXXXXXXXXXX
        NEXT_PUBLIC_MAX_DOWNLOADS=100
   ```
