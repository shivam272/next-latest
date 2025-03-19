import Link from "next/link";

const App: React.FC = () => {
  return (
    <div>
      <Link href="/meals" className="text-blue-500 hover:underline">
        Meals page
      </Link>
      <Link href="/community" className="text-blue-500 hover:underline">
        Community
      </Link>
    </div>
  );
};

export default App;
