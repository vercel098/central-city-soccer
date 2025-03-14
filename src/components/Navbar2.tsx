"use client";
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

const Navbar2 = () => {
  const [userType, setUserType] = useState<'team' | 'player' | null>(null);
  const playerDropdownRef = useRef<HTMLLIElement>(null);
  const teamDropdownRef = useRef<HTMLLIElement>(null);

  const handleDropdownToggle = (type: 'team' | 'player') => {
    setUserType(userType === type ? null : type);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (playerDropdownRef.current && !playerDropdownRef.current.contains(event.target as Node)) &&
        (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node))
      ) {
        setUserType(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#1D1257] py-2 flex justify-center items-center">
      <ul className="flex list-none p-0 m-0 space-x-5">
        {/* Navigation Links */}
        <li>
          <Link href="/">
            <div className="bg-[#0059A0] font-bold text-white py-2 px-4 rounded-md transition-all duration-300 hover:bg-[#0E1AC6]" aria-label="Home">
              Home
            </div>
          </Link>
        </li>

        {/* Dropdown Toggler for Player and Team */}
        <li className="relative" ref={playerDropdownRef}>
          <div
            onClick={() => handleDropdownToggle('player')}
            className="cursor-pointer bg-[#0059A0] font-bold text-white py-2 px-4 rounded-md transition-all duration-300 hover:bg-[#0E1AC6]"
            aria-label="Player"
          >
            Player
          </div>
          {/* Player Dropdown */}
          {userType === 'player' && (
            <div className="absolute -right-20 w-48 bg-white shadow-lg rounded-md mt-1 z-50">
              <Link href="/playeruserprofile" className="block px-4 py-2 text-gray-800 hover:bg-[#0059A0] hover:text-white" aria-label="Player Profile">
                Player Profile
              </Link>
              <Link href="/playerRegistrationForm" className="block px-4 py-2 text-gray-800 hover:bg-[#0059A0] hover:text-white" aria-label="Player Registration">
                Player Registration
              </Link>
              <Link href="/playerlogin" className="block px-4 py-2 text-gray-800 hover:bg-[#0059A0] hover:text-white" aria-label="Player Login">
                Player Login
              </Link>
            </div>
          )}
        </li>

        <li className="relative" ref={teamDropdownRef}>
          <div
            onClick={() => handleDropdownToggle('team')}
            className="cursor-pointer bg-[#0059A0] font-bold text-white py-2 px-4 rounded-md transition-all duration-300 hover:bg-[#0E1AC6]"
            aria-label="Team"
          >
            Team
          </div>
          {/* Team Dropdown */}
          {userType === 'team' && (
            <div className="absolute right-0 w-48 bg-white shadow-lg rounded-md mt-1 z-50">
              <Link href="/teamuserprofile" className="block px-4 py-2 text-gray-800 hover:bg-[#0059A0] hover:text-white" aria-label="Team Profile">
                Team Profile
              </Link>
              <Link href="/teamregisterForm" className="block px-4 py-2 text-gray-800 hover:bg-[#0059A0] hover:text-white" aria-label="Team Registration">
                Team Registration
              </Link>
              <Link href="/teamLoginForm" className="block px-4 py-2 text-gray-800 hover:bg-[#0059A0] hover:text-white" aria-label="Team Login">
                Team Login
              </Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar2;
