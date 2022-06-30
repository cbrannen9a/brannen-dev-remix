import type { HeroContent } from "~/types";
import { type FC } from "react";

import { PortableText } from "@portabletext/react";
import { Ctas, Image } from "../Common";

const Hero: FC<
  Pick<HeroContent, "heading" | "subHeading" | "tagline" | "ctas" | "image">
> = ({ heading, subHeading, tagline, ctas, image }) => (
  <section>
    <div className="relative pt-[120px] lg:pt-[150px] pb-[110px] bg-white">
      <div className="container">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-5/12 px-4">
            <div className="hero-content">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">{heading}</span>
                <span className="block text-blue-600 xl:inline">
                  {subHeading}
                </span>
              </h1>
              <div className="mb-2 mt-3 text-base text-gray-500 md:text-xl lg:mx-0">
                {tagline ? <PortableText value={tagline} /> : null}
              </div>

              {ctas && (
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <Ctas ctas={ctas} />
                </div>
              )}

              {image && (
                <div className="w-full lg:w-6/12 px-4">
                  <div className="lg:text-right lg:ml-auto">
                    <div className="relative inline-block z-10 pt-11 lg:pt-0">
                      <Image
                        className="max-w-full lg:ml-auto"
                        value={image}
                        alt={image.alt}
                        loading="eager"
                        width={350}
                        height={250}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
