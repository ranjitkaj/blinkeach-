import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Create schema for form validation
const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  price: z.coerce.number().positive({ message: 'Price must be positive' }),
  originalPrice: z.coerce.number().positive({ message: 'Original price must be positive' }).optional(),
  stock: z.coerce.number().nonnegative({ message: 'Stock cannot be negative' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  images: z.array(z.string().url({ message: 'Please enter a valid URL' })).min(1, { message: 'At least one image is required' }),
  highlights: z.array(z.string()).min(1, { message: 'At least one highlight is required' }),
  rating: z.coerce.number().min(0, { message: 'Rating must be at least 0' }).max(5, { message: 'Rating cannot exceed 5' }).optional(),
  reviewCount: z.coerce.number().min(0, { message: 'Review count cannot be negative' }).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    stock: number;
    category: string;
    images: string[];
    highlights?: string[];
    specifications?: Record<string, string>;
    rating?: number;
    reviewCount?: number;
  };
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>(
    product && product.specifications 
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );

  // Initialize the form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product ? product.price / 100 : 0, // Convert from paisa to rupees for display
      originalPrice: product?.originalPrice ? product.originalPrice / 100 : undefined,
      stock: product?.stock || 0,
      category: product?.category || '',
      images: product?.images || [''],
      highlights: product?.highlights || [''],
      rating: product?.rating || 0,
      reviewCount: product?.reviewCount || 0,
    },
  });

  // Create or update product mutation
  const productMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Convert prices from rupees to paisa
      const formattedData = {
        ...data,
        price: Math.round(data.price * 100),
        originalPrice: data.originalPrice ? Math.round(data.originalPrice * 100) : undefined,
        specifications: specifications.reduce((acc, { key, value }) => {
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, string>)
      };

      if (product?.id) {
        // Update existing product
        const response = await apiRequest('PUT', `/api/products/${product.id}`, formattedData);
        return response.json();
      } else {
        // Create new product
        const response = await apiRequest('POST', '/api/products', formattedData);
        return response.json();
      }
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Product mutation error:', error);
    }
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      // If there are image uploads, process them first
      if (imageUploads.length > 0) {
        const uploadedImageUrls = await uploadImages();
        if (uploadedImageUrls.length > 0) {
          // Add uploaded image URLs to existing URLs
          values.images = [...values.images.filter(url => url.trim() !== ''), ...uploadedImageUrls];
        }
      }
      
      // Filter out empty URLs
      values.images = values.images.filter(url => url.trim() !== '');
      
      // Ensure at least one image exists
      if (values.images.length === 0) {
        toast({
          title: 'Image Required',
          description: 'At least one product image is required.',
          variant: 'destructive',
        });
        return;
      }
      
      // Submit the form with updated values
      productMutation.mutate(values);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: 'Submission Error',
        description: 'An error occurred while submitting the form.',
        variant: 'destructive',
      });
    }
  };

  // State for image uploads
  const [imageUploads, setImageUploads] = useState<{ file: File; preview: string }[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Add/remove image URLs
  const addImageField = () => {
    const currentImages = form.getValues('images');
    form.setValue('images', [...currentImages, '']);
  };

  const removeImageField = (index: number) => {
    const currentImages = form.getValues('images');
    if (currentImages.length > 1) {
      form.setValue('images', currentImages.filter((_, i) => i !== index));
    }
  };

  // Handle file select for image upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).map(file => {
        // Create file preview
        const preview = URL.createObjectURL(file);
        return { file, preview };
      });
      setImageUploads([...imageUploads, ...newFiles]);
    }
  };

  // Remove uploaded image preview
  const removeUploadedImage = (index: number) => {
    setImageUploads(prev => {
      const newUploads = [...prev];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newUploads[index].preview);
      newUploads.splice(index, 1);
      return newUploads;
    });
  };

  // Upload images to server
  const uploadImages = async (): Promise<string[]> => {
    if (imageUploads.length === 0) {
      return [];
    }

    setUploadingImages(true);

    try {
      // If there's only one image, use single upload endpoint
      if (imageUploads.length === 1) {
        const formData = new FormData();
        formData.append('image', imageUploads[0].file);
        
        const response = await fetch('/api/uploads/images', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Clear uploads after successful upload
        imageUploads.forEach(upload => URL.revokeObjectURL(upload.preview));
        setImageUploads([]);
        
        return [data.url];
      } 
      // For multiple images, use the batch upload endpoint
      else {
        const formData = new FormData();
        imageUploads.forEach(upload => {
          formData.append('images', upload.file);
        });
        
        const response = await fetch('/api/uploads/multiple-images', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload images: ${response.statusText}`);
        }
        
        const data = await response.json();
        const urls = data.files.map((file: { url: string }) => file.url);
        
        // Clear uploads after successful upload
        imageUploads.forEach(upload => URL.revokeObjectURL(upload.preview));
        setImageUploads([]);
        
        return urls;
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload one or more images. Please try again.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  // Add/remove highlight points
  const addHighlightField = () => {
    const currentHighlights = form.getValues('highlights');
    form.setValue('highlights', [...currentHighlights, '']);
  };

  const removeHighlightField = (index: number) => {
    const currentHighlights = form.getValues('highlights');
    if (currentHighlights.length > 1) {
      form.setValue('highlights', currentHighlights.filter((_, i) => i !== index));
    }
  };

  // Add/remove specification fields
  const addSpecificationField = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecificationField = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const updateSpecificationKey = (index: number, key: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index].key = key;
    setSpecifications(newSpecifications);
  };

  const updateSpecificationValue = (index: number, value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index].value = value;
    setSpecifications(newSpecifications);
  };

  // Available categories
  const categories = [
    'Smartphones',
    'Laptops',
    'Fashion',
    'Home',
    'Electronics',
    'Beauty',
    'Books',
    'Toys',
    'Sports',
    'Appliances'
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (₹) (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0.00" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Set this higher than the actual price to show discount. Discount percentage will be automatically calculated.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Default Rating and Reviews</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Rating (0-5)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="5" 
                            placeholder="0.0" 
                            {...field} 
                            value={field.value || 0} 
                          />
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star} 
                                className="cursor-pointer"
                                onClick={() => field.onChange(star)}
                              >
                                {star <= (field.value || 0) ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                  </svg>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reviewCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Count</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          {...field} 
                          value={field.value || 0} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-gray-500">
                Setting a default rating and review count helps new products appear more established. 
                This will be overridden by real customer reviews when they're submitted.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description" 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Product Images</FormLabel>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.multiple = false;
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Upload Single Image
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.multiple = true;
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <ImageIcon className="h-4 w-4 mr-1" /> Add Multiple Images
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addImageField}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Image URL
                  </Button>
                </div>
              </div>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
              />
              
              {/* Image upload previews */}
              {imageUploads.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUploads.map((upload, index) => (
                    <div key={index} className="relative group">
                      <div className="border rounded-md overflow-hidden h-24 flex items-center justify-center bg-gray-50">
                        <img
                          src={upload.preview}
                          alt={`Upload preview ${index + 1}`}
                          className="object-contain h-full w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-70"
                      >
                        <X className="h-4 w-4 text-gray-700" />
                      </button>
                      <span className="text-xs text-gray-500 truncate block mt-1">
                        {upload.file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Existing image URLs */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Image URLs</h4>
                {form.getValues('images').map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`images.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="flex gap-2 items-center">
                              {field.value && field.value.trim() !== '' && (
                                <div className="w-8 h-8 flex-shrink-0 border rounded-md overflow-hidden">
                                  <img
                                    src={field.value}
                                    alt={`Product image ${index + 1}`}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=Error';
                                    }}
                                  />
                                </div>
                              )}
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeImageField(index)}
                      disabled={form.getValues('images').length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Product Highlights</FormLabel>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addHighlightField}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Highlight
            </Button>
          </div>
          {form.getValues('highlights').map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormField
                control={form.control}
                name={`highlights.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Enter a key feature or highlight" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={() => removeHighlightField(index)}
                disabled={form.getValues('highlights').length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Specifications</FormLabel>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addSpecificationField}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Specification
            </Button>
          </div>
          {specifications.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input 
                  placeholder="Specification (e.g. Display)" 
                  value={spec.key} 
                  onChange={(e) => updateSpecificationKey(index, e.target.value)} 
                />
                <Input 
                  placeholder="Value (e.g. 6.7-inch FHD+)" 
                  value={spec.value} 
                  onChange={(e) => updateSpecificationValue(index, e.target.value)} 
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={() => removeSpecificationField(index)}
                disabled={specifications.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="submit" disabled={productMutation.isPending} className="bg-secondary hover:bg-secondary-dark text-white">
            {productMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
