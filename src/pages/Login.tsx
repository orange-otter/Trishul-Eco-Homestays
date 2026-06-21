import { Button, Input } from '../components/ui';

export default function Login() {
  return (
    <div className="min-h-[60vh] py-16 flex justify-center items-center px-4">
      <div className="w-full max-w-[450px] bg-surface dark:bg-gray-800 p-10 rounded-2xl shadow-md border border-border dark:border-gray-700">
        <h1 className="text-4xl font-bold text-primary-hover dark:text-primary-light text-center mb-4 font-serif">
          Welcome Back
        </h1>
        <p className="text-lg text-text-secondary dark:text-gray-400 text-center mb-8">
          Login to manage your bookings and homestay listings.
        </p>
        
        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="hello@example.com" 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
          />
          <Button variant="primary" size="lg" className="w-full mt-4">
            Sign In
          </Button>
        </form>
        
        <p className="text-center mt-8 text-text-secondary dark:text-gray-400 text-sm">
          Don't have an account? <span className="text-primary dark:text-primary-light font-medium cursor-pointer hover:underline">Sign up</span>
        </p>
      </div>
    </div>
  );
}
