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
  Eye,
  EyeOff,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterUserMutation } from "@/redux/features/auth/auth.api";

// Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
    message: "Enter a valid Bangladeshi phone number (e.g. +88017XXXXXXXX).",
  }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const res = await registerUser(values).unwrap();
      toast.success(res.message || "Registration successful!");
      navigate("/login");
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

  return (
    <div className="min-h-screen background-image flex items-stretch">
      <div className="max-w-7xl mx-auto flex w-full">
        {/* Right Section - Login Form */}
        <div className="w-full flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-md">
            <Card className="border-none bg-transparent text-white">
              <CardHeader className="space-y-2 text-center pb-8">
                <CardTitle className="text-3xl font-bold">
                  Create a new account
                </CardTitle>
                <CardDescription className="text-white/80">
                  Fill in your details to register
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-6 text-white/80"
                  >
                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                placeholder="Enter your full name"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Phone Field */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                placeholder="+88017XXXXXXXX"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address Field */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                placeholder="Enter your full address"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-white/80">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-white underline transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
