const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/jbmNZ4czEY1GeNM1_IVdB'; 

app.use(express.urlencoded({ extended: true }));

// CSS yang cantik (Sudah dikemaskini dengan gaya badge untuk Gas)
const cssStyle = `
    <style>
        body { font-family: 'Segoe UI', sans-serif; background-color: #f4f7f6; display: flex; justify-content: center; padding-top: 50px; }
        .card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
        .gas-badge { background: #e0e7ff; color: #4338ca; padding: 5px 10px; border-radius: 20px; font-size: 0.9em; font-weight: bold; margin-bottom: 20px; display: inline-block; }
        input { width: 90%; padding: 12px; margin: 15px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
        button { background-color: #2563eb; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; }
        a { display: inline-block; margin-top: 20px; color: #2563eb; text-decoration: none; }
    </style>
`;

async function getGasPrice() {
    try {
        const response = await axios.post(RPC_URL, {
            jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1
        });
        return (parseInt(response.data.result, 16) / 1000000000).toFixed(2); // Tukar Wei ke Gwei
    } catch { return "N/A"; }
}


app.get('/', async (req, res) => {
    const gasPrice = await getGasPrice();
    res.send(`<html>${cssStyle}<body><div class="card">
        <h1>Sepolia Monitor</h1>
        <div class="gas-badge">Gas: ${gasPrice} Gwei</div>
        <form action="/check-wallet" method="POST">
            <input type="text" name="address" placeholder="Masukkan alamat 0x..." required>
            <button type="submit">Cek Baki</button>
        </form>
    </div>
    <script>
       setTimeout(() => {
         location.reload();
       }, 30000); // 30000 milisaat = 30 saat
    </script>
   </body></html>`);
});

app.post('/check-wallet', async (req, res) => {
    const address = req.body.address;
    try {
        const response = await axios.post(RPC_URL, {
            jsonrpc: "2.0", method: "eth_getBalance", params: [address, "latest"], id: 1
        });
        const balance = (parseInt(response.data.result, 16) / Math.pow(10, 18)).toFixed(4);
        res.send(`<html>${cssStyle}<body><div class="card"><h1>Hasil Carian</h1><p>Baki:</p><b>${balance} ETH</b><br><a href="/">Kembali</a></div></body></html>`);
    } catch (e) { res.send(`<html>${cssStyle}<body><div class="card"><h1>Ralat</h1><a href="/">Kembali</a></div></body></html>`); }
});

app.listen(port, () => console.log(`Server on port ${port}`));
