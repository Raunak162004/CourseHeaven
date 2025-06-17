import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      setIsLoggedIn(false);
      localStorage.removeItem("user")
    } catch (err) {
      console.log("error in logging out", err);
      toast.error(error.response.data.errors || "error in logging out");
    }
  };

  // console.log(courses);
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4001/api/v1/course/courses",
        {
          withCredentials: true,
        }
      );
      //   console.log(response.data);
      setCourses(response.data.courses);
    } catch (err) {
      console.log("error in fetching courses", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("user");
    if(token){
      setIsLoggedIn(true)
    }
    else{
      setIsLoggedIn(false)
    }
  },[]);

  useEffect(() => {
    fetchCourses();
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 h-screen text-white overflow-y-auto">
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
          {isLoggedIn ? (
            <button className="bg-transparent text-white py-2 px-4 border border-white rounded-md cursor-pointer" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
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
            </>
          )}
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

      <section className="p-6">
        <Slider {...settings}>
          {courses.map((course) => {
            return (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      className="h-32 w-full object-contain"
                      src={course.image.url}
                      alt="not loading"
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white">
                        {course.title}
                      </h2>
                      <button className="bg-white mt-4 text-black font-semibold py-1 px-2 rounded-full hover:bg-orange-400 hover:text-white ">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </section>

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
                  <FaFacebook className="hover:text-blue-400 text-2xl transition-all duration-300" />
                </a>
                <a href="">
                  <FaLinkedin className="hover:text-blue-700 text-2xl transition-all duration-300" />
                </a>
                <a href="">
                  <FaXTwitter className="hover:text-pink-700 text-2xl transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-6">Connects</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer duration-300">
                Github
              </li>
              <li className="hover:text-white cursor-pointer duration-300">
                LinkedIn
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-6">Copyrights &#xA9;</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer duration-300">
                Terms and conditions{" "}
              </li>
              <li className="hover:text-white cursor-pointer duration-300">
                Privacy policy
              </li>
              <li className="hover:text-white cursor-pointer duration-300">
                Refund and cancellation
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
