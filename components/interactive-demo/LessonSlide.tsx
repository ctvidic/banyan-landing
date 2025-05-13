import React from 'react';

interface LessonSlideProps {
  title: string;
  content: React.ReactNode;
  imageSrc?: string; // Optional image source
  // Add other props as needed, e.g., image, slide number
}

const LessonSlide: React.FC<LessonSlideProps> = ({ title, content, imageSrc }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white">
      {imageSrc && (
        <img src={imageSrc} alt={title} className="w-32 h-32 object-contain mb-4" />
      )}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="text-gray-700 text-xs text-center">
        {content}
      </div>
      {/* Placeholder for slide number or other indicators */}
    </div>
  );
};

export default LessonSlide; 