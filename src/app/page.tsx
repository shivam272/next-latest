import NextLink from "next/link";

const App = () => {
  return (
    <div>
      <NextLink href="/meals" className="text-blue-500 hover:underline">
        Meals page
      </NextLink>
      <NextLink href="/signIn" className="text-blue-500 hover:underline">
        Sign In
      </NextLink>
      <div className="flex flex-col items-center justify-center">
        <span>Random Content </span>
        <span>Random Content 2 </span>
      </div>
    </div>
  );
};

export default App;
