import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [points, setPoints] = useState(0);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.userId || "User");
      console.log(payload.userId);
    }
  }, []);

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (userId) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/ans/user-points/${userId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            setPoints(data.data.totalPoints);
          } else {
            console.error("Failed to fetch user points");
          }
        } catch (error) {
          console.error("Error fetching user points:", error);
        }
      }
    };

    fetchUserPoints();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserId("");
  };

  return (
    <div>
      <nav className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-800">
        <div className="flex justify-between items-center w-full md:w-auto">
          <div className="md:hidden">
            <button
              className="text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="md:hidden">
            <div className="flex items-center bg-gray-500 rounded-full px-4 py-1">
              <Image
                src="/coin.png"
                alt="Coin"
                width={20}
                height={20}
                className="mr-2"
              />
              <span className="text-white font-bold">{points}</span>
            </div>
          </div>
        </div>
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto mt-4 md:mt-0`}
        >
          {!isLoggedIn ? (
            <>
              <Link href="/signup">
                <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors w-full md:w-auto">
                  Sign Up
                </button>
              </Link>
              <Link href="/signin">
                <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors w-full md:w-auto">
                  Sign In
                </button>
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors w-full md:w-auto"
              >
                Logout
              </button>
            </>
          )}
          <div className="hidden md:block">
            <div className="flex items-center bg-gray-500 rounded-full px-4 py-2">
              <Image
                src="/coin.png"
                alt="Coin"
                width={25}
                height={25}
                className="mr-2"
              />
              <span className="text-white font-bold">{points}</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
