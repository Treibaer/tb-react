import {
  AcademicCapIcon,
  BeakerIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
export default function Dashboard() {
  return (
    <div>
      <h1>Welcome back!</h1>
      <h1 className="text-3xl font-bold h-4 p-4">Hello world!</h1>

      <div>
        <p className="p-6">
          <AcademicCapIcon className="size-6 text-gray-300" />
          <img src="/icons/ab.svg" alt="ab" />
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      </div>
    </div>
  );
}
