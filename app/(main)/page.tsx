export default function Home() {
  return (
    <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0)),url('/assets/banner.jpg')] bg-cover bg-center h-screen w-full">
      <div className="w-[90%] mx-auto pt-[15em] h-screen">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Welcome to the <br /> Rent Management System
          </h1>
          <p className="text-lg text-white mb-4">
            Streamline your rental operations with ease and confidence.
          </p>
          <p className="text-lg text-white mb-8">
            Sign up today to take full control of your rental properties and
            simplify your management tasks.
          </p>
          <button className="bg-white text-black py-2 px-6 rounded-full">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
