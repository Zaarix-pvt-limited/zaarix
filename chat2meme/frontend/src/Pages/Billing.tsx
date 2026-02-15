import React from 'react';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Basic',
        price: '$0',
        period: '/month',
        description: 'Perfect for getting started',
        features: [
            '5 Projects',
            'Basic Analytics',
            'Community Support',
            '1GB Storage'
        ],
        buttonText: 'Current Plan',
        highlight: false
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'Best for professionals',
        features: [
            'Unlimited Projects',
            'Advanced Analytics',
            'Priority Support',
            '10GB Storage',
            'Custom Domain'
        ],
        buttonText: 'Upgrade to Pro',
        highlight: true
    },
    {
        name: 'Enterprise',
        price: '$99',
        period: '/month',
        description: 'For large teams and orgs',
        features: [
            'Unlimited Everything',
            'Dedicated Support',
            'SLA',
            'Unlimited Storage',
            'SSO Integration'
        ],
        buttonText: 'Contact Sales',
        highlight: false
    }
];

const Billing = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h1>
                <p className="text-gray-600 dark:text-gray-400">Choose the plan that best fits your needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`rounded-2xl p-8 border ${plan.highlight
                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg scale-105'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                            } transition-all duration-300 hover:shadow-xl`}
                    >
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{plan.description}</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <div className={`rounded-full p-1 ${plan.highlight ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        <Check size={14} />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${plan.highlight
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                            }`}>
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Billing;
