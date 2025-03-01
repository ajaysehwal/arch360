'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';


const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        {/* Success Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2 
          }}
          className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-6"
        >
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-mono text-gray-700">#TRX-89045-12948</p>
          </div>
        </motion.div>

        {/* Amount */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="my-8 text-center"
        >
          <span className="text-4xl font-bold text-gray-900">$149.99</span>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold 
                     flex items-center justify-center space-x-2 hover:bg-blue-700 
                     transition-colors duration-200"
          >
            <span>Return to Studio</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          A confirmation email has been sent to your registered email address
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;