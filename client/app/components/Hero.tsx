import Image from "next/image";
import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-800 to-purple-800 p-20 mix-blend-normal">
      <div className="flex-col justify-center items-start">
        <div className="flex justify-center items-center">
          <div className="px-4 w-[550px] text-white">
            <p className="text-[64px] font-bold text-wrap">
              Welcome to Liquidity Partner
            </p>
            <p className="text-[40px] font-medium">
              Empowering Your Financial Freedom with Espees
            </p>
          </div>
          <Image
            src="/espees.png"
            width={543}
            height={642}
            alt="Espees app"
            loading="lazy"
            className=""
          />
        </div>
        <div className="flex justify-start items-start xl:ml-[350px] xl:right-0 relative right-1 space-x-5">
          <Link href="/buy">
            <button className="border-2 border-white px-8 py-2 rounded-lg text-[22px] font-medium text-white hover:bg-white hover:text-indigo-800 active:bg-white active:text-indigo-800">
              Buy
            </button>
          </Link>
          <Link href="/sell">
            <button className="border-2 border-white px-8 py-2 rounded-lg text-[22px] font-medium text-white hover:bg-white hover:text-indigo-800 active:bg-white active:text-indigo-800">
              Sell
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
