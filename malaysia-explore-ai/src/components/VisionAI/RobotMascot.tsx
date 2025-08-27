import robotImage from "@/assets/robot-mascot.png";

interface RobotMascotProps {
  userName: string;
}

const RobotMascot = ({ userName }: RobotMascotProps) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative mb-4">
        <img 
          src={robotImage} 
          alt="VisionAI Robot Assistant" 
          className="w-32 h-32 object-contain drop-shadow-lg"
        />
        {/* Chat bubble */}
        <div className="absolute -top-2 -right-8 bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-gray-100 min-w-[120px]">
          <div className="text-sm font-medium text-gray-800">
            Hello! {userName}!
          </div>
          {/* Bubble tail */}
          <div className="absolute bottom-0 left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white transform translate-y-full"></div>
          <div className="absolute bottom-0 left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-100 transform translate-y-[7px]"></div>
        </div>
      </div>
    </div>
  );
};

export default RobotMascot;