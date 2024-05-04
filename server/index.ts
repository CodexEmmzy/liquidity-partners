import express, { Request, Response } from "express";
import cors from "cors";
import crypto from "crypto";
import axios from "axios";

const app = express();
const router = express.Router();

app.use(cors());
const port = process.env.PORT || 18012;

const apiKey: string = "V9yKoxl5EljDbawloXWHaD2zgclp28U9f5YSY3U3";
const agentWallet: string = "0x0bd3e40f8410ea473850db5479348f074d254ded";
const agentPin: string = "1234";

const generateVendingHash = (): string => {
  return crypto.randomBytes(8).toString("hex");
};

export const fetchVendingToken = async (
  _req: Request,
  res: Response
): Promise<any> => {
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
    const response = await axios.post(url, options.data, {
      headers: options.headers,
    });
    const data = response.data;
    res.status(200).json(response.data);
    return data;
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ msg: `Internal Server Error.` });
  }
};

router.post(`/fetchVendingToken`, fetchVendingToken);

export const fetchUserWallet = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username } = req.body; // Extract username from request body

  try {

    const url = "https://api.espees.org/user/address"

    const options: any = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      data: {
        username
      }
    }

   // Send the request with the username in the request body
   const response = await axios.post(url, { username }, options);

   const data = response.data;
   return data;
    return data;
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: `Internal Server Error.` });
  }
};

router.post(`/fetchUserWallet`, fetchUserWallet);

router.post(`/handleVendEspees`, async function (req: any, res: any) {
  console.log("Received request:", req.body); // Log the received request body
  const { vendingToken, userWalletAddress, vendingAmount } = req.body; // Extract data from request body
  try {
    const vendEspeesResponse = await axios.post(
      "https://api.espees.org/v2/vending/vend",
      {
        vending_token: vendingToken,
        user_wallet: userWalletAddress,
        amount_in_espees: vendingAmount,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );
    const vendEspeesData = vendEspeesResponse.data;
    console.log("Vending response:", vendEspeesData); // Log the vending response data
    res.status(200).json(vendEspeesData); // Respond with vending response data
  } catch (error) {
    console.error("Error vending Espees:", error);
    res.status(500).json({ msg: `Internal Server Error.` });
  }
});


app.use(express.json());
app.use(router);

app.listen(4000, () => {
  console.log("");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})