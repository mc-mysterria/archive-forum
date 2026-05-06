import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {ReactNode} from 'react';
import { Providers } from '../providers'
import { HeaderServer } from '@/components/layout/header-server'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'

interface LocaleLayoutProps {
  children: ReactNode;
  params: {locale: string};
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: LocaleLayoutProps) {
  const messages = await getMessages();

  return (
    <Providers>
      <NextIntlClientProvider messages={messages}>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
          <HeaderServer locale={locale} />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>
        <Toaster />
      </NextIntlClientProvider>
    </Providers>
  );
}