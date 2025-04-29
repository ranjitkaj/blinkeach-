import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Copy, 
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  open, 
  onOpenChange, 
  productName, 
  productUrl 
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = `Check out ${productName} on Blinkeach!`;
  const encodedShareText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(productUrl);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    toast({
      title: "Link copied",
      description: "Product link has been copied to clipboard",
      duration: 3000
    });
    
    setTimeout(() => setCopied(false), 3000);
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedShareText}`
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'bg-sky-500',
      url: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedUrl}`
    },
    {
      name: 'WhatsApp',
      icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652a11.882 11.882 0 005.647 1.44h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>,
      color: 'bg-green-500',
      url: `https://api.whatsapp.com/send?text=${encodedShareText}%20${encodedUrl}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'Email',
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-red-500',
      url: `mailto:?subject=${encodedShareText}&body=${encodeURIComponent(`I thought you might be interested in this product: ${productUrl}`)}`
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share this product</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-3 py-4">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1"
              onClick={(e) => {
                if (link.name === 'Email') return; // Allow default behavior for email
                e.preventDefault();
                window.open(link.url, '_blank', 'width=600,height=400');
              }}
            >
              <div className={`${link.color} text-white p-3 rounded-full hover:opacity-90 transition-opacity`}>
                {link.icon}
              </div>
              <span className="text-xs">{link.name}</span>
            </a>
          ))}
        </div>
        <div className="flex items-center border rounded p-2 mt-2">
          <span className="flex-1 text-sm truncate">{productUrl}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
            className="ml-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="text-xs text-center text-neutral-500 mt-4">
          Share this product with your friends and family
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;