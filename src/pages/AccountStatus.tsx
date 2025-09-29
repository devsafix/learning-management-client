import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const AccountStatus = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(90vh-64px)] px-4 pt-10 text-center bg-[#0A091A] text-white">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Account Blocked</h1>
      <p className="text-lg max-w-2xl mb-6">
        Your account has been blocked or suspended due to a violation of our
        terms of service. You will not be able to access your dashboard or use
        our services.
      </p>
      <p className="text-md mb-8">
        For more information or to resolve this issue, please contact support.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
          <Link to="/">Go to Homepage</Link>
        </Button>
        <Button
          variant="outline"
          className="border-white/30 text-white hover:text-white bg-white/10 hover:bg-white/5 backdrop-blur-sm font-semibold px-8 py-3 rounded-full cursor-pointer"
        >
          <Link to="https://wa.me/8801709190412" target="_blank">
            Contact Support
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AccountStatus;
