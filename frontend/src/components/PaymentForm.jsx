import React from 'react'

function PaymentForm() {
  return (
    <div className='bg-gray-100 flex items-center justify-center min-h-screen px-4'>
       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">💳 Secure Payment</h2>

    <form action="#" method="POST" className="space-y-5">

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700" for="cardName">Cardholder Name</label>
        <input id="cardName" name="cardName" type="text" required placeholder="John Doe"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700" for="cardNumber">Card Number</label>
        <input id="cardNumber" name="cardNumber" type="text" inputmode="numeric" required maxlength="19"
          placeholder="1234 5678 9012 3456"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium text-gray-700" for="expiry">Expiry Date</label>
          <input id="expiry" name="expiry" type="text" required placeholder="MM/YY"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium text-gray-700" for="cvc">CVC</label>
          <input id="cvc" name="cvc" type="text" inputmode="numeric" maxlength="4" required placeholder="123"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700" for="address">Billing Address</label>
        <input id="address" name="address" type="text" required placeholder="123 Main Street"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700" for="city">City</label>
        <input id="city" name="city" type="text" required placeholder="Constantine"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium text-gray-700" for="zip">Postal Code</label>
          <input id="zip" name="zip" type="text" required placeholder="10001"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div className="w-1/2">
          <label className="block mb-1 text-sm font-medium text-gray-700" for="country">Country</label>
          <select id="country" name="country" required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Select</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
            <option value="DZ">Algeria</option>
            <option value="CA">Canada</option>

          </select>
        </div>
      </div>

      <button type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300">
        💰 Pay Now
      </button>
    </form>

    <p className="text-sm text-center text-gray-500 mt-6">
      🔒 Your payment is secured with 256-bit encryption.
    </p>
  </div>
    </div>
  )
}

export default PaymentForm
