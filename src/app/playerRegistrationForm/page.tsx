import Navbar2 from '@/components/Navbar2';
import PlayerRegistrationForm from '@/components/PlayerRegistrationForm';

export default function Home() {
  return (
    <div>
              <Navbar2 />
<div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <PlayerRegistrationForm />
    </div>
    </div>
    
  );
}
