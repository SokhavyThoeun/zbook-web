/**
 * Help Widget
 * 24/7 auto-response support panel
 */

'use client';

import { useEffect, useState } from 'react';
import { Headphones, MessageCircle, Send, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const getAnswerKey = (message) => {
  const text = message.toLowerCase();
  if (text.includes('order') || text.includes('track') || text.includes('status')) return 'helpOrder';
  if (text.includes('pay') || text.includes('aba') || text.includes('acleda') || text.includes('card') || text.includes('visa')) return 'helpPayment';
  if (text.includes('deliver') || text.includes('ship')) return 'helpDelivery';
  if (text.includes('refund') || text.includes('cancel')) return 'helpRefund';
  if (text.includes('contact') || text.includes('phone') || text.includes('help')) return 'helpContact';
  return 'helpDefault';
};

export default function HelpWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: t.helpGreeting },
  ]);

  useEffect(() => {
    setMessages((current) => {
      if (current.length !== 1 || current[0].from !== 'bot') return current;
      return [{ from: 'bot', text: t.helpGreeting }];
    });
  }, [t.helpGreeting]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const answerKey = getAnswerKey(trimmed);
    setMessages((current) => [
      ...current,
      { from: 'user', text: trimmed },
      { from: 'bot', text: t[answerKey] },
    ]);
    setMessage('');
  };

  const quickQuestions = [
    { label: t.quickOrder, text: 'How can I track my order status?' },
    { label: t.quickPayment, text: 'How can I pay?' },
    { label: t.quickDelivery, text: 'How long is delivery?' },
    { label: t.quickContact, text: 'How can I contact support?' },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-4 w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-xl border border-purple-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              <div>
                <h2 className="text-sm font-bold">{t.helpTitle}</h2>
                <p className="text-xs text-white/80">{t.helpSubtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 hover:bg-white/10"
              aria-label="Close help"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((item, index) => (
              <div
                key={`${item.from}-${index}`}
                className={`rounded-lg px-3 py-2 text-sm ${
                  item.from === 'user'
                    ? 'ml-10 bg-purple-600 text-white'
                    : 'mr-10 bg-white text-gray-700 shadow-sm'
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-gray-100 p-3">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => sendMessage(item.text)}
                  className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(message);
              }}
              className="flex gap-2"
            >
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t.helpPlaceholder}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-purple-600 px-3 py-2 text-white hover:bg-purple-700"
                aria-label={t.send}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-bold text-white shadow-xl hover:shadow-2xl"
      >
        <MessageCircle className="h-5 w-5" />
        {t.helpTitle}
      </button>
    </div>
  );
}
