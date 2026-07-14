export default function Avatar({ name }) {
  return (
    <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full font-bold">
      {name?.charAt(0) || "?"}
    </div>
  );
}