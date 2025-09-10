/** @jsxImportSource react */
import React, { useState } from 'react';

const App = () => {
  const [models, setModels] = useState([
    {
      id: 1,
      name: 'فستان صيفي أنيق',
      images: [
        'https://placehold.co/400x500/FF6B6B/FFFFFF?text=فستان+صيفي+1',
        'https://placehold.co/400x500/FF8E8E/FFFFFF?text=فستان+صيفي+2',
        'https://placehold.co/400x500/FF4747/FFFFFF?text=فستان+صيفي+3'
      ],
      price: 45000,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'أحمر', available: true, quantity: 15 },
        { name: 'أزرق', available: false, quantity: 0 },
        { name: 'أسود', available: true, quantity: 8 },
        { name: 'وردي', available: false, quantity: 0 },
        { name: 'أبيض', available: true, quantity: 12 }
      ],
      description: 'فستان صيفي خفيف ومناسب للمناسبات'
    },
    {
      id: 2,
      name: 'جاكيت شتوي كلاسيكي',
      images: [
        'https://placehold.co/400x500/4ECDC4/FFFFFF?text=جاكيت+شتوي+1',
        'https://placehold.co/400x500/66D9D0/FFFFFF?text=جاكيت+شتوي+2',
        'https://placehold.co/400x500/36BFB2/FFFFFF?text=جاكيت+شتوي+3'
      ],
      price: 65000,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'بني', available: true, quantity: 5 },
        { name: 'رمادي', available: true, quantity: 20 },
        { name: 'أخضر', available: false, quantity: 0 },
        { name: 'أحمر ناري', available: true, quantity: 3 }
      ],
      description: 'جاكيت شتوي دافئ وعازل للبرد'
    },
    {
      id: 3,
      name: 'طقم رياضي حديث',
      images: [
        'https://placehold.co/400x500/45B7D1/FFFFFF?text=طقم+رياضي+1',
        'https://placehold.co/400x500/5CC5E0/FFFFFF?text=طقم+رياضي+2',
        'https://placehold.co/400x500/2FA8C2/FFFFFF?text=طقم+رياضي+3'
      ],
      price: 35000,
      sizes: ['S', 'M', 'L'],
      colors: [
        { name: 'أزرق فاتح', available: false, quantity: 0 },
        { name: 'أسود', available: true, quantity: 25 },
        { name: 'أبيض', available: true, quantity: 18 },
        { name: 'أصفر', available: false, quantity: 0 }
      ],
      description: 'طقم رياضي مريح ومناسب للتمارين اليومية'
    }
  ]);

  const [cart, setCart] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    governorate: '',
    district: '',
    area: '',
    landmark: '',
    mobile: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = (model, color, size, quantity) => {
    const item = {
      id: Date.now(),
      modelId: model.id,
      modelName: model.name,
      image: model.images[0],
      price: model.price,
      color: color,
      size: size,
      quantity: quantity,
      total: model.price * quantity
    };
    
    setCart([...cart, item]);
    alert('تم إضافة المنتج إلى السلة!');
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const nextImage = (modelId) => {
    setActiveImageIndex(prev => ({
      ...prev,
      [modelId]: (prev[modelId] || 0) < (models.find(m => m.id === modelId)?.images.length - 1) 
        ? (prev[modelId] || 0) + 1 
        : 0
    }));
  };

  const prevImage = (modelId) => {
    setActiveImageIndex(prev => ({
      ...prev,
      [modelId]: (prev[modelId] || 0) > 0 
        ? (prev[modelId] || 0) - 1 
        : (models.find(m => m.id === modelId)?.images.length - 1) || 0
    }));
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

  const sendOrderToTelegram = async () => {
    if (!customerInfo.governorate || !customerInfo.district || !customerInfo.mobile) {
      alert('يرجى تعبئة الحقول الإلزامية (المحافظة، القضاء/المنطقة، رقم الموبايل)');
      return;
    }

    setIsSubmitting(true);
    
    // Format the order message for Telegram
    let orderMessage = `
🛍️ *طلب جديد من المتجر الإلكتروني*

📋 *معلومات العميل:*
- المحافظة: ${customerInfo.governorate}
- القضاء/المنطقة: ${customerInfo.district}
- المنطقة/الحي: ${customerInfo.area || 'غير محدد'}
- أقرب نقطة دالة: ${customerInfo.landmark || 'غير محدد'}
- رقم الموبايل: ${customerInfo.mobile}
- رقم واتساب: ${customerInfo.whatsapp || 'غير محدد'}

📦 *تفاصيل الطلب:*
`;
    
    cart.forEach((item, index) => {
      orderMessage += `
${index + 1}. *${item.modelName}*
   - اللون: ${item.color}
   - المقاس: ${item.size}
   - الكمية: ${item.quantity}
   - السعر: ${item.price.toLocaleString()} د.ع
   - المجموع: ${item.total.toLocaleString()} د.ع
`;
    });
    
    orderMessage += `
💰 *المجموع الكلي:* ${calculateCartTotal().toLocaleString()} د.ع

⏰ *وقت الطلب:* ${new Date().toLocaleString('ar-EG')}

📱 *يرجى التواصل مع العميل في أسرع وقت*
`;

    // In a real application, this would send to Telegram
    // For demo purposes, we'll just show it in console and alert
    console.log('Order to be sent to Telegram:', orderMessage);
    
    // Simulate sending to Telegram
    setTimeout(() => {
      setIsSubmitting(false);
      alert('تم إرسال طلبك بنجاح! 🎉\nسيتم التواصل معك في أقرب وقت ممكن.');
      setCart([]);
      setShowOrderForm(false);
      setCustomerInfo({
        governorate: '',
        district: '',
        area: '',
        landmark: '',
        mobile: '',
        whatsapp: ''
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">👗</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  متجر الأناقة
                </h1>
                <p className="text-sm text-gray-600">أفضل موديلات الملابس العصرية</p>
              </div>
            </div>
            
            <button
              onClick={() => cart.length > 0 && setShowOrderForm(true)}
              className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                سلة التسوق ({cart.length})
                {cart.length > 0 && (
                  <span className="mr-2 bg-white text-pink-600 rounded-full px-2.5 py-1 text-sm font-bold animate-bounce">
                    {cart.length}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">✨ تشكيلتنا الجديدة ✨</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اكتشف أحدث صيحات الموضة لدينا! نعرض لك ما هو متوفر وما هو غير متوفر لتسهيل عملية الاختيار.
          </p>
          <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
              ✅ متوفر
            </div>
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">
              ❌ غير متوفر
            </div>
          </div>
        </div>

        {/* Products Grid - 3 per row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {models.map((model) => (
            <div key={model.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group">
              {/* Product Images */}
              <div className="relative overflow-hidden">
                <div className="h-80 overflow-hidden">
                  <img 
                    src={model.images[activeImageIndex[model.id] || 0]} 
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Image Navigation */}
                {model.images.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(model.id)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 opacity-0 group-hover:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => nextImage(model.id)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 opacity-0 group-hover:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/30 backdrop-blur-sm rounded-full p-2">
                      {model.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex({...activeImageIndex, [model.id]: idx})}
                          className={`w-3 h-3 rounded-full transition-all ${
                            (activeImageIndex[model.id] || 0) === idx ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Sale Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  جديد
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                  {model.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {model.description}
                </p>
                
                <div className="flex items-center mb-5">
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {model.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-600 mr-1">د.ع</span>
                </div>
                
                {/* Colors */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">الألوان المتوفرة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {model.colors.map((color, colorIndex) => (
                      <div 
                        key={colorIndex} 
                        className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center transition-all ${
                          color.available 
                            ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 shadow-sm hover:shadow' 
                            : 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 line-through opacity-60 border border-red-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full mr-2 border-2 border-white shadow ${
                          color.name === 'أحمر' ? 'bg-red-500' :
                          color.name === 'أزرق' ? 'bg-blue-500' :
                          color.name === 'أسود' ? 'bg-black' :
                          color.name === 'وردي' ? 'bg-pink-500' :
                          color.name === 'أبيض' ? 'bg-white border border-gray-300' :
                          color.name === 'بني' ? 'bg-amber-700' :
                          color.name === 'رمادي' ? 'bg-gray-500' :
                          color.name === 'أخضر' ? 'bg-green-500' :
                          color.name === 'أصفر' ? 'bg-yellow-500' : 'bg-purple-500'
                        }`}></div>
                        {color.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Add to Cart Form */}
                <div className="border-t pt-5">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const selectedColor = formData.get('color');
                    const selectedSize = formData.get('size');
                    const quantity = parseInt(formData.get('quantity')) || 1;
                    
                    const colorObj = model.colors.find(c => c.name === selectedColor);
                    if (!colorObj || !colorObj.available) {
                      alert('اللون المختار غير متوفر');
                      return;
                    }
                    
                    addToCart(model, selectedColor, selectedSize, quantity);
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اللون</label>
                      <select
                        name="color"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                        required
                      >
                        <option value="">اختر اللون</option>
                        {model.colors.filter(c => c.available).map((color, idx) => (
                          <option key={idx} value={color.name}>{color.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">المقاس</label>
                      <select
                        name="size"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                        required
                      >
                        <option value="">اختر المقاس</option>
                        {model.sizes.map((size, idx) => (
                          <option key={idx} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        defaultValue="1"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      أضف إلى السلة 🛒
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-screen overflow-y-auto shadow-3xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">📦 إتمام الطلب</h2>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">🛒 سلة التسوق</h3>
                <div className="space-y-5 max-h-80 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center p-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100 hover:shadow-lg transition-shadow">
                      <img src={item.image} alt={item.modelName} className="w-20 h-20 object-cover rounded-xl shadow-md" />
                      <div className="mr-5 flex-1">
                        <h4 className="font-bold text-lg text-gray-800">{item.modelName}</h4>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">اللون: {item.color}</span>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">المقاس: {item.size}</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">الكمية: {item.quantity}</span>
                        </div>
                        <p className="text-xl font-bold text-purple-600 mt-2">{item.total.toLocaleString()} د.ع</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-2xl hover:bg-red-50 p-2 rounded-full transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                  <div>
                    <span className="text-lg text-gray-600">عدد المنتجات: </span>
                    <span className="text-2xl font-bold text-pink-600">{cart.length}</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-gray-800">المجموع الكلي: </span>
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {calculateCartTotal().toLocaleString()} د.ع
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">📍 معلومات التوصيل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">المحافظة *</label>
                    <input
                      type="text"
                      value={customerInfo.governorate}
                      onChange={(e) => setCustomerInfo({...customerInfo, governorate: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors text-lg"
                      placeholder="مثال: بغداد"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">القضاء/المنطقة *</label>
                    <input
                      type="text"
                      value={customerInfo.district}
                      onChange={(e) => setCustomerInfo({...customerInfo, district: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors text-lg"
                      placeholder="مثال: الكرادة"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">المنطقة/الحي</label>
                    <input
                      type="text"
                      value={customerInfo.area}
                      onChange={(e) => setCustomerInfo({...customerInfo, area: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors text-lg"
                      placeholder="مثال: منطقة 714"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">أقرب نقطة دالة</label>
                    <input
                      type="text"
                      value={customerInfo.landmark}
                      onChange={(e) => setCustomerInfo({...customerInfo, landmark: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors text-lg"
                      placeholder="مثال: مقابل مطعم فلان"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">رقم الموبايل *</label>
                    <input
                      type="tel"
                      value={customerInfo.mobile}
                      onChange={(e) => setCustomerInfo({...customerInfo, mobile: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors text-lg"
                      placeholder="07XXXXXXXX"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">رقم واتساب</label>
                    <input
                      type="tel"
                      value={customerInfo.whatsapp}
                      onChange={(e) => setCustomerInfo({...customerInfo, whatsapp: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors text-lg"
                      placeholder="07XXXXXXXX"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-end space-x-6 space-x-reverse">
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all text-lg font-bold hover:shadow-lg transform hover:scale-105"
                >
                  الرجوع
                </button>
                <button
                  onClick={sendOrderToTelegram}
                  disabled={isSubmitting || cart.length === 0}
                  className={`px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center space-x-3 space-x-reverse ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      إرسال الطلب 📩
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 to-purple-700 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-4xl mb-4">👗</div>
          <h3 className="text-3xl font-bold mb-4">متجر الأناقة</h3>
          <p className="text-xl mb-2">أفضل موديلات الملابس العصرية</p>
          <p className="text-pink-100 text-lg">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
          <div className="mt-8 pt-8 border-t border-pink-300">
            <p className="text-pink-100">تم تصميم هذا المتجر لتسهيل عملية الشراء والتوصيل</p>
            <p className="text-pink-100 mt-2">للاستفسارات: تواصل معنا عبر وسائل التواصل الاجتماعي</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
