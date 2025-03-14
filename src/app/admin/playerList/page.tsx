import Nabvar3 from '@/components/Nabvar3';
import PlayerList from '@/components/PlayerList';

function Page() {
  return (
    <div>
      <Nabvar3 />
       <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Player List</h1>
      <PlayerList />
    </div>
    </div>
   
  );
}

export default Page;
