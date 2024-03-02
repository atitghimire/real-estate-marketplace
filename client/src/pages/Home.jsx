import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Picture from "../assets/home.jpg";
import Picture1 from "../assets/home1.jpg";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { Footer } from "./Footer";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div
        style={{
          backgroundImage: `url(${Picture})`,
          backgroundSize: "auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "600px", // Set a height for the container to see the background
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            filter: "brightness(100%)", // Adjust the brightness value
          }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-xl lg:text-5xl font-bold mb-4 text-gray-800">
              Find your next perfect place with ease
            </h1>
            <p className="text-lg text-gray-950 mb-8">
              PropSphere is the best place to find your next perfect place to
              live. We have a wide range of properties for you to choose from.
            </p>
            <Link
              to={"/search"}
              className="text-md bg-slate-700 text-white font-bold px-6 py-2 rounded-md hover:bg-slate-600 transition duration-300"
            >
              Let's Go
            </Link>
          </div>
        </div>
      </div>

      {/* swiper
      <Swiper loop navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper> */}

      {/* listing results for offer, sale, and rent */}
      <div className=" mx-auto m-10">
        {offerListings && offerListings.length > 0 && (
          <section className="mb-12 p-8">
            <div className="flex flex-col items-center mb-6">
              <h4 className="font-semibold mb-2" style={{ color: "#656565" }}>
                Properties
              </h4>
              <h2 className="text-3xl font-semibold text-slate-800 mb-2">
                Display Latest & Offer Properties
              </h2>
              <p className="mb-2" style={{ color: "#656565" }}>
                Get started by choosing from one of our properties
              </p>
            </div>
            <div className="flex justify-around mb-5">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
            <div className="flex items-center justify-center">
              <Link
                to={"/search?offer=true"}
                className="text-lg text-blue-800 hover:underline"
              >
                View All
              </Link>
            </div>
          </section>
        )}

        <div
          className="mb-5"
          style={{
            backgroundImage: `url(${Picture1})`,
            backgroundSize: "auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2 className=" text-3xl flex justify-center font-semibold text-slate-800 m-4">
            Find your best place for living.
          </h2>
          <Link
            to={"/search"}
            className="text-md bg-slate-700 text-white font-bold px-6 py-2 rounded-md hover:bg-slate-600 transition duration-300"
          >
            Let's Go
          </Link>
        </div>

        {rentListings && rentListings.length > 0 && (
          <section className=" p-8">
            <div className="flex justify-center mb-6">
              <h2 className="text-3xl font-semibold text-slate-800">
                Property for Rent
              </h2>
            </div>
            <div className="flex justify-around mb-5">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
            <div className="flex items-center justify-center">
              <Link
                to={"/search?offer=true"}
                className="text-lg text-blue-800 hover:underline"
              >
                View All
              </Link>
            </div>
          </section>
        )}

        {saleListings && saleListings.length > 0 && (
          <section className="p-8">
            <div className="flex justify-center mb-6">
              <h2 className="text-3xl font-semibold text-slate-800">
                Property for Sale
              </h2>
            </div>
            <div className="flex justify-around mb-5">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
            <div className="flex items-center justify-center">
              <Link
                to={"/search?offer=true"}
                className="text-lg text-blue-800 hover:underline"
              >
                View All
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
