"use client";
import "../../css/FloatingActionBar.css";
import { useRouter, usePathname } from "next/navigation";

const icons = [
  { src: "/assets/svgs/cart.svg", alt: "Cart", href: "/cart" },
  { src: "/assets/svgs/refresh.svg", alt: "Refresh", onClick: () => window.location.reload() },
  { src: "/assets/svgs/scrolltotop.svg", alt: "Scroll to Top", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
];

function FloatingActionBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fab-fixed-center">
      {icons.map((icon) => (
        <button
          key={icon.alt}
          onClick={() => {
            if (icon.href) {
              router.push(icon.href);
            } else if (icon.onClick) {
              icon.onClick();
            }
          }}
          className={`fab-btn ${pathname === icon.href ? 'fab-btn-cart-active' : ''}`}
          type="button"
        >
          <img src={icon.src} alt={icon.alt} className="fab-icon" />
        </button>
      ))}
    </div>
  );
}

export default FloatingActionBar;
