function VINCard({ make, model, year, engine }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 mt-2 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🚗</span>

        <h2 className="text-lg font-semibold">VIN Decode Result</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-zinc-400">Make</div>

        <div>{make}</div>

        <div className="text-zinc-400">Model</div>

        <div>{model}</div>

        <div className="text-zinc-400">Year</div>

        <div>{year}</div>

        <div className="text-zinc-400">Engine</div>

        <div>{engine}</div>
      </div>
    </div>
  );
}

export default VINCard;
