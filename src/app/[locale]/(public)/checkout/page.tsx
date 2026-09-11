'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QrCode, MapPin, Upload, CheckCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { swal } from '@/shared/lib/sweetalert';
import { api } from '@/shared/lib/api';
import { useCartStore } from '@/domains/shop/store/cartStore';
import styles from './CheckoutPage.module.css';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap wajib diisi'),
  phone: z.string().min(8, 'Nomor telepon tidak valid'),
  email: z.string().email('Format email tidak valid'),
  street: z.string().min(5, 'Alamat lengkap wajib diisi'),
  city: z.string().min(2, 'Kota/Kabupaten wajib diisi'),
  province: z.string().min(2, 'Provinsi wajib diisi'),
  zipCode: z.string().min(3, 'Kode pos wajib diisi'),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('checkout');

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = getSubtotal();
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      street: '',
      city: '',
      province: '',
      zipCode: '',
      notes: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProofFile(file);
      setProofPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) {
      swal.error('Keranjang Kosong', 'Silakan tambahkan produk ke keranjang terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create Order via API
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
          street: values.street,
          city: values.city,
          province: values.province,
          zipCode: values.zipCode,
        },
        notes: values.notes || undefined,
      };

      const res = await api.post('/orders', orderPayload);
      const createdOrder = res.data;

      // 2. Upload Payment Proof if selected
      if (paymentProofFile && createdOrder.id) {
        try {
          const formData = new FormData();
          formData.append('paymentProof', paymentProofFile);
          await api.post(`/orders/${createdOrder.id}/payment-proof`, formData);
        } catch {
          // Non-blocking if proof upload fails initially
        }
      }

      // 3. Success Feedback
      swal.success(
        locale === 'id' ? 'Pesanan Berhasil Dibuat!' : 'Order Placed Successfully!',
        locale === 'id'
          ? `Nomor Pesanan: ${createdOrder.orderNumber}`
          : `Order Number: ${createdOrder.orderNumber}`
      );

      clearCart();
      router.push(`/${locale}/checkout/success?orderNumber=${createdOrder.orderNumber}`);
    } catch (err: any) {
      swal.error('Gagal Membuat Pesanan', err.message || 'Terjadi kesalahan pada server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: 'center', padding: '64px 0' }}>
          <h2>Keranjang Anda Kosong</h2>
          <p style={{ margin: '16px 0 24px' }}>Silakan tambahkan produk ke keranjang terlebih dahulu.</p>
          <button
            type="button"
            className={styles.confirmBtn}
            style={{ width: 'auto', margin: '0 auto' }}
            onClick={() => router.push(`/${locale}/shop`)}
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.layout}>
          <div className={styles.mainForm}>
            {/* Shipping Address */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <MapPin size={22} />
                <span>{t('shippingAddress')}</span>
              </h2>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nama Lengkap *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Contoh: Budi Santoso"
                    {...register('fullName')}
                  />
                  {errors.fullName && <span className={styles.errorText}>{errors.fullName.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nomor Telepon / WA *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Contoh: 081234567890"
                    {...register('phone')}
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone.message}</span>}
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Email *</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="Contoh: budi@gmail.com"
                    {...register('email')}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Alamat Lengkap *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Jalan, No. Rumah, RT/RW, Kecamatan"
                    {...register('street')}
                  />
                  {errors.street && <span className={styles.errorText}>{errors.street.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Kota / Kabupaten *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Contoh: Bandung"
                    {...register('city')}
                  />
                  {errors.city && <span className={styles.errorText}>{errors.city.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Provinsi *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Contoh: Jawa Barat"
                    {...register('province')}
                  />
                  {errors.province && <span className={styles.errorText}>{errors.province.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Kode Pos *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Contoh: 40123"
                    {...register('zipCode')}
                  />
                  {errors.zipCode && <span className={styles.errorText}>{errors.zipCode.message}</span>}
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Catatan Pesanan (Opsional)</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Catatan khusus untuk penjual/kurir"
                    {...register('notes')}
                  />
                </div>
              </div>
            </div>

            {/* Payment Section (QRIS) */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <QrCode size={22} />
                <span>{t('payment.title')}</span>
              </h2>

              <div className={styles.qrisBox}>
                <div className={styles.qrisPlaceholder}>
                  <QrCode size={64} style={{ color: 'var(--color-primary-dark)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                    QRIS Cheerfully
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Scan via GoPay/OVO/ShopeePay/BCA/m-Banking
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '420px' }}>
                  {t('payment.qrisInstruction')}
                </p>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Upload Bukti Pembayaran (Opsional)</label>
                <label htmlFor="paymentProof" className={styles.uploadBox}>
                  <Upload size={32} style={{ margin: '0 auto 8px', color: 'var(--color-primary-dark)' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {paymentProofFile ? paymentProofFile.name : t('payment.dragDrop')}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Format: JPG, PNG (Max 5MB)
                  </span>
                  <input
                    id="paymentProof"
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                  />
                </label>

                {proofPreviewUrl && (
                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <img src={proofPreviewUrl} alt="Preview Bukti Bayar" className={styles.previewImage} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <aside className={styles.summarySidebar}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{t('orderSummary')}</h2>

              <div style={{ marginBottom: '16px' }}>
                {items.map(({ product, quantity }) => {
                  const name = locale === 'id' ? product.nameId : product.nameEn;
                  const itemPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                  return (
                    <div key={product.id} className={styles.orderItemRow}>
                      <span className={styles.orderItemName}>
                        {quantity}x {name}
                      </span>
                      <span>{formatCurrency(itemPrice * quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.95rem' }}>
                <span>Ongkos Kirim</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>GRATIS</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  paddingTop: '12px',
                  borderTop: '2px dashed var(--color-border)',
                  marginBottom: '24px',
                }}
              >
                <span>Total Bayar</span>
                <span style={{ color: 'var(--color-primary-dark)' }}>{formatCurrency(total)}</span>
              </div>

              <button type="submit" className={styles.confirmBtn} disabled={isSubmitting}>
                <CheckCircle size={20} />
                <span>{isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi Pesanan'}</span>
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
