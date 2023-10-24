import multer from 'multer';

// Create a function to configure multer middleware
const configureMulter = (types: string[], size: number) => {
  const storage = multer.memoryStorage();
  
  const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: any) => {
    if (!types.includes(file.mimetype)) {
      return cb(null, false);
    }
    cb(null, true);
  };
  
  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * size }
  });
};

export default configureMulter;
