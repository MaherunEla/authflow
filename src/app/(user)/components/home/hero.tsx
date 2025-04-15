import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section className="min-h-96 relative flex flex-1 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 py-16 shadow-lg md:py-20 xl:py-48">
      <Image
        src="/hero3.jpg"
        loading="lazy"
        alt="Photo by Fakurian Design"
        fill
        className="absolute inset-0  object-cover object-center"
      />

      <div className="absolute inset-0 bg-indigo-500 mix-blend-multiply"></div>

      <div className="relative flex flex-col items-center p-4 sm:max-w-xl">
        <p className="mb-4 text-center text-lg text-indigo-200 sm:text-xl md:mb-8">
          Scalable Authentication System
        </p>
        <h1 className="mb-8 text-center text-4xl font-bold text-white sm:text-5xl md:mb-12 md:text-5xl">
          Secure, Fast, and User-Friendly Authentication with Next.js & Prisma.
        </h1>

        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="#"
            className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
