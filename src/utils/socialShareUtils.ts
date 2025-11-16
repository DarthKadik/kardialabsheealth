

export const shareOnX = (text: string, url?: string) => {
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  if (url) params.set('url', url);
  const xUrl = `https://twitter.com/intent/tweet?${params.toString()}`;
  window.open(xUrl, '_blank');
};

export const shareOnFacebook = (text: string, url?: string) => {
  const shareUrl = url || window.location.href;
  // Facebook Share Dialog accepts:
  // - u: URL to share (required)
  // - quote: optional prefilled quote text
  const params = new URLSearchParams();
  params.set('u', shareUrl);
  if (text) params.set('quote', text);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  window.open(facebookUrl, '_blank');
};

export const shareOnInstagram = (text: string) => {
  // Instagram does not support web-based URL sharing to feed/stories.
  // Best effort: use the Web Share API if available.
  if (navigator.share) {
    navigator.share({
      title: 'Share',
      text,
      url: window.location.href,
    }).catch(() => {});
  } else {
    alert('Instagram web share is not supported on browsers. Use system share instead.');
  }
};

export const shareOnWhatsapp = (text: string, url?: string) => {
  const message = [text, url].filter(Boolean).join(' ');
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

export const shareOnStrava = (text: string) => {
    if (navigator.share) {
        navigator.share({
          title: 'Share',
          text,
          url: window.location.href,
        }).catch(() => {});
      } else {
        alert('Strava web share is not supported on browsers. Use system share instead.');
      }
};

export const mobileShare = (text: string) => {
  if (navigator.share) {
    navigator.share({
      title: 'Share this',
      text: text,
      url: window.location.href,
    });
  } else {
    alert('Share is not supported on this device');
  }
};