
// Placeholder for Privacy Policy page
import type { Metadata } from 'next';
import { AnimatedPage } from '@/components/shared/AnimatedPage';

export const metadata: Metadata = {
  title: 'سیاست حفظ حریم خصوصی',
  description: 'سیاست حفظ حریم خصوصی وب‌سایت اسپرسو اج.',
};

export default function PrivacyPage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-right">
        <h1 className="text-3xl md:text-4xl font-headline text-secondary mb-8">سیاست حفظ حریم خصوصی</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
          <p>این یک صفحه نمونه برای سیاست حفظ حریم خصوصی است. لطفاً این متن را با محتوای واقعی خود جایگزین کنید.</p>
          <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
          <h2 className="font-headline text-secondary">۱. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
          <p>ادامه متن نمونه...</p>
          <h2 className="font-headline text-secondary">۲. چگونه از اطلاعات شما استفاده می‌کنیم</h2>
          <p>ادامه متن نمونه...</p>
        </div>
      </div>
    </AnimatedPage>
  );
}
