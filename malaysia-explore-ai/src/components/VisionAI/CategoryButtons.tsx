import { GraduationCap, FileText, DollarSign, Building, BookOpen } from "lucide-react";

interface CategoryButton {
  id: string;
  icon: React.ReactNode;
  text: string;
  bgColor: string;
}

const categories: CategoryButton[] = [
  {
    id: "popular-majors",
    icon: <GraduationCap size={20} />,
    text: "Popular Majors",
    bgColor: "category-purple"
  },
  {
    id: "malaysia-visa-requirements", 
    icon: <FileText size={20} />,
    text: "Malaysia Visa Requirements",
    bgColor: "category-blue"
  },
  {
    id: "scholarship-options",
    icon: <DollarSign size={20} />,
    text: "Scholarship Options", 
    bgColor: "category-green"
  },
  {
    id: "top-malaysian-universities",
    icon: <Building size={20} />,
    text: "Top Malaysian Universities",
    bgColor: "category-orange"
  },
  {
    id: "international-student-guide",
    icon: <BookOpen size={20} />,
    text: "International Student Guide",
    bgColor: "category-violet"
  }
];

interface CategoryButtonsProps {
  onCategoryClick?: (categoryId: string) => void;
}

const CategoryButtons = ({ onCategoryClick }: CategoryButtonsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryClick?.(category.id)}
          className={`
            ${category.bgColor} text-white 
            px-6 py-3 rounded-full 
            flex items-center gap-3 
            font-medium text-sm
            shadow-lg hover-glow
            transition-all duration-300 ease-out
            transform hover:scale-105
            whitespace-nowrap
          `}
        >
          {category.icon}
          {category.text}
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons;