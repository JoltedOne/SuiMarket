import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function In_Image({ 
  imageId, 
  title, 
  price, 
  creator, 
  creatorImageId, 
  type, 
  isLink = false, 
  linkTo = null,
  currentTheme,
  className = '',
  collectionId = null,
  onImageClick = null
}) {
  const navigate = useNavigate();
  const cardStyle = `bg-transparent overflow-hidden font-['Helvetica'] flex flex-col ${currentTheme.cardHover} ${className}`;
  const imageContainerStyle = `w-full border-[25px] ${currentTheme.imageBorder} overflow-hidden`;
  const imageStyle = "w-full h-[400px] object-cover";
  const infoContainerStyle = "p-6 flex flex-col justify-between";
  const titleStyle = `text-xl font-bold ${currentTheme.text} mb-4 tracking-wide`;
  const priceStyle = `text-xs font-semibold ${currentTheme.price} tracking-wide m-[10px]`;
  const creatorStyle = `flex items-center space-x-3 ${currentTheme.description} text-sm tracking-wide`;
  const profileImageStyle = "w-8 h-8 object-cover border-2 border-[#444444]";
  const typeStyle = `text-sm ${type === '1/1' ? 'text-[#00CC6A]' : 'text-[#00994D]'} mb-2`;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onImageClick) {
      onImageClick(imageId);
    } else if (collectionId) {
      navigate(`/collections/${collectionId}/item/${imageId}`);
    }
  };

  const CardWrapper = isLink ? Link : 'div';
  const wrapperProps = isLink ? { to: linkTo } : { onClick: handleClick };

  return (
    <CardWrapper 
      {...wrapperProps} 
      className={`${cardStyle} ${(isLink || onImageClick || collectionId) ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''}`}
    >
      <div className={imageContainerStyle}>
        <img 
          src={`https://picsum.photos/seed/${imageId}/800/600`}
          alt={title}
          className={imageStyle}
        />
      </div>
      <div className={infoContainerStyle}>
        <div className="flex justify-between items-start">
          <div className="flex-grow pr-2">
            <h3 className={titleStyle}>{title}</h3>
            <div className={typeStyle}>
              {type}
            </div>
            <div className={creatorStyle}>
              <img 
                src={`https://picsum.photos/seed/profile${creatorImageId}/100/100`}
                alt={creator}
                className={profileImageStyle}
              />
              <span className="truncate">{creator}</span>
            </div>
          </div>
          <div className={priceStyle}>
            {price}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

export default In_Image; 