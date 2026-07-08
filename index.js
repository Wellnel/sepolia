const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Gunakan Public RPC Sepolia (contoh: Infura/Alchemy)
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/jbmNZ4czEY1GeNM1_IVdB"; 

// Tambah ini di bawah bahagian RPC_URL
const TARGET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'; // Gantikan dengan alamat yang anda mahu pantau

app.get('/', async (req, res) => {
    try {
        // 1. Ambil Blok
        const blockResponse = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 1
        });
        const blockNumber = parseInt(blockResponse.data.result, 16);

        // 2. Ambil Baki Dompet
        const balanceResponse = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [TARGET_ADDRESS, "latest"],
            id: 1
        });
        const balanceEther = parseInt(balanceResponse.data.result, 16) / Math.pow(10, 18);

        // 3. Paparan
        res.send(`
            <h1>Sepolia Node Monitor</h1>
            <p>Status: <b>Online</b></p>
            <p>Current Block Height: <b>${blockNumber}</b></p>
            <hr>
            <h3>Wallet Watcher</h3>
            <p>Address: <code>${TARGET_ADDRESS}</code></p>
            <p>Balance: <b>${balanceEther.toFixed(4)} ETH</b></p>
        `);
    } catch (error) {
        res.send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

app.get('/', async (req, res) => {
    try {
        const response = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 1
        });
        
        const blockHex = response.data.result;
        const blockNumber = parseInt(blockHex, 16);
        
        res.send(`
            <h1>Sepolia Node Monitor</h1>
            <p>Status: <b>Online</b></p>
            <p>Current Block Height: <b>${blockNumber}</b></p>
            <hr>
            <p>Dikemaskini secara langsung daripada Sepolia RPC.</p>
        `);
        // ... kod asal anda ...
    } catch (error) {
        console.error("Ralat sebenar:", error.message); // Ini akan keluar di Logs Render
        res.send(`<h1>Error fetching data</h1><p>${error.message}</p>`); // Ini akan keluar di skrin website
    }
// ... kod asal anda ...


});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
