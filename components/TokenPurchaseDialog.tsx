'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PenTool, CreditCard, Loader2, Plus } from 'lucide-react';
import { updateUserTokens } from '@/app/actions';
import { toast } from 'sonner';

interface TokenPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTokens: number;
  requiredTokens: number;
  onPurchaseComplete: (newBalance: number) => void;
}

const TOKEN_PACKAGES = [
  { amount: 50, price: 5, popular: false },
  { amount: 100, price: 9, popular: true },
  { amount: 250, price: 20, popular: false },
  { amount: 500, price: 35, popular: false },
];

export default function TokenPurchaseDialog({
  open,
  onOpenChange,
  currentTokens,
  requiredTokens,
  onPurchaseComplete,
}: TokenPurchaseDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState(TOKEN_PACKAGES[1]); // Default to popular package
  const [isPurchasing, setIsPurchasing] = useState(false);

  const tokensNeeded = Math.max(0, requiredTokens - currentTokens);
  const newBalance = currentTokens + selectedPackage.amount;
  const willHaveEnough = newBalance >= requiredTokens;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    
    try {
      const result = await updateUserTokens(selectedPackage.amount);
      
      if (result.success) {
        toast.success(`Successfully purchased ${selectedPackage.amount} tokens!`);
        onPurchaseComplete(result.newBalance);
        onOpenChange(false);
      } else {
        toast.error(result.error || 'Failed to purchase tokens');
      }
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      toast.error('Failed to purchase tokens');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            Purchase Tokens
          </DialogTitle>
          <DialogDescription>
            You need more tokens to complete this booking. Purchase tokens to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Balance</span>
              <div className="flex items-center gap-1">
                <PenTool className="h-3 w-3 text-primary" />
                <span className="font-medium">{currentTokens} tokens</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Required for Booking</span>
              <div className="flex items-center gap-1">
                <PenTool className="h-3 w-3 text-primary" />
                <span className="font-medium">{requiredTokens} tokens</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tokens Needed</span>
              <div className="flex items-center gap-1">
                <PenTool className="h-3 w-3 text-red-500" />
                <span className="font-medium text-red-600">{tokensNeeded} tokens</span>
              </div>
            </div>
          </div>

          {/* Token Packages */}
          <div className="space-y-3">
            <h4 className="font-medium">Choose a Token Package</h4>
            <div className="grid grid-cols-2 gap-2">
              {TOKEN_PACKAGES.map((pkg) => (
                <button
                  key={pkg.amount}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative p-3 rounded-lg border-2 transition-colors text-left ${
                    selectedPackage.amount === pkg.amount
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 -right-2 text-xs">Popular</Badge>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <PenTool className="h-3 w-3 text-primary" />
                      <span className="font-semibold">{pkg.amount} tokens</span>
                    </div>
                    <div className="text-sm text-muted-foreground">${pkg.price}</div>
                    <div className="text-xs text-muted-foreground">
                      ${(pkg.price / pkg.amount).toFixed(3)} per token
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Purchase Summary */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-900">After Purchase</span>
                <div className="flex items-center gap-1">
                  <PenTool className="h-3 w-3 text-primary" />
                  <span className="font-medium text-blue-900">{newBalance} tokens</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {willHaveEnough ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-700">
                      You'll have enough tokens for this booking!
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm text-orange-700">
                      You'll still need {requiredTokens - newBalance} more tokens
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPurchasing}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={isPurchasing} className="w-full sm:w-auto">
            {isPurchasing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Purchase {selectedPackage.amount} Tokens - ${selectedPackage.price}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
