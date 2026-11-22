const Introheader = ({ title = "Analytics Club" }: { title?: string }) => {
  return (
    <div className="text-center mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-violet-500">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-rose-400 via-purple-400 to-violet-500"></div>
    </div>
  );
};

export default Introheader;
