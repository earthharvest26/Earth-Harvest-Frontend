import React, { useState } from "react";
import { X, MapPin, Lock, CheckCircle, Package, Truck, CreditCard, Shield, Award, Sparkles } from "lucide-react";

export default function PremiumCheckout({
  product,
  selectedSize,
  quantity,
  currentPrice,
  address,
  setAddress,
  onClose,
  onPayNow,
}) {
  const [step, setStep] = useState("summary");

  const totalAmount = (currentPrice?.price || 0) * quantity;
  const savings = ((currentPrice?.oldPrice || 0) - (currentPrice?.price || 0)) * quantity;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md z-[999] flex items-end sm:items-center justify-center sm:p-4">
      <div className="w-full max-w-2xl rounded-t-3xl sm:rounded-3xl bg-gradient-to-br from-[#FAF7F2] to-[#F8F2EC] border-2 border-[#E8DFD0] shadow-2xl animate-slideUp max-h-[92vh] sm:max-h-[95vh] overflow-hidden flex flex-col">

        {/* ---------- ELEGANT HEADER ---------- */}
        <div className="relative bg-gradient-to-r from-[#2D4A3E] to-[#3D5A4E] px-4 sm:px-8 py-4 sm:py-6 border-b-2 border-[#C8945C]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC00djJ6bTAtNHYyem0wLTR2MnptMC00djJ6bTAtNHYyem0wLTR2MnptMC00djJ6bTAtNHYyem0wLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#C8945C] rounded-xl flex items-center justify-center shadow-lg">
                {step === "summary" && <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                {step === "address" && <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                {step === "payment" && <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">
                  {step === "summary" && "Order Summary"}
                  {step === "address" && "Delivery Details"}
                  {step === "payment" && "Secure Payment"}
                </h2>
                <p className="text-[#C8945C] text-xs sm:text-sm font-medium hidden sm:block">
                  {step === "summary" && "Review your premium selection"}
                  {step === "address" && "Where should we deliver?"}
                  {step === "payment" && "Complete your purchase"}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all flex items-center justify-center group flex-shrink-0"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-4 sm:mt-6 flex items-center gap-2">
            <div className={`flex-1 h-1 sm:h-1.5 rounded-full transition-all ${step === "summary" || step === "address" || step === "payment" ? "bg-[#C8945C]" : "bg-white/20"}`}></div>
            <div className={`flex-1 h-1 sm:h-1.5 rounded-full transition-all ${step === "address" || step === "payment" ? "bg-[#C8945C]" : "bg-white/20"}`}></div>
            <div className={`flex-1 h-1 sm:h-1.5 rounded-full transition-all ${step === "payment" ? "bg-[#C8945C]" : "bg-white/20"}`}></div>
          </div>
        </div>

        {/* ---------- CONTENT AREA ---------- */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-8">

          {/* SUMMARY STEP */}
          {step === "summary" && (
            <div className="space-y-4 sm:space-y-6">

              {/* Premium Product Card */}
              <div className="relative bg-white rounded-2xl p-4 sm:p-6 border-2 border-[#E8DFD0] shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#C8945C]/10 to-transparent rounded-bl-full"></div>
                
                <div className="relative flex gap-3 sm:gap-5">
                  <div className="relative flex-shrink-0">
                    <img
                      src={product.images?.[0] || product.image}
                      className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl border-2 border-[#E8DFD0] object-cover shadow-md"
                      alt={product.name}
                    />
                    <div className="absolute -top-2 -right-2 bg-[#C8945C] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Premium
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-xl font-bold text-[#2D4A3E] mb-2 truncate">{product.name}</h3>
                    <div className="space-y-1.5 mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 text-[#C8945C] flex-shrink-0" />
                        <span className="text-[#6B7C72]">Size: <span className="font-semibold text-[#2D4A3E]">{selectedSize} lbs</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#C8945C] flex-shrink-0" />
                        <span className="text-[#6B7C72]">Quantity: <span className="font-semibold text-[#2D4A3E]">{quantity}</span></span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-[#C8945C]">AED {currentPrice.price.toFixed(2)}</span>
                      {currentPrice.oldPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">AED {currentPrice.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Banner */}
              {savings > 0 && (
                <div className="bg-gradient-to-r from-[#C8945C] to-[#B8844C] rounded-xl p-4 text-white flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm sm:text-lg">You're Saving!</p>
                      <p className="text-xs sm:text-sm opacity-90">Premium quality at a great price</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg sm:text-2xl font-bold">AED {savings.toFixed(2)}</p>
                    <p className="text-xs opacity-90 hidden sm:block">Off regular price</p>
                  </div>
                </div>
              )}

              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-[#E8DFD0] shadow-lg">
                <h3 className="font-bold text-[#2D4A3E] text-base sm:text-lg mb-4 sm:mb-5 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8945C]" />
                  Payment Summary
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[#E8DFD0]">
                    <span className="text-sm sm:text-base text-[#6B7C72]">Subtotal</span>
                    <span className="font-semibold text-sm sm:text-base text-[#2D4A3E]">AED {totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-[#E8DFD0]">
                    <div className="flex items-center gap-2">
                      <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-[#C8945C]" />
                      <span className="text-sm sm:text-base text-[#6B7C72]">Express Shipping</span>
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-green-600">Free</span>
                  </div>

                  <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F8F2EC] rounded-xl p-3 sm:p-4 border border-[#E8DFD0]">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#2D4A3E] text-base sm:text-xl">Total Amount</span>
                      <span className="font-bold text-[#C8945C] text-xl sm:text-3xl">
                        AED {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-[#E8DFD0] text-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8945C] mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs font-semibold text-[#2D4A3E]">Secure Payment</p>
                </div>
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-[#E8DFD0] text-center">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8945C] mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs font-semibold text-[#2D4A3E]">Fast Delivery</p>
                </div>
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-[#E8DFD0] text-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8945C] mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs font-semibold text-[#2D4A3E]">Premium Quality</p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setStep("address")}
                className="w-full bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white font-bold py-4 sm:py-5 rounded-xl 
                           shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                Continue to Delivery
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          {/* ADDRESS STEP */}
          {step === "address" && (
            <div className="space-y-4 sm:space-y-6">

              <div className="bg-gradient-to-br from-[#C8945C]/10 to-[#C8945C]/5 border-2 border-[#C8945C]/20 rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#C8945C] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2D4A3E] mb-1 text-sm sm:text-base">Fast & Free Delivery</h4>
                  <p className="text-xs sm:text-sm text-[#6B7C72]">
                    We deliver across Dubai, Abu Dhabi, and Sharjah. Your premium dog food will arrive in 2-3 business days.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#2D4A3E] mb-2">Full Name *</label>
                  <input
                    placeholder="Enter your full name"
                    value={address.name || ""}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full border-2 border-[#E8DFD0] p-3 sm:p-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#2D4A3E] mb-2">Phone Number *</label>
                  <input
                    placeholder="+971 50 123 4567"
                    value={address.phone || ""}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full border-2 border-[#E8DFD0] p-3 sm:p-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#2D4A3E] mb-2">Street Address *</label>
                  <input
                    placeholder="Building name, street name"
                    value={address.street || ""}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full border-2 border-[#E8DFD0] p-3 sm:p-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#2D4A3E] mb-2">City *</label>
                    <input
                      placeholder="Dubai"
                      value={address.city || ""}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full border-2 border-[#E8DFD0] p-3 sm:p-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#2D4A3E] mb-2">Zipcode *</label>
                    <input
                      placeholder="00000"
                      value={address.zipcode || ""}
                      onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
                      className="w-full border-2 border-[#E8DFD0] p-3 sm:p-4 rounded-xl bg-white text-[#2D4A3E] placeholder:text-[#6B7C72] focus:border-[#C8945C] focus:outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => setStep("summary")}
                  className="flex-1 border-2 border-[#E8DFD0] py-3 sm:py-4 rounded-xl bg-white text-[#2D4A3E] font-bold hover:bg-[#FAF7F2] transition-all text-sm sm:text-base"
                >
                  Back
                </button>

                <button
                  onClick={() => setStep("payment")}
                  className="flex-1 bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* PAYMENT STEP */}
          {step === "payment" && (
            <div className="space-y-4 sm:space-y-6">

              <div className="bg-gradient-to-br from-[#2D4A3E] to-[#3D5A4E] rounded-2xl p-5 sm:p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">Secure Payment</h4>
                    <p className="text-xs sm:text-sm text-[#C8945C]">Powered by Nomod</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm sm:text-base">Total Amount</span>
                    <span className="text-2xl sm:text-3xl font-bold">AED {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Security Features */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#E8DFD0]">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-[#C8945C] mb-2 sm:mb-3" />
                  <p className="font-semibold text-[#2D4A3E] text-xs sm:text-sm">256-bit SSL</p>
                  <p className="text-xs text-[#6B7C72] mt-1">Bank-grade encryption</p>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#E8DFD0]">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#C8945C] mb-2 sm:mb-3" />
                  <p className="font-semibold text-[#2D4A3E] text-xs sm:text-sm">PCI Compliant</p>
                  <p className="text-xs text-[#6B7C72] mt-1">Secure transactions</p>
                </div>
              </div>

              {/* Order Review */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-[#E8DFD0]">
                <h4 className="font-bold text-[#2D4A3E] mb-3 sm:mb-4 text-sm sm:text-base">Order Review</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[#6B7C72]">Product</span>
                    <span className="font-semibold text-[#2D4A3E] text-right max-w-[60%]">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[#6B7C72]">Size</span>
                    <span className="font-semibold text-[#2D4A3E]">{selectedSize} lbs</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[#6B7C72]">Quantity</span>
                    <span className="font-semibold text-[#2D4A3E]">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[#6B7C72]">Delivery to</span>
                    <span className="font-semibold text-[#2D4A3E]">{address.city || "..."}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => setStep("address")}
                  className="flex-1 border-2 border-[#E8DFD0] py-3 sm:py-4 rounded-xl font-bold bg-white text-[#2D4A3E] hover:bg-[#FAF7F2] transition-all text-sm sm:text-base"
                >
                  Back
                </button>

                <button
                  onClick={onPayNow}
                  className="flex-1 bg-gradient-to-r from-[#C8945C] to-[#B8844C] text-white py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  Complete Payment
                </button>
              </div>

              <p className="text-center text-xs text-[#6B7C72] px-4">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}