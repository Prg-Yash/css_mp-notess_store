import Image from "next/image";
import React from "react";
import Container from "./Container";

const Banner = () => {
  return (
    <Container>
      <div className="flex justify-center items-center md:px-4">
        <Image
          src="/banner.png"
          alt="Banner Image"
          width={1000}
          height={1000}
          className="w-full h-full md:h-[800px] lg:h-[600px] object-cover md:border-4 md:border-black/80 md:rounded-md"
        />
      </div>
    </Container>
  );
};

export default Banner;
