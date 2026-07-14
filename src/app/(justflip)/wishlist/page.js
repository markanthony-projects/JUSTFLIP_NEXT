import WishlistClient from './WishlistClient';

export const metadata = {
  title: 'Your Wishlist | JustFlip',
  description: 'View and manage your saved real estate properties and projects on JustFlip. Keep track of prices, amenities, and locations.',
  keywords: 'real estate wishlist, saved properties, buy property, justflip favorites',
  openGraph: {
    title: 'Your Wishlist | JustFlip',
    description: 'View and manage your saved real estate properties on JustFlip.',
    type: 'website',
    siteName: 'JustFlip'
  },
  robots: {
    index: false,
    follow: true,
  }
};

export default function WishlistPage() {
  return <WishlistClient />;
}
