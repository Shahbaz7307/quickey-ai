function Loader() {
  return (
    <div className="bg-zinc-800 self-start p-4 rounded-2xl text-white flex gap-2">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
    </div>
  );
}

export default Loader;
