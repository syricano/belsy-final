const ImagePicker = ({ images, selected, onSelect }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4">
      {images.map((url) => (
        <img
          key={url}
          src={url}
          alt="uploaded"
          className={`h-24 object-cover rounded cursor-pointer border-2 ${
            selected === url ? 'border-primary ring-2' : 'border-gray-200'
          }`}
          onClick={() => onSelect(url)}
        />
      ))}
    </div>
  );
};

export default ImagePicker;
