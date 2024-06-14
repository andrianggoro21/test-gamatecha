import React from 'react';
import Image from 'next/image';

const CardArticle = ({ article }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="relative w-full h-40 mb-2">
        <Image
          src={article.image}
          alt={article.title}
          layout="fill" 
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">{article.website.name}</span>
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default CardArticle;
