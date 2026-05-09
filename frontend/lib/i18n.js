'use client';

import { useEffect, useState } from 'react';

export const languages = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'km', label: 'ខ្មែរ', shortLabel: 'ខ្មែរ' },
  { code: 'zh', label: '中文', shortLabel: '中文' },
];

export const translations = {
  en: {
    books: 'Books',
    categories: 'Categories',
    orders: 'Orders',
    wishlist: 'Wishlist',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
    signup: 'Sign Up',
    search: 'Search books, authors...',
    searchMobile: 'Search books...',
    helpTitle: '24/7 Help',
    helpSubtitle: 'Auto response support',
    helpPlaceholder: 'Ask about orders, payment, delivery...',
    helpGreeting: 'Hi, I am Z Book support. Ask me about orders, payment, delivery, refunds, or contact.',
    helpDefault: 'Thanks for your question. Our support team is available 24/7. You can call +855 (0) 123 456 789 or email info@zbook.com.',
    helpOrder: 'For order status, open Orders, click View Details, and check the tracking timeline.',
    helpPayment: 'For payment, choose ABA QR, ACLEDA QR, card, bank transfer, mobile money, or cash on delivery at checkout.',
    helpDelivery: 'Delivery in Phnom Penh usually takes 1-2 days. Province delivery usually takes 2-4 days after confirmation.',
    helpRefund: 'Refunds and cancellations are available while the order is still pending.',
    helpContact: '24/7 contact: +855 (0) 123 456 789 or info@zbook.com.',
    send: 'Send',
    quickOrder: 'Track order',
    quickPayment: 'Payment help',
    quickDelivery: 'Delivery time',
    quickContact: 'Contact support',
  },
  km: {
    books: 'សៀវភៅ',
    categories: 'ប្រភេទ',
    orders: 'ការបញ្ជាទិញ',
    wishlist: 'បញ្ជីចូលចិត្ត',
    profile: 'ប្រវត្តិរូប',
    login: 'ចូលគណនី',
    logout: 'ចេញ',
    signup: 'បង្កើតគណនី',
    search: 'ស្វែងរកសៀវភៅ អ្នកនិពន្ធ...',
    searchMobile: 'ស្វែងរកសៀវភៅ...',
    helpTitle: 'ជំនួយ 24/7',
    helpSubtitle: 'ឆ្លើយតបស្វ័យប្រវត្តិ',
    helpPlaceholder: 'សួរអំពីការបញ្ជាទិញ ការទូទាត់ ការដឹកជញ្ជូន...',
    helpGreeting: 'សួស្តី ខ្ញុំជាជំនួយការ Z Book។ សួរខ្ញុំអំពីការបញ្ជាទិញ ការទូទាត់ ការដឹកជញ្ជូន ឬទំនាក់ទំនង។',
    helpDefault: 'អរគុណសម្រាប់សំណួរ។ ក្រុមការងារយើងអាចជួយបាន 24/7។ ទូរស័ព្ទ +855 (0) 123 456 789 ឬ info@zbook.com។',
    helpOrder: 'ដើម្បីតាមដានការបញ្ជាទិញ សូមចូល Orders ចុច View Details ហើយមើលតារាងស្ថានភាព។',
    helpPayment: 'ការទូទាត់មាន ABA QR, ACLEDA QR, កាត, ផ្ទេរធនាគារ, mobile money ឬបង់ពេលទទួល។',
    helpDelivery: 'ដឹកជញ្ជូនក្នុងភ្នំពេញប្រហែល 1-2 ថ្ងៃ។ តាមខេត្តប្រហែល 2-4 ថ្ងៃបន្ទាប់ពីបញ្ជាក់។',
    helpRefund: 'អាចលុប ឬសងប្រាក់វិញបាន ប្រសិនបើការបញ្ជាទិញនៅស្ថានភាព pending។',
    helpContact: 'ទំនាក់ទំនង 24/7: +855 (0) 123 456 789 ឬ info@zbook.com។',
    send: 'ផ្ញើ',
    quickOrder: 'តាមដាន',
    quickPayment: 'ជំនួយទូទាត់',
    quickDelivery: 'ពេលដឹក',
    quickContact: 'ទំនាក់ទំនង',
  },
  zh: {
    books: '图书',
    categories: '分类',
    orders: '订单',
    wishlist: '收藏',
    profile: '个人资料',
    login: '登录',
    logout: '退出',
    signup: '注册',
    search: '搜索图书、作者...',
    searchMobile: '搜索图书...',
    helpTitle: '24/7 帮助',
    helpSubtitle: '自动回复客服',
    helpPlaceholder: '询问订单、付款、配送...',
    helpGreeting: '您好，我是 Z Book 客服。您可以询问订单、付款、配送、退款或联系方式。',
    helpDefault: '感谢您的问题。我们的客服 24/7 在线。电话 +855 (0) 123 456 789，邮箱 info@zbook.com。',
    helpOrder: '查看订单状态：进入 Orders，点击 View Details，然后查看跟踪时间线。',
    helpPayment: '付款方式包括 ABA QR、ACLEDA QR、银行卡、银行转账、手机钱包或货到付款。',
    helpDelivery: '金边配送通常 1-2 天，外省通常确认后 2-4 天。',
    helpRefund: '订单仍为 pending 时可以取消或退款。',
    helpContact: '24/7 联系方式：+855 (0) 123 456 789 或 info@zbook.com。',
    send: '发送',
    quickOrder: '跟踪订单',
    quickPayment: '付款帮助',
    quickDelivery: '配送时间',
    quickContact: '联系客服',
  },
};

export const getLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('zbook-language') || 'en';
};

export const setLanguage = (language) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('zbook-language', language);
  window.dispatchEvent(new CustomEvent('zbook-language-change', { detail: language }));
};

export const useLanguage = () => {
  const [language, setCurrentLanguage] = useState(getLanguage);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail || getLanguage());
    };

    window.addEventListener('zbook-language-change', handleLanguageChange);
    return () => window.removeEventListener('zbook-language-change', handleLanguageChange);
  }, []);

  return {
    language,
    setLanguage,
    t: translations[language] || translations.en,
  };
};
