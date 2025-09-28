import { CheckCircle, Star } from "lucide-react"; // Using Lucide for the checkmark and stars

// 1. Define the TypeScript interface for the data
interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatarInitials: string; // Used if no image URL is provided
  imageSrc?: string; // Optional image URL
  text: string;
  rating: number; // 5-star rating
}

// 2. Data array containing the content from the image
const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Jeremy McCabe",
    role: "Software Developer",
    avatarInitials: "JM",
    text: "The focus on core concepts made everything click. After watching Kawser’s free content, I knew I had to invest in the full course.",
    rating: 5,
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    role: "Software Developer",
    avatarInitials: "A",
    text: "Kawser breaks down complex topics effortlessly. Learning about runtime environments and writing code like a senior developer was a game-changer for me.",
    rating: 5,
  },
  {
    id: 3,
    name: "Community Member",
    role: "Software Developer",
    avatarInitials: "CM",
    text: "I got a job using your 3D portfolio tutorial. You literally changed my life thank you!",
    rating: 5,
  },
  {
    id: 4,
    name: "Alvin Kuishinbõ",
    role: "Software Developer",
    avatarInitials: "A",
    text: "I gained production-level skills I never learned on the job, like optimizing function flow and server actions. This course filled gaps my work experience couldn’t.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lucas Sousa",
    role: "Software Developer",
    avatarInitials: "L",
    text: "Code Learner’s tutorials are clear, modern, and practical. They helped me build real projects that impressed employers. If you want to learn web dev the right way, this is it.",
    rating: 5,
  },
  {
    id: 6,
    name: "Santiago Laight",
    role: "Full-stack engineer",
    avatarInitials: "S",
    text: "Starting out can feel overwhelming, even after a bootcamp, but this program is unique in its strong mentor support, hands-on projects, access to modern technology, and help with side projects.",
    rating: 5,
  },
  {
    id: 7,
    name: "Anyars Yussif",
    role: "Software Developer",
    avatarInitials: "A",
    text: "File-based routing, dynamic routes, API creation—Kawser made it all simple. Code Learner Pro has transformed how I understand web development.",
    rating: 5,
  },
  {
    id: 8,
    name: "Musawir Raji",
    role: "Software Developer",
    avatarInitials: "M",
    text: "Kawser is the best tutor! I finally understand backend architecture, especially Next.js, which always confused me. Now, I can confidently tackle any project.",
    rating: 5,
  },
  {
    id: 9,
    name: "Zahidul Islam",
    role: "Software Developer",
    avatarInitials: "Z",
    text: "I’ve been following Code Learner since 2024, and no other resource compares. The content is always up to date, detailed, and incredibly well-explained.",
    rating: 5,
  },
];

// 3. Testimonial Card Component
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => {
  // Simple color mapping based on initial for the placeholder circle
  const colorMap: { [key: string]: string } = {
    J: "bg-blue-600",
    A: "bg-red-600",
    C: "bg-green-600",
    L: "bg-indigo-600",
    S: "bg-yellow-600",
    M: "bg-pink-600",
    Z: "bg-purple-600",
    default: "bg-gray-600",
  };
  const bgColor =
    colorMap[testimonial.avatarInitials.charAt(0)] || colorMap.default;

  return (
    <div className="p-6 rounded-xl relative h-full flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]">
      {/* Header (Profile Info) */}
      <div className="flex items-start mb-4">
        {/* Avatar Placeholder */}
        {testimonial.imageSrc ? (
          <img
            src={testimonial.imageSrc}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 ${bgColor}`}
          >
            {testimonial.avatarInitials}
          </div>
        )}

        {/* Name and Role */}
        <div>
          <div className="flex items-center text-white font-semibold">
            {testimonial.name}
            <CheckCircle
              className="w-4 h-4 text-blue-400 ml-1"
              fill="currentColor"
            />
          </div>
          <div className="text-sm text-gray-400">{testimonial.role}</div>
        </div>
      </div>

      {/* Testimonial Text */}
      <p className="text-white/80 text-base flex-grow mb-4">
        {testimonial.text}
      </p>

      {/* Rating Stars */}
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5"
            fill={i < testimonial.rating ? "#FFC700" : "#4B5563"} // Gold color for filled stars
            strokeWidth={0}
          />
        ))}
      </div>
    </div>
  );
};

export default function Testimonials() {
  return (
    <div className="bg-[#0A091A]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            What Devs Say About.{" "}
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Code Learner.
            </span>
          </h2>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-primary to-yellow-400 mx-auto rounded-full"></div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}
