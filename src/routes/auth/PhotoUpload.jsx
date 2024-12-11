"use client"
import { useState, useRef } from 'react';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const PhotoUpload = ({ aspectRatio, onPhotoSelect, initialPreview }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(initialPreview);
    const cropperRef = useRef(null);

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImage(reader.result);
            });
            reader.readAsDataURL(file);
        }
    };

    const saveImage = async () => {
        const canvas = cropperRef.current ? cropperRef.current.getCanvas() : null;
        
        if (canvas) {
            try {
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
                
                // Create preview
                const previewUrl = URL.createObjectURL(blob);
                setPreview(previewUrl);

                // Call onPhotoSelect with blob and preview
                if (onPhotoSelect) {
                    onPhotoSelect(blob, previewUrl);
                }

                document.getElementById('close-modal').click();
            } catch (error) {
                console.error('Error in canvas processing:', error);
                toast.error('Error processing image');
            }
        } else {
            toast.error('No image selected');
        }
    };

    return (
        <div>
            <div className='font-semibold'>Upload your photo</div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='h-20 w-20 flex justify-center items-center border rounded-full mt-2 overflow-hidden cursor-pointer'>
                        {preview ? (
                            <img 
                                src={preview} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className='p-1 flex justify-center items-center rounded-full custom-glass-2 text-gray-600 dark:bg-zinc-900 dark:border-zinc-800'>
                                <Upload size={24} />
                            </div>
                        )}
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Resize and crop your photo</DialogTitle>
                        <DialogDescription>
                           Select a photo to crop and resize it to your liking.
                        </DialogDescription>
                    </DialogHeader>
                    <input 
                        className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2' 
                        type="file" 
                        accept="image/*" 
                        aria-describedby="file_input_help" 
                        onChange={onSelectFile} 
                    />
                    {image && 
                        <Cropper
                            ref={cropperRef}
                            src={image}
                            className="cropper"
                            aspectRatio={aspectRatio}
                            resizeCoordinates={false}
                        />
                    }
                    
                    <DialogFooter className="">
                        <DialogClose asChild className='lg:mt-0 md:mt-0 mt-2'>
                            <Button id="close-modal" className="dark:bg-zinc-800 text-white">Close</Button>
                        </DialogClose>
                        <Button 
                            className="dark:bg-zinc-800 text-white flex gap-2" 
                            onClick={saveImage} 
                            disabled={!image}
                        >
                            Okay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PhotoUpload;

PhotoUpload.propTypes = {
    aspectRatio: PropTypes.number.isRequired,
    onPhotoSelect: PropTypes.func,
    initialPreview: PropTypes.string
};