import Nabvar3 from '@/components/Nabvar3';
import TeamList from '@/components/TeamList';

function Page() {
  return (
    <div>
      <Nabvar3 />

       <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Teams List</h1>
      <TeamList />
    </div>
    </div>
   
  );
}

export default Page;
