const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Gunakan Public RPC Sepolia (contoh: Infura/Alchemy)
const RPC_URL = 'https://rpc.sepolia.org'; 

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
    } catch (error) {
        res.send("<h1>Error fetching data</h1>");
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
