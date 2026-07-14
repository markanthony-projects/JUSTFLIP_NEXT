"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Carousel from "@/src/components/Carousel";
import Image from "@/src/components/atoms/Image";

const tabs = [
  {
    name: "Apartment",
    value: 'apartment',
    icon: (isSelected) => (
      <svg
        width="43"
        height="43"
        viewBox="0 0 43 43"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.7602 31.625H7.2977C4.7952 31.625 3.53516 30.365 3.53516 27.8625V7.38754C3.53516 4.88504 4.7952 3.625 7.2977 3.625H14.8227C17.3252 3.625 18.5851 4.88504 18.5851 7.38754V10.625M23.4852 10.625V7.38754C23.4852 4.88504 24.7451 3.625 27.2476 3.625H34.7726C37.2751 3.625 38.5352 4.88504 38.5352 7.38754V27.8625C38.5352 30.365 37.2751 31.625 34.7726 31.625H30.4326M17.5352 19.375H24.5352M17.5352 24.625H24.5352M21.0352 38.625V33.375M30.4326 14.86V34.39C30.4326 37.2075 29.0327 38.625 26.2152 38.625H15.9951C13.1776 38.625 11.7602 37.2075 11.7602 34.39V14.86C11.7602 12.0425 13.1776 10.625 15.9951 10.625H26.2152C29.0327 10.625 30.4326 12.0425 30.4326 14.86Z"
          stroke="#002B5B"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Villa",
    value: 'villa',
    icon: (isSelected) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="42"
        height="42"
        viewBox="0 0 42 42"
      >
        <path
          d="M3.5 37.4982C2.94772 37.4982 2.5 37.9459 2.5 38.4982C2.5 39.0505 2.94772 39.4982 3.5 39.4982V37.4982ZM38.5 39.4982C39.0523 39.4982 39.5 39.0505 39.5 38.4982C39.5 37.9459 39.0523 37.4982 38.5 37.4982V39.4982ZM5.25 17.4457L6.25 17.4499V17.4457H5.25ZM6.5975 14.6983L5.98315 13.9092L5.9768 13.9143L6.5975 14.6983ZM18.8475 5.16078L18.2336 4.37143L18.2332 4.37173L18.8475 5.16078ZM23.1525 5.16078L23.7661 4.37117L23.7612 4.36735L23.1525 5.16078ZM35.4025 14.6808L34.7889 15.4704L34.7897 15.471L35.4025 14.6808ZM16.625 38.4982H15.625C15.625 39.0505 16.0727 39.4982 16.625 39.4982V38.4982ZM25.375 38.4982V39.4982C25.9273 39.4982 26.375 39.0505 26.375 38.4982H25.375ZM32.25 12.2582C32.2556 12.8105 32.7077 13.2537 33.26 13.2482C33.8123 13.2427 34.2555 12.7905 34.25 12.2382L32.25 12.2582ZM33.1975 6.99823L34.1975 6.98823C34.192 6.43987 33.7459 5.99823 33.1975 5.99823V6.99823ZM25.4975 5.99823C24.9452 5.99823 24.4975 6.44595 24.4975 6.99823C24.4975 7.55051 24.9452 7.99823 25.4975 7.99823V5.99823ZM3.5 39.4982H38.5V37.4982H3.5V39.4982ZM6.16249 38.5024L6.24999 17.4499L4.25001 17.4416L4.16251 38.4941L6.16249 38.5024ZM6.25 17.4457C6.25 16.6948 6.60902 15.9646 7.2182 15.4823L5.9768 13.9143C4.90598 14.762 4.25 16.0616 4.25 17.4457H6.25ZM7.21183 15.4874L19.4618 5.94983L18.2332 4.37173L5.98317 13.9093L7.21183 15.4874ZM19.4614 5.95013C20.3579 5.25292 21.6229 5.24772 22.5438 5.95421L23.7612 4.36735C22.1271 3.11384 19.8571 3.10865 18.2336 4.37143L19.4614 5.95013ZM22.5389 5.95038L34.7889 15.4704L36.0161 13.8912L23.7661 4.37119L22.5389 5.95038ZM34.7897 15.471C35.3993 15.9438 35.75 16.6652 35.75 17.4457H37.75C37.75 16.0562 37.1207 14.7478 36.0153 13.8906L34.7897 15.471ZM35.75 17.4457V38.4983H37.75V17.4457H35.75ZM22.75 28.7482H19.25V30.7482H22.75V28.7482ZM19.25 28.7482C17.2452 28.7482 15.625 30.3684 15.625 32.3732H17.625C17.625 31.473 18.3498 30.7482 19.25 30.7482V28.7482ZM15.625 32.3732V38.4982H17.625V32.3732H15.625ZM16.625 39.4982H25.375V37.4982H16.625V39.4982ZM26.375 38.4982V32.3732H24.375V38.4982H26.375ZM26.375 32.3732C26.375 30.3684 24.7548 28.7482 22.75 28.7482V30.7482C23.6502 30.7482 24.375 31.473 24.375 32.3732H26.375ZM16.625 23.0607H13.125V25.0607H16.625V23.0607ZM13.125 23.0607C12.7148 23.0607 12.375 22.7209 12.375 22.3107H10.375C10.375 23.8255 11.6102 25.0607 13.125 25.0607V23.0607ZM12.375 22.3107V19.6857H10.375V22.3107H12.375ZM12.375 19.6857C12.375 19.2755 12.7148 18.9357 13.125 18.9357V16.9357C11.6102 16.9357 10.375 18.1709 10.375 19.6857H12.375ZM13.125 18.9357H16.625V16.9357H13.125V18.9357ZM16.625 18.9357C17.0352 18.9357 17.375 19.2755 17.375 19.6857H19.375C19.375 18.1709 18.1398 16.9357 16.625 16.9357V18.9357ZM17.375 19.6857V22.3107H19.375V19.6857H17.375ZM17.375 22.3107C17.375 22.7209 17.0352 23.0607 16.625 23.0607V25.0607C18.1398 25.0607 19.375 23.8255 19.375 22.3107H17.375ZM28.875 23.0607H25.375V25.0607H28.875V23.0607ZM25.375 23.0607C24.9648 23.0607 24.625 22.7209 24.625 22.3107H22.625C22.625 23.8255 23.8602 25.0607 25.375 25.0607V23.0607ZM24.625 22.3107V19.6857H22.625V22.3107H24.625ZM24.625 19.6857C24.625 19.2755 24.9648 18.9357 25.375 18.9357V16.9357C23.8602 16.9357 22.625 18.1709 22.625 19.6857H24.625ZM25.375 18.9357H28.875V16.9357H25.375V18.9357ZM28.875 18.9357C29.2852 18.9357 29.625 19.2755 29.625 19.6857H31.625C31.625 18.1709 30.3898 16.9357 28.875 16.9357V18.9357ZM29.625 19.6857V22.3107H31.625V19.6857H29.625ZM29.625 22.3107C29.625 22.7209 29.2852 23.0607 28.875 23.0607V25.0607C30.3898 25.0607 31.625 23.8255 31.625 22.3107H29.625ZM34.25 12.2382L34.1975 6.98823L32.1976 7.00823L32.25 12.2582L34.25 12.2382ZM33.1975 5.99823H25.4975V7.99823H33.1975V5.99823Z"
          fill={isSelected ? "white" : "#002B5B"}
        />
      </svg>
    ),
  },
  {
    name: "Plot",
    value: 'plot',
    icon: (isSelected) => (
      <svg
        width="43"
        height="43"
        viewBox="0 0 43 43"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.1452 4.07875L34.5377 10.2212C35.8677 10.9387 35.8677 12.9862 34.5377 13.7037L23.1452 19.8462C22.1302 20.3887 20.9402 20.3887 19.9252 19.8462L8.53266 13.7037C7.20266 12.9862 7.20266 10.9387 8.53266 10.2212L19.9252 4.07875C20.9402 3.53625 22.1302 3.53625 23.1452 4.07875Z"
          stroke="#002B5B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.85266 17.8512L17.4402 23.1537C18.7527 23.8187 19.5927 25.1662 19.5927 26.6362V36.6462C19.5927 38.0987 18.0702 39.0262 16.7752 38.3787L6.18766 33.0762C4.87516 32.4112 4.03516 31.0637 4.03516 29.5937V19.5837C4.03516 18.1312 5.55766 17.2037 6.85266 17.8512Z"
          stroke="#002B5B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M36.2177 17.8512L25.6302 23.1537C24.3177 23.8187 23.4777 25.1662 23.4777 26.6362V36.6462C23.4777 38.0987 25.0002 39.0262 26.2952 38.3787L36.8827 33.0762C38.1952 32.4112 39.0352 31.0637 39.0352 29.5937V19.5837C39.0352 18.1312 37.5127 17.2037 36.2177 17.8512Z"
          stroke="#002B5B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];




export default function PropertySupplyClient({ initialProjects, typeName }) {
  const [projects] = useState(initialProjects);
  const [activeTab, setActiveTab] = useState("apartment");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);


  return (
    <div className="bg-[#F3F8FA] rounded-md p-4">
      <p className=" text-lg font-medium">Explore More Properties</p>

      <div className="flex py-2 my-2 gap-3 rounded-xl justify-start overflow-x-auto h-[74px]">
        {tabs?.map((tab, i) => (
          <button
            type="button"
            aria-label="Select Tab"
            key={i}
            className={`flex-1 px-4 py-1 font-medium flex items-center justify-start gap-2 md:gap-4 transition-all duration-300 border rounded-xl min-w-44
            ${activeTab === tab.value
                ? "bg-[#002B5B] text-white border-[#002B5B]"
                : "bg-white text-[#002B5B] hover:bg-gray-200"
              }
          `}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.icon ? tab.icon(activeTab === tab.value) : null}
            <div className="grid justify-start items-start text-start">
              <p className=" text-[16px] leading-[22.4px] font-[500]">{tab.name}</p>
              <p className=" text-[12px] leading-[16.8px] font-[400]">
                {Number(projects?.find(d => d.type === tab.value)?.total || 0)} Properties
              </p>
            </div>
          </button>
        ))}
      </div>

      <hr className=" border-[#BABABA] md:border-t-[0.5px] my-4" />

      <div className="mt-4">
        {projects.length === 0 && (
          <p className="text-gray-500 text-center">No properties available.</p>
        )}

        <Carousel
          rows={3}
          items={projects?.find(d => d.type === activeTab)?.projects}
          itemWidth={320}
          aspect="h-fit"
          showDots={false}
          renderItem={(property, index) => {
            const isLastRow = index >= projects?.find(d => d.type === activeTab)?.projects?.length - 3;
            return (
              <Link
                href={`/`}
                key={property?.id}
              >
                <div
                  className={`p-2 flex items-center w-full gap-3  ${isLastRow ? "" : "border-r border-gray-400"} `}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-md relative">
                    <Image
                      src={property?.banner}
                      alt={property.name}
                      sizes="64px"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className=" text-base font-medium text-[#002B5B]  line-clamp-1 max-w-[220px]">
                      {property.name}
                    </h3>
                    <p className="text-sm font-normal text-[#002B5B] underline">

                      {property.priceRange}
                    </p>
                  </div>
                </div>
              </Link>
            );
          }}
        />
      </div>
    </div>
  );
}