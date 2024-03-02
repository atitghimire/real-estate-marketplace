import { Link } from "react-router-dom";
import {
  FaPodcast,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export function Footer() {
  return (
    <>
      <div className="h-[270px] w-[95%] m-auto mt-20 text-white flex bg-slate-800">
        {/* First row with 2 columns */}
        <div className="flex flex-col p-8 ">
          <div className="m-6">
            <Link to="/" className="text-4xl">
              PropSphere
            </Link>
          </div>
        </div>

        {/* Second row with 5 columns */}
        <div className="flex flex-col m-10   flex-1">
          <p className="text-lg">
            PropSphere!!! <br />
            Open to collaborations! Got an exciting idea?
            <br />
            Let's grab coffee and make our mark on the universe!
          </p>

          <div className="flex justify-between mb-5 mt-5">
            <div className="flex space-y-2 flex-col ">
              <Link to="/about-us" className="mb-2">
                About Us
              </Link>
              <Link to="/resources" className="mb-2">
                Resources
              </Link>
              <Link to="/contact-us" className="mb-2">
                Contact Us
              </Link>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl">Work With Us</p>
              <Link to="/" className="mb-2">
                Careers
              </Link>
              <Link to="/" className="mb-2">
                Internship
              </Link>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl">What We do</p>
              <Link to="/" className="mb-1">
                Property Listing
              </Link>
              <Link to="/" className="mb-1">
                Sell Property
              </Link>
              <Link to="/" className="mb-1">
                Buy Property
              </Link>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl">Connect With Us</p>
              <Link to="/facebook" className="flex items-center mb-1">
                {" "}
                <FaFacebook className="mr-2" /> Facebook
              </Link>
              <Link to="/twitter" className="flex items-center mb-1">
                {" "}
                <FaTwitter className="mr-2" /> Twitter
              </Link>
              <Link to="/instagram" className="flex items-center mb-1">
                {" "}
                <FaInstagram className="mr-2" /> Instagram
              </Link>
              <Link to="/linkedin" className="flex items-center mb-1">
                {" "}
                <FaLinkedin className="mr-2" /> Linkedin
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Third row with 2 columns */}
      <div className=" h-[66px] w-[95%] m-auto text-white flex justify-between p-8 bg-slate-800">
        <div>
          <p>Copyright 2024, PropSphere.</p>
        </div>
        <div className="space-x-4">
          <Link to="/">Privacy Policy</Link>
          <Link to="/"> Data Policy</Link>
        </div>
      </div>
    </>
  );
}
