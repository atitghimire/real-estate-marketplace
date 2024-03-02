import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaLightbulb,
  FaMapMarkerAlt,
  FaParking,
  FaWater,
} from "react-icons/fa";
import Contact from "../components/Contact";
import SimilarItem from "../components/SImilarItem";
import { Footer } from "./Footer";
// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [similarListings, setSimilarListings] = useState([]);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    const fetchSimilarListings = async () => {
      try {
        const res = await fetch(`/api/listing/similar/${params.listingId}`);
        if (!res.ok) {
          throw new Error(`Error fetching similar listings: ${res.statusText}`);
        }
        const data = await res.json();
        console.log(data);
        setSimilarListings(data);
      } catch (error) {
        console.error("Error fetching similar listings:", error);
      }
    };

    fetchListing();
    fetchSimilarListings();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper loop navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex flex-col p-3 my-7 gap-4">
            <p className="text-2xl font-semibold mx-60">
              {listing.name} - Rs
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm mx-60">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4 mx-60">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  Rs{+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800 mx-60">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 mx-60">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaLightbulb className="text-lg" />
                {listing.electricity ? "Electricity" : "No Electricity"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaWater className="text-lg" />
                {listing.water ? "Water" : "No Water"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-2xl uppercase hover:opacity-95 p-3 text-lg mx-auto mt-4"
                style={{ display: "block" }}
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
            {similarListings.length > 0 && (
              <div className="my-7">
                <h2 className="text-2xl font-semibold text-center text-slate-600 mb-4">
                  Similar Property
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-5">
                  {similarListings.map((similarListing) => (
                    <SimilarItem
                      listing={similarListing}
                      key={similarListing._id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
