import { products } from "@/data";
import React from "react";
import ProductCard from "./ProductCard";
import { Filter, ListFilter } from "lucide-react";
import StdProducts from "./StdProducts";
import FilterBox from "./FilterBox";
import LandingDisplayProducts from "./LandingDisplayProducts";
import Container from "./Container";

const OurProducts = () => {
  return (
    <Container>
      <section className="py-10 flex flex-col px-4">
        <div className="flex justify-center items-center w-full ">
          <div>
            <h2 className="inline-block text-xl md:text-2xl font-semibold relative text-center ">
              Browse Our Notes
              <hr className="border-yellow-600 border-2 w-1/2 mx-auto rounded-full mt-2 absolute md:left-1/2 md:transform md:-translate-x-1/2" />
            </h2>
          </div>
          {/* <div className="absolute md:-left-96">
          <FilterBox />
        </div> */}
        </div>

        {/* <h1 className="md:text-center text-3xl md:text-4xl font-semibold text-black my-8">
          Best Selling & <span className="text-accent">New Releases</span>
        </h1> */}

        {/* <div className="flex justify-center items-center w-full">
          <LandingDisplayProducts />
        </div> */}
        <StdProducts />
        {/* <StdProducts standard="V" />
        <StdProducts standard="VII" />
        <StdProducts standard="VIII" />
        <StdProducts standard="IX" />
        <StdProducts standard="X" /> */}
      </section>
    </Container>
  );
};

export default OurProducts;
