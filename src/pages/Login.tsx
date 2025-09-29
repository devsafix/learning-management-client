/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLoginUserMutation } from "@/redux/features/auth/auth.api";

// Zod schema for form validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const res = await loginUser(values).unwrap();
      toast.success(res.message || "Login successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Login failed. Please check your credentials."
      );
      if (error?.data?.message === "The user has been blocked") {
        navigate("/account-status");
        return;
      }
    }
  };

  const quickLogin = (role: "admin" | "user") => {
    if (role === "admin") {
      form.setValue("email", "admin@elearning.com");
      form.setValue("password", "12345678");
    } else {
      form.setValue("email", "devsafix@gmail.com");
      form.setValue("password", "12345678");
    }
  };

  return (
    <div className="min-h-screen background-image flex items-stretch">
      <div className="max-w-7xl mx-auto flex w-full">
        {/* Right Section - Login Form */}
        <div className="w-full flex-1 flex items-center justify-center px-4 py-12 lg:py-0">
          <div className="w-full max-w-md">
            <Card className="border-none bg-transparent text-white">
              <CardHeader className="space-y-2 text-center pb-0">
                <CardTitle className="text-3xl font-bold">
                  Log in to your account
                </CardTitle>
                <CardDescription className="text-white/80">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-center mb-4">
                    Quick Login
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/30 text-white hover:text-white bg-white/10 hover:bg-white/5 backdrop-blur-sm font-semibold px-8 py-3 rounded-full cursor-pointer"
                      onClick={() => quickLogin("admin")}
                    >
                      Admin (Instructor)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/30 text-white hover:text-white bg-white/10 hover:bg-white/5 backdrop-blur-sm font-semibold px-8 py-3 rounded-full cursor-pointer"
                      onClick={() => quickLogin("user")}
                    >
                      User (Student)
                    </Button>
                  </div>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-6 text-white/80"
                  >
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10 border-white/80"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10 pr-10 border-white/80"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-white/80">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-medium underline transition-colors text-white"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Note */}
            <div className="mt-6 text-center">
              <p className="text-xs flex items-center justify-center gap-2">
                <Shield className="h-3 w-3" />
                Your information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
