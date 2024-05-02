"use client";
import React, { FormEvent, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

interface ApiResponse {
  statusCode: number;
  message: string;
}

const YourComponent = () => {
  const [username, setUsername] = useState<string>("");
  const [vendingAmount, setVendingAmount] = useState<number>(0); // Set initial value to 0
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vendingToken, setVendingToken] = useState<string>("");

  const fetchVendingToken = async () => {
    try {
      const response = await axios.post("http://localhost:4000/fetchVendingToken");
      const data = response.data;
      setVendingToken(data.vending_token);
      return data.vending_token;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserWallet = async () => {
    try {
      const response = await axios.post("http://localhost:4000/fetchUserWallet", {
        username: username,
      });
      const data = response.data;
      return data.wallet_id;
    } catch (err) {
      console.log(err);
    }
  };

  const handleVendEspees = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const vendingToken = await fetchVendingToken();
      const userWalletAddress = await fetchUserWallet();

      const response = await axios.post("http://localhost:4000/handleVendEspees", {
        vendingToken,
        userWalletAddress,
        vendingAmount,
      });

      setApiResponse(response.data);
    } catch (error) {
      console.error("Error vending Espees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className=" overflow-x-hidden h-screen">
      <div className=" bg-purple-200 w-screen h-full flex justify-center items-center">
        <form onSubmit={handleVendEspees}>
          <div className="flex-col border p-10 rounded-lg bg-white">
            {/* Input for username */}
            <div className="py-5">
              <p>Espees Account to fund</p>
              <input
                type="text"
                placeholder="Espees wallet Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="focus:outline-none focus:ring-transparent border-2 p-2 rounded-md"
              />
            </div>

            {/* Input for amount to vend */}
            <div className="py-5">
              <p>Amount you want to Buy (Espees)</p>
              <input
                type="number"
                placeholder="Enter amount in Espees"
                value={vendingAmount}
                onChange={(e) => setVendingAmount(e.target.valueAsNumber)}
                className="focus:outline-none focus:ring-transparent border-2 p-2 rounded-md"
              />
            </div>

            {/* Button to trigger vending */}
            <button
              className="border-2 border-white px-8 py-2 rounded-lg text-[16px] font-medium bg-indigo-800 text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Buy"}
            </button>

            {/* Display API response */}
            {apiResponse && (
              <div>
                <p>Status Code: {apiResponse.statusCode}</p>
                <p>Message: {apiResponse.message}</p>
              </div>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </main>
  );
};
export default YourComponent;
