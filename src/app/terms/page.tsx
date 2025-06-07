
// Placeholder for Terms and Conditions page
import type { Metadata } from 'next';
import { AnimatedPage } from '@/components/shared/AnimatedPage';

export const metadata: Metadata = {
  title: 'شرایط خدمات',
  description: 'شرایط و ضوابط استفاده از وب‌سایت اسپرسو اج.',
};

export default function TermsPage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-right">
        <h1 className="text-3xl md:text-4xl font-headline text-secondary mb-8">شرایط خدمات</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
          <p>این یک صفحه نمونه برای شرایط خدمات است. لطفاً این متن را با محتوای واقعی خود جایگزین کنید.</p>
          <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
          <h2 className="font-headline text-secondary">۱. مقدمه</h2>
          <p>ادامه متن نمونه...</p>
          <h2 className="font-headline text-secondary">۲. استفاده از خدمات</h2>
          <p>ادامه متن نمونه...</p>
        </div>
      </div>
    </AnimatedPage>
  );
}
