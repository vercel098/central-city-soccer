import Navbar2 from '@/components/Navbar2';
import TeamRegistrationForm from '@/components/TeamRegistrationForm';

export default function Home() {
  return (
    <div>
          <Navbar2 />
           <div className="min-h-screen bg-gray-100 flex justify-center items-center">
          

      <TeamRegistrationForm />
    </div>
    </div>
   
  );
}
