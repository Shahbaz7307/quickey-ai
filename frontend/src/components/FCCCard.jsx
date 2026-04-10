function FCCCard({ fccId, frequency, chip, vehicle }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 mt-2 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📡</span>

        <h2 className="text-lg font-semibold">FCC Lookup Result</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-zinc-400">FCC ID</div>

        <div>{fccId}</div>

        <div className="text-zinc-400">Frequency</div>

        <div>{frequency}</div>

        <div className="text-zinc-400">Chip</div>

        <div>{chip}</div>

        <div className="text-zinc-400">Vehicle</div>

        <div>{vehicle}</div>
      </div>
    </div>
  );
}

export default FCCCard;
