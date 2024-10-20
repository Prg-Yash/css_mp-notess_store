import React from "react";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

const NoteCard = ({ coverImg, pid, ptitle, pclass, psubject }) => {
  return (
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row w-full hover:bg-gray-100 ">
      <div className="w-full md:w-[40%] h-[200px] md:h-auto overflow-hidden p-4 md:p-6 border-b md:border-b-0 md:border-r">
        {/* <Image
          className="object-cover w-full h-full rounded-t-lg md:rounded-none"
          src={coverImg}
          alt="Note"
          width={1000}
          height={1000}
        /> */}

        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent>
            {coverImg.map((img, index) => (
              <CarouselItem key={index}>
                <Image
                  src={img}
                  alt={ptitle}
                  width={1000}
                  height={1000}
                  className="object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="flex flex-col gap-y-2 justify-between p-4 md:p-6 w-full md:w-[60%]">
        <h5 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
          {ptitle}
        </h5>
        <p className="text-base md:text-lg font-semibold text-gray-700">
          Standard {pclass}
        </p>
        <p className="text-base md:text-lg font-semibold text-gray-700">
          Subject: {psubject}
        </p>

        {/* View Button */}
        <Button className="w-full hover:bg-accent ease-in-out duration-300 mt-3">
          <Link
            className="w-full gap-2 flex items-center justify-center"
            href={`/account/${pid}`}
          >
            View <MoveUpRight className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NoteCard;
