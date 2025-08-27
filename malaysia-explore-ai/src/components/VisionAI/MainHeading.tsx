interface MainHeadingProps {
  userName: string;
}

const MainHeading = ({ userName }: MainHeadingProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3x1 md:text-3xl font-bold text-gray-800 mb-2">
        Discover the right Malaysian university for you, instantly.{" "}
        <span className="gradient-text">Start exploring!</span>
      </h1>
    </div>
  );
};

export default MainHeading;