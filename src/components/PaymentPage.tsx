import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ArrowLeft, CreditCard, Plus, Check } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PaymentMethod {
  id: string;
  type: "credit" | "debit" | "paypal";
  lastFour?: string;
  cardBrand?: string;
  email?: string;
}

interface FundingProject {
  id: string;
  author: string;
  avatar: string;
  projectTitle: string;
  stage: string;
  fundingGoal: number;
  currentFunding: number;
}

interface PaymentPageProps {
  project: FundingProject;
  onBack: () => void;
  onComplete: () => void;
}

export function PaymentPage({ project, onBack, onComplete }: PaymentPageProps) {
  const [savedMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      cardBrand: "Visa",
      lastFour: "4242"
    },
    {
      id: "2",
      type: "debit",
      cardBrand: "Mastercard",
      lastFour: "8888"
    },
    {
      id: "3",
      type: "paypal",
      email: "user@example.com"
    }
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("saved-1");
  const [fundingAmount, setFundingAmount] = useState<string>("");
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  
  // New payment method form fields
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardName, setNewCardName] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCVV, setNewCardCVV] = useState("");

  const remainingAmount = project.fundingGoal - project.currentFunding;
  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setFundingAmount(value);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setFundingAmount(amount.toString());
  };

  const handleSubmitPayment = () => {
    if (!fundingAmount || parseFloat(fundingAmount) <= 0) {
      toast.error("Please enter a valid funding amount");
      return;
    }

    if (selectedPaymentMethod === "new" && !newCardNumber) {
      toast.error("Please complete payment method details");
      return;
    }

    toast.success(`Successfully funded $${fundingAmount} to ${project.projectTitle}!`);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    if (method.type === "paypal") {
      return <span className="text-blue-600">PayPal</span>;
    }
    return <CreditCard className="h-5 w-5 text-[#78350f]" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-[#78350f] hover:bg-yellow-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Button>
          <h1 className="text-[#78350f]">Fund a Project</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Project Info */}
          <div>
            <Card className="p-6 border-2 border-[#78350f]/20 bg-white sticky top-6">
              <h3 className="text-[#78350f] mb-4">Project Details</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-green-500">
                  <AvatarFallback className="bg-green-500 text-white">
                    {project.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-[#78350f]">{project.author}</h4>
                  <p className="text-sm text-[#78350f]/60">Project Creator</p>
                </div>
              </div>

              <Separator className="my-4 bg-[#78350f]/10" />

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#78350f]/70 mb-1">Project Name</p>
                  <h4 className="text-[#78350f]">{project.projectTitle}</h4>
                </div>

                <div>
                  <p className="text-sm text-[#78350f]/70 mb-1">Current Stage</p>
                  <Badge className="bg-yellow-100 text-[#78350f] border border-[#78350f]/30">
                    {project.stage}
                  </Badge>
                </div>

                <Separator className="my-3 bg-[#78350f]/10" />

                <div>
                  <p className="text-sm text-[#78350f]/70 mb-2">Funding Progress</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#78350f]/70">Current</span>
                      <span className="text-green-600">${project.currentFunding.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#78350f]/70">Goal</span>
                      <span className="text-[#78350f]">${project.fundingGoal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#78350f]/70">Remaining</span>
                      <span className="text-[#78350f]">${remainingAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${fundingPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <div className="space-y-6">
            {/* Funding Amount */}
            <Card className="p-6 border-2 border-[#78350f]/20 bg-white">
              <h3 className="text-[#78350f] mb-4">Funding Amount</h3>
              
              <div className="mb-4">
                <Label htmlFor="amount" className="text-[#78350f]">Amount (USD) *</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78350f]/70">$</span>
                  <Input
                    id="amount"
                    type="text"
                    value={fundingAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="pl-7 border-[#78350f]/30 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="mb-4">
                <p className="text-sm text-[#78350f]/70 mb-2">Quick Select</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(25)}
                    className="border-[#78350f]/30 text-[#78350f] hover:bg-green-50"
                  >
                    $25
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(50)}
                    className="border-[#78350f]/30 text-[#78350f] hover:bg-green-50"
                  >
                    $50
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(100)}
                    className="border-[#78350f]/30 text-[#78350f] hover:bg-green-50"
                  >
                    $100
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(remainingAmount)}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Full Amount (${remainingAmount})
                  </Button>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6 border-2 border-[#78350f]/20 bg-white">
              <h3 className="text-[#78350f] mb-4">Payment Method</h3>

              <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <div className="space-y-3">
                  {/* Saved Payment Methods */}
                  {savedMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedPaymentMethod === `saved-${method.id}`
                          ? "border-green-500 bg-green-50"
                          : "border-[#78350f]/20 hover:border-[#78350f]/40"
                      }`}
                      onClick={() => setSelectedPaymentMethod(`saved-${method.id}`)}
                    >
                      <RadioGroupItem value={`saved-${method.id}`} id={`saved-${method.id}`} />
                      <div className="flex items-center gap-3 flex-1">
                        {getPaymentMethodIcon(method)}
                        <div className="flex-1">
                          {method.type === "paypal" ? (
                            <p className="text-[#78350f]">{method.email}</p>
                          ) : (
                            <p className="text-[#78350f]">
                              {method.cardBrand} •••• {method.lastFour}
                            </p>
                          )}
                        </div>
                        {selectedPaymentMethod === `saved-${method.id}` && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add New Payment Method */}
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedPaymentMethod === "new"
                        ? "border-green-500 bg-green-50"
                        : "border-[#78350f]/20 hover:border-[#78350f]/40"
                    }`}
                    onClick={() => {
                      setSelectedPaymentMethod("new");
                      setShowNewPaymentForm(true);
                    }}
                  >
                    <RadioGroupItem value="new" id="new" />
                    <div className="flex items-center gap-3 flex-1">
                      <Plus className="h-5 w-5 text-green-600" />
                      <p className="text-[#78350f]">Add new payment method</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              {/* New Payment Method Form */}
              {selectedPaymentMethod === "new" && showNewPaymentForm && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-[#78350f]/10 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-[#78350f]">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      value={newCardNumber}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="mt-1 bg-white border-[#78350f]/30"
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName" className="text-[#78350f]">Name on Card *</Label>
                    <Input
                      id="cardName"
                      type="text"
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value)}
                      placeholder="John Doe"
                      className="mt-1 bg-white border-[#78350f]/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-[#78350f]">Expiry *</Label>
                      <Input
                        id="expiry"
                        type="text"
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="mt-1 bg-white border-[#78350f]/30"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-[#78350f]">CVV *</Label>
                      <Input
                        id="cvv"
                        type="text"
                        value={newCardCVV}
                        onChange={(e) => setNewCardCVV(e.target.value)}
                        placeholder="123"
                        className="mt-1 bg-white border-[#78350f]/30"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Summary & Submit */}
            <Card className="p-6 border-2 border-green-500/30 bg-green-50">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-[#78350f]/70">Your Contribution</span>
                  <span className="text-[#78350f]">
                    ${fundingAmount || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78350f]/70">Processing Fee</span>
                  <span className="text-[#78350f]">$0.00</span>
                </div>
                <Separator className="bg-[#78350f]/20" />
                <div className="flex justify-between">
                  <span className="text-[#78350f]">Total</span>
                  <span className="text-green-600">${fundingAmount || "0.00"}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmitPayment}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Complete Funding
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
