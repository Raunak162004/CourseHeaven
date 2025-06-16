import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-black to-blue-950 h-screen text-white">
      {/* header */}
      <header className="flex place-content-between p-6">
        <div className="flex text-white items-center gap-1">
          <img
            className="h-10 rounded-full"
            src="../../public/logo.webp"
            alt=""
          />
          <h1 className="text-2xl text-orange-500 font-bold">CourseHeaven</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/Login"
            className="text-white border py-2 px-4 rounded-md cursor-pointer"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-white border py-2 px-4 rounded-md cursor-pointer"
          >
            Signup
          </Link>
        </div>
      </header>

      {/* main */}
      <section className="text-center">
        <h1 className="text-4xl font-semibold text-orange-500">CourseHeaven</h1>
        <br />
        <p className="text-gray-500">
          Sharpen your skills with courses crafted by experts.
        </p>
        <div className="space-x-4 mt-8">
          <button className="py-3 px-6 font-semibold rounded-md cursor-pointer hover:bg-green-500 transition-all border">
            Explore Courses
          </button>
          <button className="py-3 px-6 font-semibold rounded-md cursor-pointer hover:bg-green-500 transition-all border">
            Courses Videos
          </button>
        </div>
      </section>
      <section className="p-6">section1</section>

      <hr />

      {/* footer */}
      <footer className="p-6 my-8">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col items-center md: start">
            <div className="flex text-white items-center gap-1">
              <img
                className="h-10 rounded-full"
                src="../../public/logo.webp"
                alt=""
              />
              <h1 className="text-2xl text-orange-500 font-semibold">
                CourseHeaven
              </h1>
            </div>
            <div className="mt-6">
              <p className="mb-2">Follow Us at</p>
              <div className="flex gap-4">
                <a href="">
                  <FaFacebook className="hover:text-blue-400 text-2xl transition-all duration-300"/>
                </a>
                <a href="">
                  <FaLinkedin className="hover:text-blue-700 text-2xl transition-all duration-300"/>
                </a>
                <a href="">
                  <FaXTwitter className="hover:text-pink-700 text-2xl transition-all duration-300"/>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-6">Connects</h3>
            <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">Github</li>
                <li className="hover:text-white cursor-pointer duration-300">LinkedIn</li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-6">Copyrights &#xA9;</h3>
            <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">Terms and conditions </li>
                <li className="hover:text-white cursor-pointer duration-300">Privacy policy</li>
                <li className="hover:text-white cursor-pointer duration-300">Refund and cancellation</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
