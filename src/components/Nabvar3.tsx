"use client";
import Link from 'next/link';

const Nabvar3 = () => {
  


  return (
    <nav className="bg-[#1D1257] py-2 flex justify-center items-center">
      <ul className="flex list-none p-0 m-0 space-x-5">
        {/* Navigation Links */}
        <li>
          <Link href="/admin/dashboard">
            <div className="bg-[#0059A0] font-bold text-white py-2 px-4 rounded-md transition-all duration-300 hover:bg-[#0E1AC6]" aria-label="Home">
              Home
            </div>
          </Link>
        </li>

        <li className="relative">
          <Link href="/admin/teamList" >
           <div
            className="cursor-pointer bg-[#0059A0] font-bold text-white py-2 px-4 rounded-md transition-all duration-300 hover:bg-[#0E1AC6]"
          >

Team List
          </div>
          </Link>
         
         
        </li>

        <li className="relative" >
        <Link href="/admin/playerList" >
           <div
            className="cursor-pointer bg-[#0059A0] font-bold text-white py-2 px-4 rounded-md transition-all duration-300 hover:bg-[#0E1AC6]"
          >

Player List
          </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nabvar3;
