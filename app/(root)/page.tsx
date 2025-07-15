import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0)),url('/assets/banner.jpg')] bg-cover bg-center h-screen w-full">
      <div className="w-[90%] mx-auto pt-[15em] h-screen">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Welcome to <br />
            <span className="text-white">MyRental-Hub</span>
          </h1>
          <p className="text-lg text-white mb-4">
            Hassle-free rent tracking and roommate splitting—made simple.
          </p>
          <p className="text-lg text-white mb-8">
            Manage rent, utilities, and payments effortlessly with your
            housemates. <br /> Keep everything fair and transparent in one
            place.
          </p>
          <Link
            href="/register"
            className="bg-white text-black py-3 px-6 rounded-full cursor-pointer"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
