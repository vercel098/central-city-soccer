// components/Navbar.tsx
import Image from 'next/image';

const Navbar = () => {
  return (
    <div className="bg-[#FFFFFF] py-4">
      <div className="flex items-center justify-center max-w-screen-xl mx-auto">
        <Image
          src="https://techmade.s3.us-east-1.amazonaws.com/115-ccsl-copy.jpg" // Path to your logo image
          alt="Central City Soccer Logo"
          width={50} // Adjust size as needed
          height={50} // Adjust size as needed
          style={{ objectFit: 'contain' }} // If you need objectFit, you can apply it in this way
        />
        <h1 className="text-xl lg:text-3xl md:text-3xl font-bold text-[#1D1257] ml-4">Central City Soccer</h1>
      </div>
    </div>
  );
};

export default Navbar;
