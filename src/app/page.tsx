import Navbar2 from '@/components/Navbar2';
import Image from 'next/image';
import React from 'react';

function Page() {
  return (
    <div>
              <Navbar2 />

      <div className="relative flex justify-center items-center bg-cover bg-center text-white  h-screen">
      <Image
          src="https://techmade.s3.us-east-1.amazonaws.com/wewewe.jpeg"
          alt="Full Screen"
          width={1900}
          height={1000}
          style={{ objectFit: 'cover' }} // Updated prop usage
          className="z-0 w-full h-full px-6"
        />

      <div className="absolute text-xl lg:text-3xl md:text-3xl font-bold text-center z-10 text-shadow-md px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
        <p>WELCOME</p>
        <p>Central City Soccer</p>

      </div>
      
      <div className="absolute inset-0 opacity-40 z-1"></div> {/* Overlay */}
    </div>
    </div>
    
  );
}

export default Page;
