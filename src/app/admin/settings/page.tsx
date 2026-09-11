'use client';

import React, { useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Settings } from '@/types';
import {
  Save,
  Upload,
  CheckCircle2,
  Store,
  Phone,
  Globe,
  Info,
  MapPin,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof Settings
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const form = new FormData();
    form.append('files', files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          [fieldName]: data.urls[0],
        }));
      } else {
        alert('فشل تحميل الصورة');
      }
    } catch (err) {
      console.error('File upload error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await refreshSettings();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('حدث خطأ أثناء حفظ الإعدادات');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white font-light">
            الإعدادات المركزية للمتجر
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            تعديل اسم المتجر، الهيرو، الشعار، رقم الواتساب، والمعلومات
            المركزية
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ الإعدادات بنجاح</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Store Branding */}
        <div className="p-6 bg-neutral-950 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-white/10 pb-3">
            <Store className="w-4 h-4" />
            <span>علامة المتجر والشعار</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">
                اسم المتجر
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName || ''}
                onChange={handleChange}
                className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                رابط أو صورة الشعار
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl || ''}
                  onChange={handleChange}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                />

                <label className="px-3 py-3 bg-neutral-900 border border-white/15 hover:border-amber-400 rounded-xl cursor-pointer text-neutral-300 flex-shrink-0">
                  <Upload className="w-4 h-4" />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, 'logoUrl')
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="p-6 bg-neutral-950 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-white/10 pb-3">
            <Globe className="w-4 h-4" />
            <span>القسم الرئيسي (Hero Section)</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-400 mb-1">
                صورة الهيرو الرئيسية
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="heroImage"
                  value={formData.heroImage || ''}
                  onChange={handleChange}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                />

                <label className="px-3 py-3 bg-neutral-900 border border-white/15 hover:border-amber-400 rounded-xl cursor-pointer text-neutral-300 flex-shrink-0">
                  <Upload className="w-4 h-4" />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, 'heroImage')
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1">
                  عنوان الهيرو (عربي)
                </label>

                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle || ''}
                  onChange={handleChange}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">
                  عنوان الهيرو (English)
                </label>

                <input
                  type="text"
                  name="heroTitleEn"
                  value={formData.heroTitleEn || ''}
                  onChange={handleChange}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                وصف الهيرو النصي
              </label>

              <textarea
                rows={2}
                name="heroDescription"
                value={formData.heroDescription || ''}
                onChange={handleChange}
                className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="p-6 bg-neutral-950 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-white/10 pb-3">
            <Phone className="w-4 h-4" />
            <span>بيانات التواصل والواتساب الفلوتينج</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">
                رقم الواتساب الرئيسي (مع الرمز الدولي)
              </label>

              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber || ''}
                onChange={handleChange}
                placeholder="+963900000000"
                className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                رقم الهاتف الأرضي/المباشر
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">
                العنوان التجاري للمعرض
              </label>

              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                أوقات العمل اليومية
              </label>

              <input
                type="text"
                name="openingHours"
                value={formData.openingHours || ''}
                onChange={handleChange}
                className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Google Maps */}
          <div>
            <label className="block text-neutral-400 mb-1">
              رابط موقع المتجر على Google Maps
            </label>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 bg-neutral-900 border border-white/10 rounded-xl text-amber-400 flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>

              <input
                type="url"
                name="googleMaps"
                value={formData.googleMaps || ''}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <p className="text-[10px] text-neutral-500 mt-2">
              ضع رابط الموقع الدقيق للمتجر من Google Maps. سيُستخدم
              لفتح موقع المتجر مباشرة عند الضغط على الموقع في الموقع
              العام.
            </p>
          </div>
        </div>

        {/* About & Footer */}
        <div className="p-6 bg-neutral-950 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-white/10 pb-3">
            <Info className="w-4 h-4" />
            <span>نص من نحن وحقوق الفوتر</span>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">
              نص &quot;من نحن&quot;
            </label>

            <textarea
              rows={3}
              name="aboutUs"
              value={formData.aboutUs || ''}
              onChange={handleChange}
              className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">
              نص حقوق الفوتر (Footer Text)
            </label>

            <input
              type="text"
              name="footerText"
              value={formData.footerText || ''}
              onChange={handleChange}
              className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="p-4 bg-black border border-white/10 rounded-xl">
            <p className="text-neutral-500 text-[10px] mb-1">
              رابط المصمم
            </p>

            <p className="text-white font-medium">
              ABOUD WEB
            </p>

            <p className="text-[10px] text-neutral-600 mt-1">
              هذا الرابط ثابت ولا يمكن تعديله من لوحة التحكم.
            </p>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-amber-400 text-black text-xs font-semibold tracking-wider rounded-xl hover:bg-amber-300 shadow-xl disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />

            <span>
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
              }
