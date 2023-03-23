import Link from "next/link";
import styles from "@/styles/Nav.module.css";
import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();
  const path = router.pathname;

  return (
    <nav className={styles.nav}>
      <Link
        href="/"
        className={path === "/" ? styles.navLinkActive : styles.navLink}
      >
        Search
      </Link>
      <Link
        href="/favorites"
        className={
          path === "/favorites" ? styles.navLinkActive : styles.navLink
        }
      >
        Favorites
      </Link>
    </nav>
  );
};

export default Nav;
