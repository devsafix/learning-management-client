import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, CreditCard } from "lucide-react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams()[0];
  const navigate = useNavigate();

  const transactionId = searchParams.get("transactionId");
  const message = searchParams.get("message");
  const amount = searchParams.get("amount");
  const status = searchParams.get("status");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 px-4">
      <Card className="max-w-lg w-full bg-slate-800/60 border-slate-700/90 shadow-xl backdrop-blur">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            {status === "success" ? (
              <CheckCircle2 className="w-20 h-20 text-green-400 animate-bounce" />
            ) : (
              <CreditCard className="w-20 h-20 text-yellow-400 animate-pulse" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white">
            {status === "success" ? "Payment Successful 🎉" : "Payment Pending"}
          </h1>

          {/* Message */}
          <p className="text-slate-300">{message || "Transaction completed"}</p>

          {/* Transaction Details */}
          <div className="bg-slate-900/50 rounded-lg p-4 text-left space-y-2 border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              <span className="font-semibold text-white">Transaction ID:</span>{" "}
              {transactionId}
            </p>
            <p className="text-slate-400 text-sm">
              <span className="font-semibold text-white">Amount:</span> 💲
              {amount}
            </p>
            <p className="text-slate-400 text-sm">
              <span className="font-semibold text-white">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  status === "success"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {status}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              className="w-full sm:w-auto font-semibold"
              onClick={() => navigate("/user-my-courses")}
            >
              Go to My Courses <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto hover:text-black cursor-pointer"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
