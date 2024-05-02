"use client";

import React, { ChangeEvent } from "react";
import { useState } from "react";
import Footer from "../components/Footer";
import crypto from "crypto";
require("dotenv").config();

interface ApiResponse {
  statusCode: number;
  message: string;
}

const page = () => {
  const [username, setUsername] = useState<string>("");
  const [vendingAmount, setVendingAmount] = useState<number>(); // Default vending amount
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const bankOptions: string[] = [
    "Access Bank Plc",
    "Accion Microfinance Bank",
    "Advans La Fayette Microfinance Bank",
    "Citibank Nigeria Limited",
    "Covenant Microfinance Bank Ltd",
    "Dot Microfinance Bank",
    "Ecobank Nigeria",
    "Empire Trust Microfinance Bank",
    "FairMoney Microfinance Bank",
    "Fidelity Bank Plc",
    "Finca Microfinance Bank Limited",
    "First Bank of Nigeria Limited",
    "First City Monument Bank Limited",
    "Globus Bank Limited",
    "Guaranty Trust Holding Company Plc",
    "Heritage Bank Plc",
    "Infinity Microfinance Bank",
    "Jaiz Bank Plc",
    "Keystone Bank Limited",
    "Kuda Bank",
    "Lotus Bank",
    "Mint Finex MFB",
    "Moneyfield Microfinance Bank",
    "Moniepoint Microfinance Bank",
    "Mutual Trust Microfinance Bank",
    "Opay",
    "Optimus Bank Limited",
    "Palmpay",
    "Parallex Bank Limited",
    "Peace Microfinance Bank",
    "PremiumTrust Bank Limited",
    "Providus Bank Limited",
    "Raven bank",
    "Rephidim Microfinance Bank",
    "Rex Microfinance Bank",
    "Rubies Bank",
    "Signature Bank Limited",
    "Shepherd Trust Microfinance Bank",
    "Sparkle Bank",
    "Standard Chartered",
    "Stanbic IBTC Bank Plc",
    "Sterling Bank Plc",
    "SunTrust Bank Nigeria Limited",
    "TAJBank Limited",
    "Titan Trust bank",
    "Union Bank of Nigeria Plc",
    "United Bank for Africa Plc",
    "Unity Bank Plc",
    "VFD Microfinance Bank",
    "Wema Bank Plc",
    "Zenith Bank Plc",
  ];

  const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  // API key for authentication
  const apiKey: string = "V9yKoxl5EljDbawloXWHaD2zgclp28U9f5YSY3U3";
  console.log(apiKey)

  // Handler function to fetch user's wallet address and initiate vending
  const handleVendEspees = async () => {
    try {
      // Step 1: Get user's wallet address from username
      const userAddressResponse = await fetch(
        "https://api.espees.org/user/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({ username }),
        }
      );

      const userAddressData = await userAddressResponse.json();
      const userWalletAddress: string = userAddressData.wallet_address;

      const generateVendingHash = (): string => {
        return crypto.randomBytes(8).toString("hex");
      };

      const vendingHash = generateVendingHash()
      const pin: string = "1010"

      //Step 2: Get Vending Token
      const vendingToken = await fetch(
        "https://api.espees.org/agents/vending/createtoken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            vending_wallet_address: userWalletAddress,
            vending_wallet_pin: pin,
            vending_hash: vendingHash,
          }),
        }
      );

      // Step 3: Start to Vend Espees
      const vendEspeesResponse = await fetch(
        "https://api.espees.org/v2/vending/vend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            vending_token: vendingToken,
            user_wallet: userWalletAddress,
            amount_in_espees: vendingAmount,
          }),
        }
      );

      const vendEspeesData = await vendEspeesResponse.json();
      setApiResponse(vendEspeesData);
    } catch (error) {
      console.error("Error vending Espees:", error);
      // Handle error
    }
  };

  return (
    <main className=" overflow-x-hidden h-screen">
      <div className=" bg-purple-200 w-screen h-full flex justify-center items-center">
        <div className="flex-col border p-10 rounded-lg bg-white w-[659px]">
          {/* Input for amount to vend */}
          <div className="py-5">
            <p>Amount you want to Sell (Espees)</p>
            <input
              type="number"
              placeholder="Enter amount in Espees"
              value={vendingAmount}
              onChange={(e) => setVendingAmount(Number(e.target.value))}
              className="focus:outline-none focus:ring-transparent border-2 p-2 rounded-md w-[580px] py-4"
            />
          </div>

          {/* Input for username */}
          <div className="py-5">
            <p>Bank Account Details</p>
            <input
              type="text"
              placeholder="Bank Account Number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="focus:outline-none focus:ring-transparent border-2 p-2 rounded-md w-[580px] py-4 mb-3"
            />
            <div className="relative inline-block">
              <select
                value={selectedOption ? selectedOption : "Select a bank:"}
                onChange={handleOptionChange}
                className="w-[580px] focus:ring-transparent focus:outline-none"
              >
                <option value="">Select bank</option>
                {bankOptions.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Button to trigger vending */}
          <button
            className="border-2 border-white px-8 py-2 rounded-lg text-[16px] font-medium bg-indigo-800 text-white"
            onClick={handleVendEspees}
          >
            Sell
          </button>

          {/* Display API response */}
          {apiResponse && (
            <div>
              <p>Status Code: {apiResponse.statusCode}</p>
              <p>Message: {apiResponse.message}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default page;
