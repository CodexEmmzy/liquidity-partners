"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserWallet = exports.fetchVendingToken = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use((0, cors_1.default)());
const apiKey = "V9yKoxl5EljDbawloXWHaD2zgclp28U9f5YSY3U3";
const agentWallet = "0x0bd3e40f8410ea473850db5479348f074d254ded";
const agentPin = "1234";
const generateVendingHash = () => {
    return crypto_1.default.randomBytes(8).toString("hex");
};
const fetchVendingToken = async (_req, res) => {
    const vendingHash = generateVendingHash();
    console.log(vendingHash);
    const url = "https://api.espees.org/agents/vending/createtoken";
    const options = {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
        },
        data: {
            vending_wallet_address: agentWallet,
            vending_wallet_pin: agentPin,
            vending_hash: vendingHash,
        },
    };
    try {
        const response = await axios_1.default.post(url, options.data, {
            headers: options.headers,
        });
        const data = response.data;
        res.status(200).json(response.data);
        return data;
    }
    catch (err) {
        console.error("Error:", err);
        res.status(500).json({ msg: `Internal Server Error.` });
    }
};
exports.fetchVendingToken = fetchVendingToken;
router.post(`/fetchVendingToken`, exports.fetchVendingToken);
const fetchUserWallet = async (req, res) => {
    const { username } = req.body;
    try {
        const response = await axios_1.default.post("https://api.espees.org/user/address", {
            username: username,
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        });
        const data = response.data;
        return data;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: `Internal Server Error.` });
    }
};
exports.fetchUserWallet = fetchUserWallet;
router.post(`/fetchUserWallet`, exports.fetchUserWallet);
router.post(`/handleVendEspees`, async function (req, res) {
    const { vendingToken, userWalletAddress, vendingAmount } = req.body;
    try {
        const vendEspeesResponse = await axios_1.default.post("https://api.espees.org/v2/vending/vend", {
            vending_token: vendingToken,
            user_wallet: userWalletAddress,
            amount_in_espees: vendingAmount,
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        });
        const vendEspeesData = vendEspeesResponse.data;
        res.status(200).json(vendEspeesData);
    }
    catch (error) {
        console.error("Error vending Espees:", error);
        res.status(500).json({ msg: `Internal Server Error.` });
    }
});
app.use(express_1.default.json());
app.use(router);
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
//# sourceMappingURL=index.js.map